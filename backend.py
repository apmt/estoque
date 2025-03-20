from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3
from pydantic import BaseModel
import webbrowser
import threading
import sys
import time

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Connect to SQLite
conn = sqlite3.connect("estoque.db", check_same_thread=False)
cursor = conn.cursor()

# Create the table if it doesn't exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        preco REAL NOT NULL
    )
""")
conn.commit()

# Define Pydantic model
class Produto(BaseModel):
    nome: str
    quantidade: int
    preco: float

# Criar um produto
@app.post("/produtos/")
def criar_produto(produto: Produto):
    cursor.execute("INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)",
                    (produto.nome, produto.quantidade, produto.preco))
    conn.commit()
    return {"message": "Produto adicionado com sucesso!"}

# Listar todos os produtos
@app.get("/produtos/")
def listar_produtos():
    cursor.execute("SELECT * FROM produtos")
    produtos = cursor.fetchall()
    return [{"id": p[0], "nome": p[1], "quantidade": p[2], "preco": p[3]} for p in produtos]

# Atualizar produto
@app.put("/produtos/{produto_id}")
def atualizar_produto(produto_id: int, produto: Produto):
    cursor.execute("UPDATE produtos SET nome=?, quantidade=?, preco=? WHERE id=?",
                    (produto.nome, produto.quantidade, produto.preco, produto_id))
    conn.commit()
    return {"message": "Produto atualizado com sucesso!"}

# Remover produto
@app.delete("/produtos/{produto_id}")
def remover_produto(produto_id: int):
    cursor.execute("DELETE FROM produtos WHERE id=?", (produto_id,))
    conn.commit()
    return {"message": "Produto removido com sucesso!"}

# Serve the frontend
# app.mount("/", StaticFiles(directory="static", html=True), name="static")

def open_browser():
    webbrowser.open("http://127.0.0.1:8000")
    
# Auto-close after 10 minutes
def auto_shutdown():
    time.sleep(20)  # 600 seconds = 10 minutes
    print("Shutting down due to inactivity")
    sys.exit()

# Run FastAPI
if __name__ == "__main__":
    import uvicorn
    threading.Timer(1.5, open_browser).start()  # Wait 1.5s before opening the browser
    uvicorn.run(app, host="0.0.0.0", port=8000, log_config=None)

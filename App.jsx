import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
  background-color: #1e1e1e;
  color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: calc(33% - 10px);
  padding: 8px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: #2a2a2a;
  color: white;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProductItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  background-color: #2a2a2a;
  border-radius: 5px;
`;

const RemoveButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #a71d2a;
  }
`;


function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const response = await axios.get("http://127.0.0.1:8000/produtos/");
    setProdutos(response.data);
  };

  const adicionarProduto = async () => {
    if (!nome || !quantidade || !preco) return alert("Preencha todos os campos!");

    await axios.post("http://127.0.0.1:8000/produtos/", {
      nome,
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco)
    });

    setNome("");
    setQuantidade("");
    setPreco("");
    carregarProdutos();
  };

  const removerProduto = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/produtos/${id}`);
    carregarProdutos();
  };

  return (
    <Container>
      <Title>Controle de Estoque</Title>

      <div>
        <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input placeholder="Quantidade" type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        <Input placeholder="Preço" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
        <Button onClick={adicionarProduto}>Adicionar</Button>
      </div>

      <h2>Lista de Produtos</h2>
      <ProductList>
        {produtos.map((produto) => (
          <ProductItem key={produto.id}>
            {produto.nome} - {produto.quantidade} unidades - R$ {produto.preco.toFixed(2)}
            <RemoveButton onClick={() => removerProduto(produto.id)}>Remover</RemoveButton>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
}

export default App;

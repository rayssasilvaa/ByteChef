import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import data from "../../public/data.json";
import List from "./List"; // Componente extraído para mostrar produtos adicionados
import PaymentModal from "./PaymentModal";  // Importando o Modal de Pagamento

function Home() {
  const [search, setSearch] = useState(""); // Armazena o texto de busca
  const [addedProducts, setAddedProducts] = useState([]); // Lista de produtos no carrinho
  const [showModal, setShowModal] = useState(false);  // Controla o modal
  const [selectedProduct, setSelectedProduct] = useState(null);  // Produto selecionado para o modal

  // Função para adicionar produtos ao carrinho e abrir o modal
  const handleAddProduct = (product) => {
    setSelectedProduct(product);  // Armazena o produto para o modal
    setShowModal(true);  // Abre o modal
  };

  // Função para adicionar o produto ao carrinho com o método de pagamento
  const handleAddProductWithPayment = (product, paymentMethod) => {
    setAddedProducts((prev) => {
      const existing = prev.find((p) => p.Id === product.Id && p.paymentMethod === paymentMethod);

      if (existing) {
        return prev.map((p) =>
          p.Id === product.Id && p.paymentMethod === paymentMethod
            ? {
                ...p,
                quantity: p.quantity + 1,  // Incrementa a quantidade
                total: (p.quantity + 1) * p.Price,  // Recalcula o total
              }
            : p
        );
      } else {
        return [
          ...prev,
          { ...product, quantity: 1, total: product.Price, paymentMethod },
        ];
      }
    });
    setShowModal(false);  // Fecha o modal após adicionar
  };

  // Filtra os produtos com base no campo de busca
  const filteredItems = data.filter(
    (item) =>
      item.Item.toLowerCase().includes(search.toLowerCase()) ||
      item.Id.toString().includes(search)
  );

  // Calcula o total dos produtos adicionados
  const total = addedProducts.reduce((acc, item) => acc + item.total, 0);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      {/* Título e campo de busca */}
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-grow"
        />
        <FaSearch className="text-gray-500" />
      </div>

      {/* Resultados da busca */}
      {search && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Lista de Produtos</h2>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.Id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>{item.Item} - R${item.Price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddProduct(item)}  // Abre o modal quando o produto é clicado
                  className="text-blue-600 font-bold text-xl cursor-pointer"
                >
                  +
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Nenhum item encontrado.</p>
          )}
        </div>
      )}

      <hr className="my-6" />

      {/* Componente extraído: lista de produtos adicionados */}
      <List addedProducts={addedProducts} total={total} />

      {/* Modal de pagamento */}
      {showModal && (
        <PaymentModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}  // Fecha o modal
          onAdd={handleAddProductWithPayment}  // Adiciona o produto com pagamento
        />
      )}
    </main>
  );
}

export default Home;

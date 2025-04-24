import React, { useState } from "react";

function PaymentModal({ product, onClose, onAdd }) {
    const [paymentMethod, setPaymentMethod] = useState("cartão"); // Método de pagamento inicial, padrão "cartão"

    // Função para fechar o modal
    const handleClose = () => {
        onClose(); // Chama a função de fechamento passada como props
    };

    // Função para adicionar o produto com o método de pagamento escolhido
    const handleAdd = () => {
        onAdd(product, paymentMethod); // Passa o produto e o método de pagamento para a função onAdd
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-xl font-semibold mb-4">Escolha o Método de Pagamento</h3>
                <div className="mb-4">
                    <p className="font-semibold">{product.Item} - R${product.Price.toFixed(2)}</p>
                </div>

                {/* Seleção do método de pagamento */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setPaymentMethod("cartão")}
                        className={`px-4 py-2 rounded ${paymentMethod === "cartão" ? "bg-blue-600 text-white cursor-pointer" : "bg-gray-200 cursor-pointer"}`}
                    >
                        Cartão
                    </button>
                    <button
                        onClick={() => setPaymentMethod("dinheiro")}
                        className={`px-4 py-2 rounded ${paymentMethod === "dinheiro" ? "bg-blue-600 text-white cursor-pointer" : "bg-gray-200 cursor-pointer"}`}
                    >
                        Dinheiro
                    </button>
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentModal;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function List({ addedProducts, total }) {
    const [deliveryCount, setDeliveryCount] = useState(0); // Contagem de entregas
    const [selectedDate, setSelectedDate] = useState(''); // Data selecionada
    const navigate = useNavigate();

    const DELIVERY_FEE = 3.0; // Taxa de entrega fixa
    const deliveryTotal = deliveryCount * DELIVERY_FEE; // Total de entrega calculado
    const finalTotal = total + deliveryTotal; // Total final incluindo a entrega

    // Função que envia os dados para o localStorage
    const handleSend = () => {
        // Se houver entregas, adiciona ao item
        const deliveryItem = deliveryCount > 0
            ? [{
                Item: 'Entrega',
                quantity: deliveryCount,
                total: deliveryTotal,
                paymentMethod: 'dinheiro'
            }]
            : [];

        // Criando a nova venda com os produtos adicionados e entrega, se necessário
        const newSale = {
            date: selectedDate,
            products: [...addedProducts, ...deliveryItem],
            deliveryFee: deliveryTotal,
            total: finalTotal,
        };

        // Carrega as vendas anteriores e adiciona a nova venda
        const previousSales = JSON.parse(localStorage.getItem('monthlySales')) || [];
        const updatedSales = [...previousSales, newSale];
        localStorage.setItem('monthlySales', JSON.stringify(updatedSales)); // Armazena no localStorage

        navigate('/Mensal'); // Navega para a página Mensal
    };

    // Funções para aumentar e diminuir a contagem de entregas
    const increaseDelivery = () => setDeliveryCount(deliveryCount + 1);
    const decreaseDelivery = () => {
        if (deliveryCount > 0) setDeliveryCount(deliveryCount - 1);
    };

    // Agrupando os produtos por método de pagamento
    const groupedByPayment = addedProducts.reduce((groups, product) => {
        const method = product.paymentMethod || 'Outro';
        if (!groups[method]) groups[method] = [];
        groups[method].push(product);
        return groups;
    }, {});

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Produtos Adicionados</h2>

            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de hoje:
                </label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)} // Atualiza a data selecionada
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm w-full"
                />
            </div>

            <div className="space-y-1 mb-4">
                {Object.keys(groupedByPayment).map((method) => (
                    <div key={method}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {method === 'cartão' ? 'Cartão' : 'Dinheiro'}
                        </h3>
                        {groupedByPayment[method].map((item, index) => (
                            <p key={index} className="text-gray-700">
                                {item.Item} x{item.quantity} - R${item.total.toFixed(2)} ({item.paymentMethod})
                            </p>
                        ))}
                    </div>
                ))}

                {deliveryCount > 0 && (
                    <p className="text-orange-600 font-semibold">
                        Entrega x{deliveryCount} - R${deliveryTotal.toFixed(2)}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Adicionar entrega (R$3,00 cada):</p>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={decreaseDelivery}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        −
                    </button>
                    <span className="text-lg font-semibold">{deliveryCount}</span>
                    <button
                        type="button"
                        onClick={increaseDelivery}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        +
                    </button>
                </div>
            </div>

            <p className="font-semibold text-lg mb-4">
                Total com entrega: <span className="text-green-600">R${finalTotal.toFixed(2)}</span>
            </p>

            <button
                type="button"
                onClick={handleSend}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
            >
                Enviar
            </button>
        </div>
    );
}

export default List;

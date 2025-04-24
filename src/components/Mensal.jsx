import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Função para formatar a data
const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

function Mensal() {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);

    useEffect(() => {
        // Carrega as vendas salvas do localStorage
        const savedSales = JSON.parse(localStorage.getItem('monthlySales')) || [];
        setSales(savedSales);
    }, []);

    // Agrupa os produtos por método de pagamento
    const groupByPayment = (products) => {
        return products.reduce((groups, product) => {
            const method = product.paymentMethod || 'Outro';
            if (!groups[method]) groups[method] = [];
            groups[method].push(product);
            return groups;
        }, {});
    };

    const handleClear = () => {
        // Limpa as vendas no localStorage e reseta o estado
        localStorage.removeItem('monthlySales');
        setSales([]);
        navigate('/'); // Redireciona para a página inicial
    };

    return (
        <div className="mt-20 px-4 py-8 max-w-3xl mx-auto bg-gray-50 rounded-xl border border-gray-200">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                Resumo Mensal
            </h1>

            <div className="space-y-12">
                {sales.map(({ date, products, total }, index) => {
                    const grouped = groupByPayment(products);

                    return (
                        <section key={index} className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-700">📅 {formatDate(date)}</h2>

                            {Object.keys(grouped).map((paymentMethod) => (
                                <div key={paymentMethod}>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">
                                        {paymentMethod === 'cartão' ? 'Cartão' : 'Dinheiro'}
                                    </h3>
                                    <ul className="space-y-1">
                                        {grouped[paymentMethod].map((product, i) => (
                                            <li key={i} className="flex justify-between text-sm text-gray-700">
                                                <span>{product.Item} x{product.quantity}</span>
                                                <span>R${product.total.toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div className="text-sm font-medium text-gray-800 pt-2">
                                Total do dia: <span className="text-green-600 font-semibold">R${total?.toFixed(2) ?? '0.00'}</span>
                            </div>

                            {index !== sales.length - 1 && (
                                <hr className="border-gray-300" />
                            )}
                        </section>
                    );
                })}

                {sales.length === 0 && (
                    <p className="text-center text-gray-500">Nenhuma venda registrada ainda.</p>
                )}

                <div className="text-center pt-6">
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full transition"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Mensal;

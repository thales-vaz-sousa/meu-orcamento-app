import React, { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input'; 
import Button from '../components/Button'; 
import { addIncome } from '../services/dataService'; 
import { useNavigate } from 'react-router-dom';

const IncomeRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Salário', // Valor inicial sugerido
        date: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

    const categories = ['Salário', 'Freelance', 'Investimento', 'Aluguel', 'Outras'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage(null);
        setError(null);

        try {
            await addIncome(formData);
            
            setSuccessMessage("Receita registrada com sucesso! Redirecionando...");
            
            // Limpa o formulário após 1 segundo e redireciona para o Dashboard
            setTimeout(() => {
                setFormData({
                    description: '',
                    amount: '',
                    category: 'Salário',
                    date: new Date().toISOString().split('T')[0],
                });
                navigate('/dashboard'); // Ajuste o caminho se necessário
            }, 1000);

        } catch (err) {
            console.error("Erro ao adicionar receita:", err);
            setError("Falha ao registrar a receita. Verifique os dados e sua conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-success-green mb-6">
                    Registro de Receita
                </h1>
                
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-5">
                    
                    {/* Descrição */}
                    <Input 
                        label="Descrição da Receita" 
                        type="text" 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    {/* Valor */}
                    <Input 
                        label="Valor (R$)" 
                        type="number" 
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                        placeholder="Ex: 2500.00"
                        required
                    />

                    {/* Categoria (Usando um select para simplificar) */}
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Categoria
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-3 border border-secondary-gray/30 rounded-lg focus:ring-primary-blue focus:border-primary-blue transition duration-150"
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Data */}
                    <Input 
                        label="Data da Receita" 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    
                    {/* Mensagens de Feedback */}
                    {error && <p className="text-danger-red text-sm mt-3">{error}</p>}
                    {successMessage && <p className="text-success-green text-sm mt-3 font-semibold">{successMessage}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-success-green hover:bg-green-700 text-white py-3 font-bold text-lg rounded-xl transition duration-200"
                    >
                        {loading ? 'Salvando...' : 'Registrar Receita'}
                    </Button>
                </form>
            </div>
        </Layout>
    );
};

export default IncomeRegister;
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { addBudget, getBudgets } from '../services/dataService'; // Assumindo getBudgets existe
import { FaMoneyBillAlt } from 'react-icons/fa';

const getCurrentMonthYear = () => {
    return new Date().toISOString().slice(0, 7); // Formato YYYY-MM
};

const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

const Orcamentos = () => {
    const currentMonthYear = getCurrentMonthYear();
    
    // Estado do Formulário
    const [budgetAmount, setBudgetAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentBudget, setCurrentBudget] = useState(null);

    // Efeito para carregar o orçamento existente do mês atual
    useEffect(() => {
        const fetchCurrentBudget = async () => {
            try {
                // Assumindo que getBudgets retorna todos os orçamentos
                const budgets = await getBudgets(); 
                const current = budgets.find(b => b.monthYear === currentMonthYear);
                
                if (current) {
                    // Preenche o campo com o valor existente
                    setCurrentBudget(parseFloat(current.amount));
                    setBudgetAmount(current.amount.toString());
                } else {
                    setCurrentBudget(0);
                    setBudgetAmount('');
                }
            } catch (err) {
                console.error("Erro ao carregar orçamento:", err);
                setError("Falha ao carregar o orçamento anterior.");
            }
        };
        fetchCurrentBudget();
    }, [currentMonthYear]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (isNaN(parseFloat(budgetAmount))) {
            setError("Por favor, insira um valor numérico válido.");
            setLoading(false);
            return;
        }

        try {
            await addBudget(currentMonthYear, budgetAmount);
            setCurrentBudget(parseFloat(budgetAmount));
            setSuccessMessage(`Orçamento de ${formatMonthYear(currentMonthYear)} atualizado para ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(budgetAmount))}.`);
            
        } catch (err) {
            console.error("Erro ao salvar orçamento:", err);
            setError("Falha ao salvar o orçamento. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-primary-blue mb-2">
                    Configuração de Orçamento
                </h1>
                <p className="text-lg text-text-dark mb-6">
                    Defina o limite máximo de gastos para <span className="font-semibold text-primary-blue">{formatMonthYear(currentMonthYear)}</span>.
                </p>

                {/* Cartão de Orçamento Atual */}
                <div className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center mb-6 border-l-4 border-primary-blue/70">
                    <span className="text-lg font-medium text-text-dark">Orçamento Atual:</span>
                    <span className="text-2xl font-bold text-primary-blue">
                        {currentBudget === null ? '...' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentBudget)}
                    </span>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-5">
                    
                    <Input 
                        label={`Limite Orçado para ${formatMonthYear(currentMonthYear)} (R$)`}
                        type="number" 
                        name="amount"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        step="0.01"
                        placeholder="Ex: 3000.00"
                        required
                    />

                    {error && <p className="text-danger-red text-sm mt-3">{error}</p>}
                    {successMessage && <p className="text-success-green text-sm mt-3 font-semibold">{successMessage}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-blue hover:bg-indigo-700 text-white py-3 font-bold text-lg rounded-xl transition duration-200 flex items-center justify-center space-x-2"
                    >
                        <FaMoneyBillAlt className="w-5 h-5" />
                        <span>{loading ? 'Salvando...' : 'Salvar Orçamento'}</span>
                    </Button>
                </form>
            </div>
        </Layout>
    );
};

export default Orcamentos;
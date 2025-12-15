import { useState, useEffect } from 'react';
import { getExpenses, getBudgets, getIncomes } from '../services/dataService'; 
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para buscar e gerenciar todos os dados financeiros.
 */
const useExpenses = () => {
    const { currentUser } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [incomes, setIncomes] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados de Resumo
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [totalIncomes, setTotalIncomes] = useState(0); 
    const [totalBalance, setTotalBalance] = useState(0); 
    
    // ESTADO DO GRÁFICO: Armazenará os dados de distribuição por categoria
    const [expensesByCategory, setExpensesByCategory] = useState([]); 


    // FUNÇÃO AUXILIAR: Cálculo da Distribuição por Categoria
    const calculateCategoryDistribution = (expenseData) => {
        const categoryMap = {};
        let totalExpenseAmount = 0;

        // 1. Somar valores por categoria (usando valor absoluto)
        expenseData.forEach(expense => {
            // O valor da despesa (`expense.amount`) deve ser NEGATIVO no Firebase.
            const amount = parseFloat(expense.amount) * -1; // Transforma o valor em positivo para o cálculo de %
            const category = expense.category || 'Não Categorizado';
            
            if (amount > 0) { // Garante que apenas despesas positivas (em valor absoluto) entrem no gráfico
                 categoryMap[category] = (categoryMap[category] || 0) + amount;
                 totalExpenseAmount += amount;
            }
        });

        if (totalExpenseAmount === 0) {
            setExpensesByCategory([]);
            return;
        }

        // 2. Calcular a porcentagem
        const distribution = Object.keys(categoryMap).map(category => ({
            name: category,
            value: categoryMap[category],
            // Arredonda para duas casas decimais
            percent: parseFloat(((categoryMap[category] / totalExpenseAmount) * 100).toFixed(2))
        }));

        // Ordenar por valor decrescente e atualizar o estado
        setExpensesByCategory(distribution.sort((a, b) => b.value - a.value));
    };


    // FUNÇÃO PRINCIPAL: Calcula todos os totais
    const calculateTotals = (expenseData, budgetsData, incomeData) => {
        let totalGeral = 0;
        let totalDoMes = 0;
        let totalOrcadoDoMes = 0; 
        let totalReceitas = 0; 

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const currentMonthYear = today.toISOString().slice(0, 7);

        // 1. CÁLCULO DAS DESPESAS
        expenseData.forEach(expense => {
            const amount = parseFloat(expense.amount);
            totalGeral += amount;

            const expenseDate = new Date(expense.date + 'T00:00:00');
            if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                totalDoMes += amount;
            }
        });

        // 2. CÁLCULO DOS ORÇAMENTOS
        budgetsData.forEach(budget => {
            if (budget.monthYear === currentMonthYear) {
                totalOrcadoDoMes += parseFloat(budget.amount);
            }
        });

        // 3. CÁLCULO DAS RECEITAS
        incomeData.forEach(income => { 
            totalReceitas += parseFloat(income.amount);
        });

        // 4. CÁLCULO FINAL DO SALDO TOTAL
        const saldo = totalReceitas + totalGeral; // totalGeral é negativo

        // 5. CÁLCULO DA DISTRIBUIÇÃO DO GRÁFICO (REMOVIDO DAQUI)

        // Atualiza os estados
        setTotalExpenses(totalGeral);
        setMonthlyExpenses(totalDoMes);
        setRemainingBudget(totalOrcadoDoMes + totalDoMes); 
        setTotalIncomes(totalReceitas); 
        setTotalBalance(saldo); 
    };

    // FUNÇÃO DE BUSCA: Busca todos os dados no Firebase
    const fetchExpensesAndBudgets = async () => {
        if (!currentUser) {
            setExpenses([]);
            setBudgets([]);
            setIncomes([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const [expenseData, budgetData, incomeData] = await Promise.all([
                getExpenses(),
                getBudgets(),
                getIncomes(), 
            ]);

            // Ordena as despesas e receitas pela data
            setExpenses(expenseData.sort((a, b) => new Date(b.date) - new Date(a.date)));
            setBudgets(budgetData);
            setIncomes(incomeData.sort((a, b) => new Date(b.date) - new Date(a.date)));

            calculateTotals(expenseData, budgetData, incomeData); 

        } catch (err) {
            console.error("ERRO CRÍTICO na busca de dados:", err);
            setError("Não foi possível carregar seus dados financeiros.");
            setExpenses([]);
            setBudgets([]);
            setIncomes([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para buscar dados na montagem ou login/logout
    useEffect(() => {
        if (currentUser) {
            fetchExpensesAndBudgets();
        } else {
             setExpenses([]);
             setBudgets([]);
             setIncomes([]);
             setLoading(false);
        }
    }, [currentUser]); 
    
    // NOVO useEffect para recalcular o gráfico quando a lista de despesas for atualizada
    useEffect(() => {
        if (expenses.length > 0) {
            // APENAS despesas que são negativas (gastos) devem ser calculadas
            const actualExpenses = expenses.filter(e => parseFloat(e.amount) < 0);
            if (actualExpenses.length > 0) {
                 calculateCategoryDistribution(actualExpenses);
            } else {
                setExpensesByCategory([]);
            }
        } else {
            // Se não houver despesas, limpa o estado do gráfico
            setExpensesByCategory([]); 
        }
    }, [expenses]); // Depende da lista de despesas


    return { 
        expenses, 
        budgets, 
        incomes,
        loading, 
        error, 
        fetchExpensesAndBudgets,
        totalExpenses,
        monthlyExpenses,
        remainingBudget,
        totalIncomes, 
        totalBalance,
        expensesByCategory, // Exportando os dados do gráfico
    };
};

export default useExpenses;
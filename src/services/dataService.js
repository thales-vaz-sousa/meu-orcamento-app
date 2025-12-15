import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  serverTimestamp,
  orderBy,
  deleteDoc, 
  updateDoc  
} from 'firebase/firestore';

// ⚠️ IMPORTAÇÃO ESSENCIAL: Importa as instâncias inicializadas de DB e AUTH do contexto.
import { db, auth } from '../context/AuthContext'; 

/**
 * Obtém o ID do usuário logado.
 * @returns {string | null} O ID do usuário.
 */
const getUserId = () => {
    // Retorna o UID do usuário logado
    return auth.currentUser ? auth.currentUser.uid : null; 
};

// --- FUNÇÕES DE DESPESAS ---

/**
 * Adiciona uma nova despesa ao Firestore na subcoleção do usuário.
 * Estrutura: users/{userId}/expenses/{expenseId}
 */
export const addExpense = async (expenseData) => {
    const userId = getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    const userExpensesCollectionRef = collection(db, 'users', userId, 'expenses');
    const newExpenseRef = doc(userExpensesCollectionRef);
    
    const dataToSave = {
        ...expenseData,
        amount: parseFloat(expenseData.amount), // Garante que o valor é salvo como número
        date: new Date(expenseData.date), // Converte a string YYYY-MM-DD em objeto Date
        createdAt: serverTimestamp(), // Data e hora que foi gravado no servidor
        type: 'Despesa'
    };

    await setDoc(newExpenseRef, dataToSave);
};

/**
 * Obtém todas as despesas do usuário.
 * @returns {Promise<Array>} Lista de despesas.
 */
export const getExpenses = async () => {
    const userId = getUserId();
    if (!userId) return []; 

    const userExpensesCollectionRef = collection(db, 'users', userId, 'expenses');
    
    // Cria a query para buscar os documentos ordenados por data
    const q = query(userExpensesCollectionRef, orderBy('date', 'desc')); 
    
    const querySnapshot = await getDocs(q); 

    const expensesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converte o Timestamp do Firestore de volta para string YYYY-MM-DD para exibição
        date: doc.data().date.toDate().toISOString().split('T')[0] 
    }));

    return expensesList;
};

// --- FUNÇÕES DE ORÇAMENTOS ---

/**
 * Adiciona ou atualiza um orçamento no Firestore.
 * @param {object} budgetData - Os dados do orçamento (category, amount, monthYear).
 */
/**
 * Adiciona ou atualiza o orçamento mensal do usuário.
 */
export const addBudget = async (monthYear, amount) => {
    const userId = getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    // Usa o ID do documento como 'YYYY-MM' (ex: 2025-12)
    const budgetDocRef = doc(db, 'users', userId, 'budgets', monthYear); 
    
    const dataToSave = {
        monthYear: monthYear,
        amount: parseFloat(amount),
        updatedAt: serverTimestamp(),
    };

    // setDoc com merge: true atualiza se existir ou cria se não existir
    await setDoc(budgetDocRef, dataToSave, { merge: true });
};


/**
 * Obtém todos os orçamentos definidos pelo usuário.
 * @returns {Promise<Array>} Lista de orçamentos.
 */
export const getBudgets = async () => {
    const userId = getUserId();
    if (!userId) return [];

    const userBudgetsCollectionRef = collection(db, 'users', userId, 'budgets');
    
    // Ordena pela categoria para facilitar a visualização
    const q = query(userBudgetsCollectionRef, orderBy('category', 'asc')); 
    
    const querySnapshot = await getDocs(q);
    
    const budgetsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    return budgetsList;
};

/**
 * Deleta uma despesa pelo seu ID.
 * @param {string} expenseId - O ID do documento da despesa.
 * @returns {Promise<void>}
 */
export const deleteExpense = async (expenseId) => {
    const userId = getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    // Define a referência exata do documento a ser deletado
    const expenseDocRef = doc(db, 'users', userId, 'expenses', expenseId);

    await deleteDoc(expenseDocRef);
};


/**
 * Atualiza uma despesa existente.
 * @param {string} expenseId - O ID do documento da despesa a ser atualizada.
 * @param {object} newData - Os novos dados da despesa (description, amount, category, date).
 * @returns {Promise<void>}
 */
export const updateExpense = async (expenseId, newData) => {
    const userId = getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    const expenseDocRef = doc(db, 'users', userId, 'expenses', expenseId);

    // Formata os dados para o Firestore
    const dataToUpdate = {
        ...newData,
        amount: parseFloat(newData.amount),
        // Garante que a data seja um objeto Date se for fornecida como string
        date: typeof newData.date === 'string' ? new Date(newData.date) : newData.date,
        updatedAt: serverTimestamp(),
    };

    await updateDoc(expenseDocRef, dataToUpdate);
};

// --- FUNÇÕES DE RECEITAS ---

/**
 * Adiciona uma nova receita ao Firestore.
 * Estrutura: users/{userId}/incomes/{incomeId}
 */
export const addIncome = async (incomeData) => {
    const userId = getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    // Usa a subcoleção 'incomes'
    const userIncomesCollectionRef = collection(db, 'users', userId, 'incomes');
    const newIncomeRef = doc(userIncomesCollectionRef);
    
    const dataToSave = {
        ...incomeData,
        amount: parseFloat(incomeData.amount),
        date: new Date(incomeData.date), 
        createdAt: serverTimestamp(),
        type: 'Receita' // Identifica o tipo de transação
    };

    await setDoc(newIncomeRef, dataToSave);
};


/**
 * Obtém todas as receitas do usuário.
 * @returns {Promise<Array>} Lista de receitas.
 */
export const getIncomes = async () => {
    const userId = getUserId();
    if (!userId) return []; 

    const userIncomesCollectionRef = collection(db, 'users', userId, 'incomes');
    
    const q = query(userIncomesCollectionRef, orderBy('date', 'desc')); 
    
    const querySnapshot = await getDocs(q); 

    const incomesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converte o Timestamp do Firestore de volta para string YYYY-MM-DD
        date: doc.data().date.toDate().toISOString().split('T')[0] 
    }));

    return incomesList;
};
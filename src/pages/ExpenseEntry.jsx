import React, { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { addExpense } from '../services/dataService'; // Importa a função de salvar no Firestore
import { useAuth } from '../context/AuthContext'; 

const ExpenseEntry = () => {
  const { currentUser } = useAuth(); // Para ter acesso ao usuário
  const [file, setFile] = useState(null);
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({ ...prev, [name]: value }));
  };

  // Funções para lidar com a Extração de Dados por IA (Google Cloud Vision)
  const handleAIScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    // O Google Cloud Vision não exige mais o pagamento de cota da OpenAI
    try {
        const formData = new FormData();
        // 'invoice' deve coincidir com o que a Netlify Function espera
        formData.append('invoice', file); 

        // Chamada ao endpoint da Netlify Function (agora com lógica do Google Vision)
        const response = await fetch('/.netlify/functions/analyze-invoice', { 
            method: 'POST', 
            body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
            setError(result.error || 'Erro desconhecido na análise da IA.');
            return;
        }

        // Preenche o formulário com os dados extraídos pelo Vision API
        setExpenseData({
          description: result.description || expenseData.description,
          // Garante que o valor é um número formatado para o input type="number"
          amount: result.amount ? parseFloat(result.amount).toFixed(2) : expenseData.amount,
          date: result.date || expenseData.date,
          category: result.category || expenseData.category,
        });
        
        alert('Dados extraídos com sucesso pela IA! Verifique e salve.');

    } catch (err) {
        setError('Falha na comunicação com o servidor de IA. Tente novamente.');
        console.error("Erro na extração da IA:", err);
    } finally {
        setLoading(false);
    }
  };

  // Funções para Salvar a Despesa no Firebase Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validação básica
    if (!expenseData.description || !expenseData.amount || !expenseData.date) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        setLoading(false);
        return;
    }

    try {
        // Envia os dados para o Firestore
        await addExpense(expenseData); 
        
        alert('Despesa salva com sucesso!');
        
        // Limpa o formulário após salvar
        setExpenseData({
            description: '',
            amount: '',
            date: '',
            category: '',
        });
        setFile(null); // Limpa o arquivo de fatura

    } catch (err) {
        console.error('Erro ao salvar despesa:', err);
        setError(`Falha ao salvar a despesa: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };


  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-primary-blue mb-6">
          Registrar Nova Despesa
        </h2>
        
        {/* Exibe o erro geral */}
        {error && (
            <div className="bg-danger-red/10 border-l-4 border-danger-red text-danger-red p-3 mb-4 rounded-md">
                {error}
            </div>
        )}

        {/* 📸 Seção de Upload com IA */}
        <div className="p-6 mb-6 border-2 border-dashed border-primary-blue/50 rounded-xl bg-primary-blue/5">
          <label className="block text-lg font-semibold text-primary-blue mb-3">
            Opção Rápida: Analisar Fatura por OCR
          </label>
          <input 
            type="file" 
            accept="image/*, application/pdf" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-blue file:text-white hover:file:bg-indigo-700"
          />
          <Button 
            onClick={handleAIScan}
            disabled={loading || !file}
            className={`mt-4 w-full ${loading ? 'opacity-60 cursor-not-allowed' : 'bg-success-green hover:bg-green-600'}`}
          >
            {loading ? 'Analisando Fatura...' : 'Extrair Dados com OCR'}
          </Button>
        </div>

        {/* ✍️ Formulário de Entrada Manual */}
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Descrição da Despesa" 
                  name="description"
                  value={expenseData.description} 
                  onChange={handleChange}
                  required
                />
                <Input 
                  label="Valor (R$)" 
                  type="number" 
                  name="amount"
                  value={expenseData.amount} 
                  onChange={handleChange}
                  step="0.01"
                  required
                />
                <Input 
                  label="Data da Compra" 
                  type="date" 
                  name="date"
                  value={expenseData.date} 
                  onChange={handleChange}
                  required
                />
                <Input 
                  label="Categoria" 
                  name="category"
                  value={expenseData.category} 
                  onChange={handleChange}
                  placeholder="Ex: Alimentação"
                  required
                />
            </div>
            
            <Button className="w-full mt-8 bg-primary-blue hover:bg-indigo-700 py-3 rounded-lg text-white font-bold transition" type="submit">
              Salvar Despesa
            </Button>
        </form>
      </div>
    </Layout>
  );
};
export default ExpenseEntry;
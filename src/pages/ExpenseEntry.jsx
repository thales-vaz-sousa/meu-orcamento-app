import React, { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button'; // Garanta que este componente exista

const ExpenseEntry = () => {
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

  const handleAIScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
        const formData = new FormData();
        // O nome 'invoice' deve coincidir com o que a Netlify Function espera (invoiceFile = files.invoice)
        formData.append('invoice', file); 

        // Chamada ao endpoint da Netlify Function
        const response = await fetch('/.netlify/functions/analyze-invoice', { 
            method: 'POST', 
            body: formData,
            // Não defina o Content-Type para multipart/form-data, o navegador faz isso automaticamente
        });

        const result = await response.json();
        
        if (!response.ok) {
            setError(result.error || 'Erro desconhecido na análise da IA.');
            return;
        }

        // Preenche o formulário com os dados extraídos
        setExpenseData({
          description: result.description || expenseData.description,
          amount: result.amount ? parseFloat(result.amount.replace('R$', '').replace(',', '.')).toFixed(2) : expenseData.amount,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar a despesa no seu banco de dados (próximo passo)
    console.log('Despesa a ser salva:', expenseData);
    alert('Despesa salva (simulação).');
  };

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-primary-blue mb-6">
          Registrar Nova Despesa
        </h2>
        
        {/* 📸 Seção de Upload com IA */}
        <div className="p-6 mb-6 border-2 border-dashed border-primary-blue/50 rounded-xl bg-primary-blue/5">
          <label className="block text-lg font-semibold text-primary-blue mb-3">
            Opção Rápida: Analisar Fatura por IA
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
            {loading ? 'Analisando Fatura...' : 'Extrair Dados com IA'}
          </Button>
          {error && (
            <p className="mt-3 text-sm text-danger-red font-medium">
                {error}
            </p>
          )}
        </div>

        {/* ✍️ Formulário Preenchido (ou manual) */}
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
            
            <Button className="w-full mt-8 bg-primary-blue hover:bg-indigo-700 py-3 rounded-lg text-white font-bold transition">
              Salvar Despesa
            </Button>
        </form>
      </div>
    </Layout>
  );
};
export default ExpenseEntry;
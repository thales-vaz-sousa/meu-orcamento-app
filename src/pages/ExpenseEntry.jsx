import React, { useState } from 'react';
// ... importar outros componentes como Input e Button

const ExpenseEntry = () => {
  const [file, setFile] = useState(null);
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAIScan = async () => {
    if (!file) return;
    setLoading(true);
    // 1. Normalmente, você enviaria 'file' para sua Netlify Function aqui.
    // 2. A função processaria, chamaria o OpenAI, e retornaria os dados.

    // *SIMULAÇÃO DE RESPOSTA DA IA (Dados EXTRAÍDOS)*
    try {
        // const response = await fetch('/.netlify/functions/scan-invoice', { method: 'POST', body: file });
        // const extractedData = await response.json();

        // SIMULANDO dados limpos da IA:
        const extractedData = {
          description: "Supermercado XYZ - Fatura Escaneada",
          amount: "450.75",
          date: "2025-12-14",
          category: "Alimentação",
        };
        
        setExpenseData(extractedData);
        alert('Dados extraídos com sucesso pela IA!');

    } catch (error) {
        console.error("Erro na extração da IA:", error);
        alert('Falha ao processar a fatura.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
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
          className="block w-full text-sm text-text-dark 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-blue file:text-white
            hover:file:bg-indigo-700
          "
        />
        <button 
          onClick={handleAIScan}
          disabled={loading || !file}
          className={`mt-4 px-6 py-2 rounded-full text-white font-semibold transition ${
            loading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-success-green hover:bg-green-600'
          }`}
        >
          {loading ? 'Analisando...' : 'Extrair Dados com IA'}
        </button>
      </div>

      {/* ✍️ Formulário Preenchido (ou manual) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <Input 
          label="Descrição" 
          value={expenseData.description} 
          onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
        />
        <Input 
          label="Valor (R$)" 
          type="number" 
          value={expenseData.amount} 
          onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
        />
        {/* Outros campos: Data, Categoria, etc. */}
        <button className="w-full mt-6 bg-primary-blue hover:bg-indigo-700 py-3 rounded-lg text-white font-bold transition">
          Salvar Despesa
        </button>
      </div>
    </div>
  );
};
export default ExpenseEntry;
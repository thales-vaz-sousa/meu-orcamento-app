import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteExpense, updateExpense } from '../services/dataService'; 
import Input from './Input'; 
import Button from './Button'; 

const ExpenseTable = ({ expenses, onExpenseChange }) => {
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(amount) || 0);
    };

    const openDeleteModal = (expense) => {
        setSelectedExpense(expense);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (expense) => {
        setSelectedExpense(expense);
        setEditFormData({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
        });
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsDeleteModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedExpense(null);
        setError(null);
    };
    
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async () => {
        if (!selectedExpense) return;
        setLoading(true);
        setError(null);

        try {
            await deleteExpense(selectedExpense.id);
            closeModals();
            await onExpenseChange(); 
        } catch (err) {
            console.error('Erro ao deletar despesa:', err);
            setError('Falha ao deletar a despesa. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedExpense) return;
        setLoading(true);
        setError(null);

        try {
            await updateExpense(selectedExpense.id, editFormData);
            closeModals();
            await onExpenseChange(); 
        } catch (err) {
            console.error('Erro ao atualizar despesa:', err);
            setError('Falha ao atualizar a despesa. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };
    
    if (expenses.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                <p className="text-lg text-text-dark font-medium">
                    Nenhuma despesa registrada ainda.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Adicione sua primeira despesa na aba "Novo Registro".
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Tabela com bordas e cores claras e tema CLARO */}
            <table className="min-w-full divide-y divide-secondary-gray">
                <thead className="bg-secondary-gray/70">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-text-dark uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-text-dark uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-gray">
                    {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-dark">
                                {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">
                                {expense.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">
                                {expense.date}
                            </td>
                            {/* Destaque para despesas com a cor customizada danger-red */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-danger-red text-right">
                                {formatCurrency(expense.amount * -1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => openEditModal(expense)}
                                        className="text-primary-blue hover:text-indigo-700 p-1 rounded-full hover:bg-primary-blue/10 transition"
                                        title="Editar"
                                    >
                                        <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(expense)}
                                        className="text-danger-red hover:text-red-700 p-1 rounded-full hover:bg-danger-red/10 transition"
                                        title="Deletar"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ----------------- MODAIS (Usando Cores Customizadas) ----------------- */}
            {isDeleteModalOpen && selectedExpense && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
                        <h3 className="text-xl font-bold text-danger-red mb-4">Confirmar Exclusão</h3>
                        <p className="text-text-dark mb-6">
                            Você tem certeza que deseja deletar a despesa: 
                            <span className="font-semibold"> {selectedExpense.description}</span> no valor de 
                            <span className="font-semibold text-danger-red"> {formatCurrency(selectedExpense.amount)}</span>?
                        </p>
                        
                        {error && <p className="text-sm text-danger-red mb-4">{error}</p>}
                        
                        <div className="flex justify-end space-x-3">
                            <Button 
                                onClick={closeModals} 
                                disabled={loading}
                                className="bg-secondary-gray/70 hover:bg-secondary-gray text-text-dark py-2 px-4 rounded-lg"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-danger-red hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold"
                            >
                                {loading ? 'Deletando...' : 'Deletar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedExpense && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-primary-blue mb-4">Editar Despesa</h3>
                        
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <Input 
                                label="Descrição" 
                                type="text" 
                                name="description"
                                value={editFormData.description} 
                                onChange={handleEditChange}
                                required
                            />
                            <Input 
                                label="Valor (R$)" 
                                type="number" 
                                name="amount"
                                value={editFormData.amount} 
                                onChange={handleEditChange}
                                step="0.01"
                                required
                            />
                            <Input 
                                label="Categoria" 
                                type="text" 
                                name="category"
                                value={editFormData.category} 
                                onChange={handleEditChange}
                                required
                            />
                            <Input 
                                label="Data" 
                                type="date" 
                                name="date"
                                value={editFormData.date} 
                                onChange={handleEditChange}
                                required
                            />
                            
                            {error && <p className="text-sm text-danger-red mt-4">{error}</p>}

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button 
                                    onClick={closeModals} 
                                    disabled={loading}
                                    type="button"
                                    className="bg-secondary-gray/70 hover:bg-secondary-gray text-text-dark py-2 px-4 rounded-lg"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary-blue hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-bold"
                                >
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTable;
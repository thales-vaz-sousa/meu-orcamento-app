import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Definição de cores (pode ser expandida/ajustada)
const COLORS = ['#FF4C6A', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e74c3c'];

// Renderiza o conteúdo personalizado do Tooltip
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">
                <p className="font-semibold text-text-dark">{data.name}</p>
                <p>Valor: R$ {data.value.toFixed(2).replace('.', ',')}</p>
                <p>Percentual: {data.percent}%</p>
            </div>
        );
    }
    return null;
};


const ExpensePieChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center text-text-dark/70">
                Nenhuma despesa registrada para o cálculo do gráfico.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%" // Centro X
                    cy="50%" // Centro Y
                    innerRadius={60} // Raio interno (para gráfico de rosca)
                    outerRadius={100} // Raio externo
                    fill="#8884d8"
                    paddingAngle={3} // Espaço entre as fatias
                    dataKey="value" // Campo de valor
                    nameKey="name" // Campo de nome/categoria
                    labelLine={false}
                    // Adicione labels se necessário: label={(entry) => `${entry.name} (${entry.percent}%)`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ExpensePieChart;
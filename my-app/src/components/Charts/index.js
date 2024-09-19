import React from 'react';
import { Bar, Pie } from '@ant-design/charts';
import './styles.css'; // Certifique-se de que esse arquivo de estilos existe

function ChartComponent({ sortedTransactions }) {
    console.log('Sorted Transactions:', sortedTransactions);

    if (!Array.isArray(sortedTransactions) || sortedTransactions.length === 0) {
        return <div>No transactions available</div>;
    }

    // Preparando os dados para o gráfico de barras
    const data = sortedTransactions.map((item) => ({
        date: item.date,
        amount: item.amount,
        type: item.type,
    }));

    // Preparando os dados para o gráfico de pizza
    const spendingData = sortedTransactions
        .filter(transaction => transaction.type === "despesa")
        .reduce((acc, curr) => {
            const existingTag = acc.find(item => item.tag === curr.tag);
            if (existingTag) {
                existingTag.amount += curr.amount;
            } else {
                acc.push({ tag: curr.tag, amount: curr.amount });
            }
            return acc;
        }, []);

    console.log('Spending Data:', spendingData);

    // Configuração do gráfico de barras
    const barConfig = {
        data,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
        seriesField: 'type',
        xAxis: {
            type: 'dateTime',
            tickCount: 5,
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`,
            },
        },
        colorField: 'type',
        color: {
            renda: '#4B9CE2',
            despesa: '#FF6F61',
        },
    };

    // Configuração do gráfico de pizza
    const pieConfig = {
        data: spendingData,
        autoFit: true,
        angleField: 'amount',
        colorField: 'tag',
        radius: 0.8,
        label: {
            offset: '-20%',
            content: '{name}\n{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
                fill: '#fff',
            },
        },
        interactions: [{ type: 'element-active' }],
    };

    return (
        <div className='charts-wrapper'>
            <div className='chart-container'>
                <h2 style={{ marginTop: 0 }}>Comparação de Despesas e Renda</h2>
                <Bar {...barConfig} />
            </div>
            <div className='chart-container'>
                <h2>Seus Gastos</h2>
                {spendingData.length === 0 ? (
                    <p>No spending data available</p>
                ) : (
                    <Pie {...pieConfig} />
                )}
            </div>
        </div>
    );
}

export default ChartComponent;


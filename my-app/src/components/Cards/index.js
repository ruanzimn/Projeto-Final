import React from 'react';
import './styles.css'; 
import { Card, Row } from 'antd';
import Button from '../Button'; 

function Cards({ income, expense, totalBalance, showExpenseModal, showIncomeModal }) {
  return (
    <div className="cards-container"> 
      <Row className="my-row">
        <Card bordered={true} className="my-card balance-card">
          <h2 className="card-title">Saldo Atual</h2>
          <p className="balance-amount">R${totalBalance.toFixed(2)}</p>
        </Card>

        <Card bordered={true} className="my-card income-card">
          <h2 className="card-title">Renda Total</h2>
          <p className="amount">R${income.toFixed(2)}</p> 
          <Button text="Adicionar Renda" blue={true} onClick={showIncomeModal} />
        </Card>

        <Card bordered={true} className="my-card expense-card">
          <h2 className="card-title">Despesa Total</h2>
          <p className="amount">R${expense.toFixed(2)}</p> 
          <Button text="Adicionar Despesa" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;

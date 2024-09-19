import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../Modals/addDespesa';
import AddIncomeModal from '../Modals/addRenda';
import { addDoc, collection, getDocs, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
    const [transactions, setTransactions] = useState([]); // Estado para armazenar transações
    const [loading, setLoading] = useState(false); // Estado para controle de carregamento
    const [user] = useAuthState(auth); // Estado para usuário autenticado
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false); // Estado para mostrar/ocultar modal de despesa
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false); // Estado para mostrar/ocultar modal de renda
    const [income, setIncome] = useState(0); // Estado para armazenar total de renda
    const [expense, setExpense] = useState(0); // Estado para armazenar total de despesa
    const [totalBalance, setTotalBalance] = useState(0); // Estado para armazenar saldo total

    const showExpenseModal = () => setIsExpenseModalVisible(true); // Abre modal de despesa
    const showIncomeModal = () => setIsIncomeModalVisible(true); // Abre modal de renda
    const handleExpenseCancel = () => setIsExpenseModalVisible(false); // Fecha modal de despesa
    const handleIncomeCancel = () => setIsIncomeModalVisible(false); // Fecha modal de renda

    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: values.date.format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };
        addTransaction(newTransaction); // Adiciona a nova transação
    };

    async function addTransaction(transaction) {
        try {
            const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
            console.log("Documento escrito com ID: ", docRef.id);
            toast.success("Transação adicionada!");
            setTransactions(prevTransactions => [...prevTransactions, transaction]); // Atualiza a lista de transações
            calculeteBalanece(); // Recalcula o saldo
        } catch (e) {
            console.error("Erro ao adicionar documento:", e);
            toast.error("Não foi possível adicionar a transação");
        }
    }

    async function updateTransaction(id, updatedTransaction) {
        try {
            const transactionDoc = doc(db, `users/${user.uid}/transactions`, id);
            await updateDoc(transactionDoc, updatedTransaction);
            toast.success('Transação atualizada com sucesso!');
        } catch (e) {
            toast.error('Erro ao atualizar a transação.');
        }
    }

    async function deleteTransaction(id) {
        try {
            const transactionDoc = doc(db, `users/${user.uid}/transactions`, id);
            await deleteDoc(transactionDoc);
            toast.success('Transação excluída com sucesso!');
            fetchTransactions(); // Atualiza a lista de transações após exclusão
        } catch (e) {
            toast.error('Erro ao excluir a transação.');
        }
    }

    useEffect(() => {
        if (user) {
            fetchTransactions(); // Busca transações ao montar o componente ou quando o usuário muda
        }
    }, [user]);

    useEffect(() => {
        calculeteBalanece(); // Recalcula saldo quando as transações mudam
    }, [transactions]);

    function calculeteBalanece() {
        let incomeTotal = 0;
        let expensesTotal = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "renda") {
                incomeTotal += transaction.amount;
            } else if (transaction.type === "despesa") {
                expensesTotal += transaction.amount;
            }
        });

        setIncome(incomeTotal);
        setExpense(expensesTotal);
        setTotalBalance(incomeTotal - expensesTotal); // Calcula saldo total
    }

    async function fetchTransactions() {
        setLoading(true);
        if (user) {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                transactionsArray.push({ ...doc.data(), id: doc.id });
            });
            setTransactions(transactionsArray); // Atualiza o estado com as transações
            console.log('Fetched Transactions:', transactionsArray);
        }
        setLoading(false);
    }

    let sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordena as transações por data

    return (
        <div>
            <Header />
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <Cards 
                        income={income}
                        expense={expense}
                        totalBalance={totalBalance}
                        showExpenseModal={showExpenseModal}
                        showIncomeModal={showIncomeModal}
                    />
                    {transactions.length > 0 ? (
                        <ChartComponent sortedTransactions={sortedTransactions} />
                    ) : (
                        <NoTransactions />
                    )}
                    <AddExpenseModal
                        isExpenseModalVisible={isExpenseModalVisible}
                        handleExpenseCancel={handleExpenseCancel}
                        onFinish={onFinish}
                    />
                    <AddIncomeModal
                        isIncomeModalVisible={isIncomeModalVisible}
                        handleIncomeCancel={handleIncomeCancel}
                        onFinish={onFinish}
                    />
                    <TransactionsTable 
                        transactions={transactions} 
                        addTransaction={addTransaction}
                        fetchTransactions={fetchTransactions}
                        updateTransaction={updateTransaction}
                        deleteTransaction={deleteTransaction}
                    />
                </>
            )}
        </div>
    );
}

export default Dashboard;

import React, { useState } from 'react';
import { Button, Modal, Table, Radio, Select, Input, Form, DatePicker } from 'antd';
import searchImg from "../../assets/searchImg.svg";
import { toast } from 'react-toastify';
import moment from 'moment';

function TransactionsTable({ transactions, fetchTransactions, updateTransaction, deleteTransaction }) {
    const { Option } = Select;
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const columns = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Valor",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Categoria",
            dataIndex: 'tag',
            key: "tag",
        },
        {
            title: "Tipo",
            dataIndex: 'type',
            key: "type",
        },
        {
            title: "Data",
            dataIndex: 'date',
            key: "date",
        },
        {
            title: "Ações",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '120px' }}>
                    <Button onClick={() => handleEdit(record)} size="small">Editar</Button>
                    <Button onClick={() => handleDelete(record.id)} danger size="small">Excluir</Button>
                </div>
            ),
        },
    ];

    const filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter ? item.type === typeFilter : true)
    );

    const sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            toast.success('Transação excluída com sucesso!');
            fetchTransactions();
        } catch (e) {
            toast.error('Erro ao excluir transação.');
        }
    };

    const handleUpdate = async (values) => {
        if (!editingTransaction) return;
        try {
            await updateTransaction(editingTransaction.id, {
                ...editingTransaction,
                ...values,
                date: values.date.format("YYYY-MM-DD"),
                amount: parseFloat(values.amount),
            });
            toast.success('Transação atualizada com sucesso!');
            setIsEditing(false);
            setEditingTransaction(null);
            fetchTransactions();
        } catch (e) {
            toast.error('Erro ao atualizar transação.');
        }
    };

    return (
        <div style={{ width: "97%", padding: "0rem 2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                <div className="input-flex">
                    <img src={searchImg} alt='ícone de pesquisa' width="16" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pesquisar"
                    />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filtrar"
                    allowClear
                >
                    <Option value="">Todos</Option>
                    <Option value="renda">Renda</Option>
                    <Option value="despesa">Despesa</Option>
                </Select>
            </div>
            <div className="my-table">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
                    <h2>Minhas Transações</h2>
                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">Nada</Radio.Button>
                        <Radio.Button value="date">Ordenar por data</Radio.Button>
                        <Radio.Button value="amount">Ordenar por valor</Radio.Button>
                    </Radio.Group>
                </div>
                <Table dataSource={sortedTransactions} columns={columns} rowKey="id" />
                <Modal
                    title="Editar Transação"
                    visible={isEditing}
                    onCancel={() => {
                        setIsEditing(false);
                        setEditingTransaction(null);
                    }}
                    footer={null}
                >
                    <Form
                        initialValues={{
                            name: editingTransaction?.name || '',
                            amount: editingTransaction?.amount || 0,
                            date: editingTransaction ? moment(editingTransaction.date) : null,
                            tag: editingTransaction?.tag || '',
                        }}
                        layout="vertical"
                        onFinish={handleUpdate}
                    >
                        <Form.Item
                            label="Nome"
                            name="name"
                            rules={[{ required: true, message: "Por favor insira o nome da transação!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Valor"
                            name="amount"
                            rules={[{ required: true, message: "Por favor insira o valor da transação!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Data"
                            name="date"
                            rules={[{ required: true, message: "Selecione a data da transação!" }]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item
                            label="Categoria"
                            name="tag"
                            rules={[{ required: true, message: "Selecione uma categoria!" }]}
                        >
                            <Select>
                                <Select.Option value="comida">Comida</Select.Option>
                                <Select.Option value="educação">Educação</Select.Option>
                                <Select.Option value="casa">Casa</Select.Option>
                                <Select.Option value="transporte">Transporte</Select.Option>
                                <Select.Option value="saude">Saúde</Select.Option>
                                <Select.Option value="salario">Salário</Select.Option>
                                <Select.Option value="freelance">Freelance</Select.Option>
                                <Select.Option value="investimento">Investimento</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Atualizar Transação
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default TransactionsTable;

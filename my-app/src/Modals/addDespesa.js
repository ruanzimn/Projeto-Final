import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm(); // Cria uma instância do formulário

  return (
    <Modal
      style={{ fontWeight: 600 }} // Define o estilo do modal
      title="Adicionar Despesa" // Título do modal
      visible={isExpenseModalVisible} // Controla a visibilidade do modal
      onCancel={handleExpenseCancel} // Função chamada ao cancelar o modal
      footer={null} // Remove o rodapé padrão do modal
    >
      <Form
        form={form} // Associa o formulário à instância criada
        layout="vertical" // Define o layout do formulário
        onFinish={(values) => {
          console.log('Form Values:', values); // Adiciona este log para depuração
          onFinish(values, "despesa"); // Chama a função onFinish com os valores do formulário e o tipo "despesa"
          form.resetFields(); // Reseta os campos do formulário
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Nome"
          name="name"
          rules={[{ required: true, message: "Por favor insira o nome da transação!" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Valor"
          name="amount"
          rules={[{ required: true, message: "Por favor insira o valor da despesa!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Data"
          name="date"
          rules={[{ required: true, message: "Selecione a data da despesa!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Categoria"
          name="tag"
          rules={[{ required: true, message: "Selecione uma categoria!" }]}
        >
          <Select>
            <Select.Option value="comida">Comida</Select.Option>
            <Select.Option value="educacao">Educação</Select.Option>
            <Select.Option value="casa">Casa</Select.Option>
            <Select.Option value="transporte">Transporte</Select.Option>
            <Select.Option value="saude">Saúde</Select.Option>
            {/* Adicione mais categorias aqui */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Adicionar Despesa
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('miqueias_tarefas', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const Usuario = sequelize.define('Usuario', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } }
}, {
    tableName: 'usuarios',
    freezeTableName: true,
});

const Tarefa = sequelize.define('Tarefa', {
    setor: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    prioridade: { type: DataTypes.ENUM('Baixa', 'Média', 'Alta'), allowNull: false },
    dataCadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('A fazer', 'Fazendo', 'Pronto'), defaultValue: 'A fazer' }
}, {
    tableName: 'tarefas',
    freezeTableName: true,
});

Tarefa.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

sequelize.sync().then(() => console.log('Banco sincronizado'));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => res.redirect('/usuarios'));
app.get('/usuarios', (req, res) => res.sendFile(path.join(__dirname, 'views/usuarios.html')));
app.get('/tarefas', (req, res) => res.sendFile(path.join(__dirname, 'views/tarefas.html')));
app.get('/gerenciar', (req, res) => res.sendFile(path.join(__dirname, 'views/gerenciar.html')));

app.post('/usuarios', (req, res) => {
    Usuario.create({ nome: req.body.nome, email: req.body.email }).then(() => {
        res.send(`
     
        <h2>Usuário cadastrado com sucesso!</h2>
        <a href="/usuarios">Voltar para a página de usuários</a>
     
    `);
    });
});

app.get('/usuarios/listar', (req, res) => {
    Usuario.findAll().then(usuarios => res.json(usuarios));
});

app.post('/tarefas', (req, res) => {
    Tarefa.create({
        usuarioId: req.body.usuarioId,
        setor: req.body.setor,
        descricao: req.body.descricao,
        prioridade: req.body.prioridade,
        dataCadastro: new Date(),
        status: 'A fazer'
    }).then(() => {
        res.send(`
        <h2>Tarefa cadastrada com sucesso!</h2>
        <a href="/tarefas">Voltar para a página de tarefas</a>
    `);
    });
});

app.get('/tarefas/listar', (req, res) => {
    Tarefa.findAll({ include: Usuario }).then(tarefas => res.json(tarefas));
});

app.post('/tarefas/status/:id', (req, res) => {
    Tarefa.update({ status: req.body.status }, { where: { id: req.params.id } })
        .then(() => res.send('Status atualizado!'));
});

app.post('/tarefas/excluir/:id', (req, res) => {
    Tarefa.destroy({ where: { id: req.params.id } })
        .then(() => res.send('Tarefa excluída!'));
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

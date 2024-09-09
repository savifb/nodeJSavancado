const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const pacienteRouter = require('./routes/paciente'); // Verifique se o caminho está correto

const app = express();

// Configurar o mecanismo de visualização
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Rotas
app.use('/pacientes', pacienteRouter);

// Rota raiz
app.get('/', (req, res) => {
  res.redirect('/pacientes');
});

// Middleware para tratar erros 404
app.use((req, res, next) => {
  res.status(404).send('Página não encontrada');
});

// Exportar a instância do Express
module.exports = app;
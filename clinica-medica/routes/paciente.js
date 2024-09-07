const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

// Função de validação de CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Listar pacientes
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    const error = req.session.error;
    req.session.error = null; // Limpar a mensagem de erro após exibi-la
    res.render('index', { title: 'Lista de Pacientes', pacientes, error });
  } catch (error) {
    res.status(500).send('Erro ao listar pacientes: ' + error.message);
  }
});

// Formulário para adicionar paciente
router.get('/new', (req, res) => {
  res.render('new');
});

// Inserir paciente
router.post('/', async (req, res) => {
  const { cpf, nomeCompleto, idade, diaMarcado, horaMarcada } = req.body;
  if (!validarCPF(cpf)) {
    req.session.error = 'CPF inválido';
    return res.redirect('/pacientes');
  }
  try {
    await Paciente.create({ cpf, nomeCompleto, idade, diaMarcado, horaMarcada });
    res.redirect('/pacientes');
  } catch (error) {
    req.session.error = 'Erro ao inserir paciente: ' + error.message;
    res.redirect('/pacientes');
  }
});

// Formulário para editar paciente
router.get('/:cpf/edit', async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.cpf);
    if (!paciente) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.render('edit', { paciente });
  } catch (error) {
    res.status(500).send('Erro ao buscar paciente: ' + error.message);
  }
});

module.exports = router;
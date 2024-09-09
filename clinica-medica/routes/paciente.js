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
    const success = req.session.success;
    req.session.error = null; // Limpar a mensagem de erro após exibi-la
    req.session.success = null; // Limpar a mensagem de sucesso após exibi-la
    res.render('pacientes/index', { title: 'Lista de Pacientes', pacientes, error, success });
  } catch (error) {
    res.status(500).send('Erro ao listar pacientes: ' + error.message);
  }
});

// Formulário para adicionar paciente
router.get('/new', (req, res) => {
  res.render('pacientes/new');
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
    req.session.success = 'Paciente inserido com sucesso';
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
    res.render('pacientes/edit', { paciente });
  } catch (error) {
    res.status(500).send('Erro ao buscar paciente: ' + error.message);
  }
});

// Atualizar paciente
router.put('/:cpf', async (req, res) => {
  const { nomeCompleto, idade, diaMarcado, horaMarcada } = req.body;
  try {
    const paciente = await Paciente.findByPk(req.params.cpf);
    if (!paciente) {
      return res.status(404).send('Paciente não encontrado');
    }
    paciente.nomeCompleto = nomeCompleto;
    paciente.idade = idade;
    paciente.diaMarcado = diaMarcado;
    paciente.horaMarcada = horaMarcada;
    await paciente.save();
    req.session.success = 'Paciente atualizado com sucesso';
    res.redirect('/pacientes');
  } catch (error) {
    req.session.error = 'Erro ao atualizar paciente: ' + error.message;
    res.redirect('/pacientes');
  }
});

// Deletar paciente
router.delete('/:cpf', async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.cpf);
    if (!paciente) {
      req.session.error = 'Paciente não encontrado';
      return res.redirect('/pacientes');
    }
    await paciente.destroy();
    req.session.success = 'Paciente deletado com sucesso';
    res.redirect('/pacientes');
  } catch (error) {
    req.session.error = 'Erro ao deletar paciente: ' + error.message;
    res.redirect('/pacientes');
  }
});

module.exports = router;
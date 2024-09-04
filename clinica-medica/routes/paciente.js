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
    res.render('pacientes/index', { pacientes });
  } catch (error) {
    res.status(500).send('Erro ao listar pacientes: ' + error.message);
  }
});

// Formulário para inserir paciente
router.get('/new', (req, res) => {
  res.render('pacientes/new');
});

// Inserir paciente
router.post('/', async (req, res) => {
  const { cpf, nomeCompleto, idade, diaMarcado, horaMarcada } = req.body;
  if (!validarCPF(cpf)) {
    return res.status(400).send('CPF inválido');
  }
  try {
    await Paciente.create({ cpf, nomeCompleto, idade, diaMarcado, horaMarcada });
    res.redirect('/pacientes');
  } catch (error) {
    res.status(400).send('Erro ao inserir paciente: ' + error.message);
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
  if (!validarCPF(req.params.cpf)) {
    return res.status(400).send('CPF inválido');
  }
  try {
    const [updated] = await Paciente.update({ nomeCompleto, idade, diaMarcado, horaMarcada }, { where: { cpf: req.params.cpf } });
    if (!updated) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.redirect('/pacientes');
  } catch (error) {
    res.status(400).send('Erro ao atualizar paciente: ' + error.message);
  }
});

// Apagar paciente
router.delete('/:cpf', async (req, res) => {
  try {
    const deleted = await Paciente.destroy({ where: { cpf: req.params.cpf } });
    if (!deleted) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.redirect('/pacientes');
  } catch (error) {
    res.status(400).send('Erro ao apagar paciente: ' + error.message);
  }
});

module.exports = router;
// routes/alunos.js
const express = require('express');
const router = express.Router();
const sequelize = require('../models/db');
const Aluno = require('../models/aluno');
// Sincroniza o modelo com o banco de dados
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
});
router.get('/', (req, res) => {
   res.render('layout', {title: 'Menu',body: 'alunos'});
    });
 router.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();//select * from ...
    res.status(200);
    res.render('alunos', {
      title: 'Lista de Alunos',body: 'alunos',alunos: alunos
    });}
  catch (error) {
    res.status(500);
    return res.render('error',{ title:'Erro',message:error.message,error:error});
  }
});
    

router.get('/alunos/add', (req, res) => {
  res.render('addaluno', { title: 'Adicionar Aluno' });
});
router.post('/alunos/add', async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    res.status(201);
    res.redirect('/alunos');
  } catch (error) {
    res.status(400);
    return res.render('error',{title:'Erro',message:error.message,error:error });
  }    
  });

router.get('/alunos/update', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.render('updatealuno', { alunos:alunos, title:'Atualizar Aluno' });
  } catch (error) {
    res.status(500);
    return res.render('error',{title:'Erro',message:error.message,error:error });
  }
  }); 

router.get('/alunos/update/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) {
      return res.status(404);
      return res.render('error',{title:'Erro',message:error.message,error:error });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500);
    return res.render('error',{title:'Erro',message:error.message,error:error });
  }
});
router.post('/alunos/update', async (req, res) => {
  const { alunoId, nome, idade } = req.body;
  try {
    await Aluno.update({ nome, idade }, {
      where: { id: alunoId }
    });
    res.status(204);
    res.redirect('/alunos'); // Redireciona para a página inicial ou outra página após a atualização
  } catch (error) {
    res.status(500);
    return res.render('error',{title:'Erro',message:error.message,error:error });
  }
});


router.get('/alunos/delete', (req, res) => {
  res.render('deletealuno', { title: 'Apagar Aluno' });
});
router.post('/alunos/delete', async(req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.body.id);
    if (!aluno) {res.status(404);
      return res.render('error',{ title:'Erro',
        message:"Aluno não encontrado",error:"" });
    }
    await aluno.destroy(); res.status(204); res.redirect('/alunos');
  } catch (error) {res.status(500);
   return res.render('error',{ title:'Erro',message: error.message,error: error});
  }
});
module.exports = router;

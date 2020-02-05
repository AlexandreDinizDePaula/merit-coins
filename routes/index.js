const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
require('../models/usuario')
const usuario = mongoose.model('usuarios')
const flash = require('connect-flash')
require('../models/premio')
const premio = mongoose.model('premios')
require('../models/doacao')
const doacao = mongoose.model('doacoes')
const passport = require('passport')

router.get('/login', (req,res)=>{
    res.render('usuarios/login')
})

router.post('/logar', (req,res, next) =>{
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: 'login',
        failureFlash: true
    })(req,res,next)
})


router.get('/', (req,res) =>{
    usuario.find().then((usuarios) =>{
        res.render('usuarios/index', {usuarios})
    }).catch((err) => {
        req.flash('erroMsg', 'Erro ao listar emails')
        res.redirect('/')
    })
})

router.post('/doar', (req,res) =>
{     
    const novadoacao = {
        emissor: req.body.emissor,
        recebedor: req.body.email,
        valor: req.body.valor,
        data: Date.now(),
        motivo: req.body.motivo
    }
    new doacao(novaDoacao).save().then(()=>{
        req.flash('successMsg', 'Doação realizada com sucesso')
        res.redirect('/')
    }).catch((err) => { 
        req.flash('errorMsg', "Erro ao realizar a doação")
        res.redirect('/')
    }) 
})

module.exports = router
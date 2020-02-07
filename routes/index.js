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
const {eUsuario} = require('../helpers/eUsuario')

router.get('/', (req,res)=>{
    res.render('usuarios/login')
})

router.post('/login',passport.authenticate("local"), (req,res, next) =>{
    if (req.user.eAdmin == 0){
        res.redirect('/usuario')
    }
    if (req.user.eAdmin == 1){
        res.redirect('/admin')
    }
})

router.get('/usuario',eUsuario, (req,res) =>{
    users = req.user
    usuario.find().then((usuarios) =>{
        res.render('usuarios/index', {usuarios, users})
    }).catch((err) => {
        req.flash('erroMsg', 'Erro ao listar emails')
        res.redirect('/usuario')
    })
})

router.post('/doar',eUsuario, (req,res) =>
{    
    if ((req.user.moedasParaDoar - req.body.quantidade) >=0 ){
        console.log('entrou no if')
        console.log(req.body.recebedor)
        usuario.findOne({email:req.body.recebedor}).then(usuario =>{
            console.log(usuario)
            usuario.carteira = usuario.carteira + req.body.quantidade
            usuario.save();  
            req.user.moedasParaDoar = (req.user.moedasParaDoar - req.body.quantidade) 
            req.user.save();
        
        })
        const novaDoacao = {
            emissor: req.user.email,
            recebedor: req.body.recebedor,
            quantidade: req.body.quantidade,
            data: Date.now(),
            motivo: req.body.motivo
        }
        new doacao(novaDoacao).save().then(()=>{
            req.flash('successMsg', 'Doação realizada com sucesso')
            res.redirect('/usuario')
        }).catch((err) => { 
            req.flash('errorMsg', "Erro ao realizar a doação")
            res.redirect('/usuario')
        }) 
        
    }
    else{
        req.flash('errorMsg', "Você não possui moedas suficiente para realizar esta doação")
            res.redirect('/usuario')
    }   
    
})

module.exports = router
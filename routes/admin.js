const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
require('../models/usuario')
const usuario = mongoose.model('usuarios')
const flash = require('connect-flash')

router.get('/', (req,res) => {
    res.render('admin/index')
})

router.get('/listausuarios', (req,res) => {
    usuario.find().then((usuarios) => {
        res.render('admin/listausuarios', {usuarios})
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro ao listar os usuários') 
    })
})

router.get('/listausuarios/editar/:id', (req,res) =>{
    usuario.findOne({_id:req.params.id}).then(usuario =>{
        console.log(usuario)
        res.render('admin/editausuario', {usuario:usuario})
    }).catch((err) => {
        req.flash('errorMsg','Usuário não encontrado')
        res.redirect('/admin/listausuarios')
    })
})

router.post('/listausuarios/editar', (req,res) =>{
    usuario.findOne({_id:req.body.id}).then(usuario =>{
        usuario.nome = req.body.nome;
        usuario.cargo = req.body.cargo;
        usuario.email = req.body.email;
        usuario.moedasParaDoar = req.body.moedas

        usuario.save().then(()=> {
            req.flash('successMsg', 'Usuário salvo com sucesso')
            res.redirect('/admin/listausuarios')
        }).catch((err) => {
            req.flash('errorMsg', 'Houve um erro ao salvar o usuário')
            res.redirect('/admin/listausuarios')
        })
        
    }).catch((err) =>{
        req.flash('errorMsg','Erro ao editar usuário')
        res.redirect('/admin/listausuarios')
    })
})

router.post('/listausuarios/excluir', (req,res) => {
    usuario.remove({_id:req.body.id}).then(() =>{
        req.flash('successMsg', 'Usuário excluído com sucesso')
        res.redirect('/admin/listausuarios')
    }).catch((err)=>{
        req.flash('errorMsg', 'Erro ao excluir usuário')
        res.redirect('/admin/listausuarios')
    })
})

router.post('/novousuario', (req,res) => {
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.lenght < 3){
            erros.push({texto: "Nome inválido"})
        }  
    if(!req.body.cargo || typeof req.body.cargo == undefined ||req.body.cargo == null || req.body.cargo.lenght < 3){
            erros.push({texto: "Cargo inválido"})
        }   
    if(!req.body.email || typeof req.body.email == undefined  || req.body.email == null || 
        req.body.email.lenght < 5){
            erros.push({texto: "Email inválido"})
        }    
    console.log(erros.length)    
    if( erros.length > 0){
        res.render('admin/index', {erros: erros})
    }        
    else{
        var cadastro = [];
        const novoUsuario = {
            nome: req.body.nome,
            cargo: req.body.cargo,
            email: req.body.email,
        }
        new  usuario(novoUsuario).save().then(()=>{
            req.flash('successMsg', 'Novo usuário cadastrado com sucesso')
            res.redirect('/admin')
        }).catch((err) => { 
            req.flash('errorMsg', "Erro ao cadastro novo usuário")
            res.redirect('/admin')
        }) 
    }  
})

module.exports = router;
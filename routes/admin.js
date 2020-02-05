const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
require('../models/usuario')
const usuario = mongoose.model('usuarios')
const flash = require('connect-flash')
require('../models/premio')
const premio = mongoose.model('premios')

router.get('/', (req,res) => {
    premio.find().then((premios) => {
        res.render('admin/index', {premios})
    }).catch((err) =>{
        req.flash('errorMsg', 'Erro ao listar prêmios')
        res.redirect('/admin')
    })
})

//lista usuários
router.get('/listausuarios', (req,res) => {
    usuario.find().then((usuarios) => {
        res.render('admin/listausuarios', {usuarios})
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro ao listar os usuários') 
    })
})

//edita um usuário por id
router.get('/listausuarios/editar/:id', (req,res) =>{
    usuario.findOne({_id:req.params.id}).then(usuario =>{
        console.log(usuario)
        res.render('admin/editausuario', {usuario:usuario})
    }).catch((err) => {
        req.flash('errorMsg','Usuário não encontrado')
        res.redirect('/admin/listausuarios')
    })
})

//post de edição usuário
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

//post reseta senha
router.post('/listausuarios/resetarsenha', (req,res) =>{
    usuario.findOne({_id:req.body.id}).then(usuario =>{
        usuario.senha = 'resetada';
        usuario.save().then(()=> {
            req.flash('successMsg', 'Senha resetada com sucesso')
            res.redirect('/admin/listausuarios')
        }).catch((err) => {
            req.flash('errorMsg', 'Houve um erro ao resetar a senha')
            res.redirect('/admin/listausuarios')
        })
    }).catch((err) =>{
        req.flash('errorMsg','Erro ao resetar')
        res.redirect('/admin/listausuarios')
    })
})

//post para excluir usuário
router.post('/listausuarios/excluir', (req,res) => {
    usuario.remove({_id:req.body.id}).then(() =>{
        req.flash('successMsg', 'Usuário excluído com sucesso')
        res.redirect('/admin/listausuarios')
    }).catch((err)=>{
        req.flash('errorMsg', 'Erro ao excluir usuário')
        res.redirect('/admin/listausuarios')
    })
})

//cria um novo usário
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
        
        const novoUsuario = {
            nome: req.body.nome,
            cargo: req.body.cargo,
            email: req.body.email,
        }
        new usuario(novoUsuario).save().then(()=>{
            req.flash('successMsg', 'Novo usuário cadastrado com sucesso')
            res.redirect('/admin')
        }).catch((err) => { 
            req.flash('errorMsg', "Erro ao cadastrar novo usuário")
            res.redirect('/admin')
        }) 
    }  
}) 

//cria um novo prêmio
router.post('/novopremio', (req,res) =>{
    var erros = [];
    if(!req.body.premio || typeof req.body.premio == undefined || req.body.premio == null || req.body.premio.lenght < 2){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null || req.body.valor <= 0){
        erros.push({texto: "Valor inválido"})
    }
    if(!req.body.quantidade || typeof req.body.quantidade == undefined || req.body.quantidade == null
         || req.body.quantidade <= 0){
        erros.push({texto: "Quantidade inválida"})
    } 
    console.log(erros.length)    
    if( erros.length > 0){
        res.render('admin/index', {erros: erros})
    }        
    else{
        const novoPremio = {
            premio: req.body.premio,
            valor: req.body.valor,
            quantidade: req.body.quantidade,
        }
        new premio(novoPremio).save().then(()=>{
            req.flash('successMsg', 'Novo prêmio cadastrado com sucesso')
            res.redirect('/admin')
        }).catch((err) => { 
            req.flash('errorMsg', "Erro ao cadastrar novo prêmio")
            res.redirect('/admin')
        }) 
    }  
})
//post para excluir usuário
router.post('/excluirpremio', (req,res) => {
    if (req.body.id == 0){
        req.flash('errorMsg', 'Não há prêmio para ser excluido')
        res.redirect('/admin')
    }
    else {
        console.log(req.body.id)
        premio.remove({_id:req.body.id}).then(() =>{
            req.flash('successMsg', 'Prêmio excluído com sucesso')
            res.redirect('/admin')
        }).catch((err)=>{
            req.flash('errorMsg', 'Erro ao excluir prêmio')
            res.redirect('/admin')
    })
    }
})

//post para novo valor de moedas
router.post('/novomoedas', (req,res) =>{
        
        usuario.updateMany({moedasParaDoar:{$nin: req.body.valor}}, {moedasParaDoar: req.body.valor}).then(() =>{
            req.flash('successMsg', 'Novo valor adicionado com sucesso')
            res.redirect('/admin')
        }).catch((err)=>{
            req.flash('errorMsg', 'Erro')
            res.redirect('/admin')
    })
    
      
})


module.exports = router;
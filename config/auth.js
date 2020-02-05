const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
require('../models/usuario');
const usuario = mongoose.model('usuarios');
const passport = require('passport')



passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, function(email, senha, done) {
  usuario.findOne({ email: email }, function (err, user) {
    if (err){ 
      return done(err); }
    if (!user){
             return done(null, false, {message: "Usuário não cadastrado"}); }
    if (user.senha != senha){
             return done(null, false, {message: "Senha incorreta"}); }
    return done(null, user);
      });
    }
  ));


passport.serializeUser((usuario,done) =>{
    done(null,usuario.id)
})

passport.deserializeUser((id,done) =>{
    usuario.findById(id, (err,usuario) =>{
        done(err,usuario)
    })
})

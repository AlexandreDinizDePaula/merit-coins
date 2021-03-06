//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();
const adminRouter = require('./routes/admin');
const indexRouter = require('./routes/index');

const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
require('./config/auth')
//Configurações
    //Session
        app.use(session({
            secret: 'umasenhaqualquer',
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());
    //Flash    
        app.use(flash())
    //Middleware
        app.use((req,res,next) =>{
            res.locals.successMsg = req.flash('successMsg')
            res.locals.errorMsg = req.flash('errorMsg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;
            next()
        })    
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    //Public
        app.use(express.static(path.join(__dirname,'public')))
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/meritcoins", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Conectado com Sucesso")
        }).catch((err) => {
          console.log("Erro ao se conectar no MongoDB: " + err)
      })
//Rotas
     
    app.use('/admin', adminRouter)
    app.use('/', indexRouter)
//Outros
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta: ' + PORT)
})
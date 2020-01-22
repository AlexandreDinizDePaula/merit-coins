const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo
const usuario = new Schema({
    nome:{
        type: String,
        require: true,
    },
    cargo:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    senha:{
        type: String,
        default: '123456'
    },
    carteira:{
        type: Number,
        default: 0
    },
    moedasParaDoar:{
        type: Number,
        default:0
    }
})

mongoose.model('usuarios', usuario);
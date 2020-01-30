const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo
const premio = new Schema({
    premio:{
        type:String,
        required: true
    },
    valor:{
        type: Number,
        required: true
    },
    quantidade:{
        type: Number,
        required:true
    },
    novoValor:{
        type: Number
    }
})

mongoose.model('premios', premio);
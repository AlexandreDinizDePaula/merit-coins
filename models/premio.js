const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Modelo

const premeio = new Schema({
    nome:{
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
    }
})

mongoose.model = ('premios', premio)
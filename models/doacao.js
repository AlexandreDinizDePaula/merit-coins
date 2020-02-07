const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Modelo
const doacao = new Schema({
    emissor:{
        type: String ,
        required: true
    },
    recebedor:{
        type: String,
        required: true
    },
    quantidade:{
        type: Number,
        required:true
    },
    data:{
        type: Date
    },
    motivo:{
        type: String,
        require:true
    }
})

mongoose.model('doacoes', doacao);
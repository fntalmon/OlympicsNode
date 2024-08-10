const mongoose = require('mongoose');
const { Schema } = mongoose;

const preguntaSchema = new Schema({
  id: { type: Number, unique: true },
  texto: String,
  respuestas: [
    {
      texto: String,
      valor: Boolean,
      index: Number,
    },
  ],
});

const triviaSchema = new Schema({
  id: { type: Number, unique: true },
  trivia: String,
  imagen: String,
  preguntas: [preguntaSchema],
});

// Esquema para resultados de usuarios
const resultadoSchema = new Schema({
  triviaId: { type: Number, required: true },
  puntaje: { type: Number, required: true },
});

// Esquema para usuarios
const usuarioSchema = new Schema({
  email: { type: String, unique: true, required: true },
  triviasCompletadas: [resultadoSchema],
});

const Usuario = mongoose.model('Usuario', usuarioSchema);


const Trivia = mongoose.model('Trivia', triviaSchema);

module.exports = { Trivia, Usuario };

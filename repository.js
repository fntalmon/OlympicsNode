const mongoose = require('mongoose');
const { Trivia, Usuario } = require('./models');

const uri = "mongodb+srv://federicotalmon:Fede2020201!@cluster0.vydnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connect() {
  try {
    await mongoose.connect(uri, clientOptions);
  } catch (error) {
    console.error('Error al conectarse:', error);
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al desconectarse:', error);
  }
}

async function findTrivias() {
  try {
    const trivias = await Trivia.find();
    console.log('Trivias encontradas:', trivias);
    return trivias;
  } catch (error) {
    console.error('Error al buscar las trivias:', error);
    return null;
  }
}

async function findUsers() {
  try {
    const users = await Usuario.find();
    console.log('Usuarios encontrados:', users);
    return users;
  } catch (error) {
    console.error('Error al buscar los usuarios:', error);
    return null;
  }
}

async function findUser(email) {
  try {
    const user = await Usuario.findOne({ email });
    console.log('Usuario encontrado:', user);
    return user;
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    return null;
  }
}

module.exports = { findTrivias, findUsers, findUser, connect, disconnect };

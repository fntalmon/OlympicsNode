const mongoose = require('mongoose');

const uri = 'your-mongodb-uri'; // Define tu URI aquí
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Termina el proceso si la conexión falla
  }
};

module.exports = connectDB;

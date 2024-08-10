const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { findTrivias, findUsers, findUser } = require('./repository');
const { Usuario } = require('./models');
require('dotenv').config(); 

const app = express();
const port = 3000; 

const uri = process.env.MONGODB_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Conectar a MongoDB
mongoose.connect(uri, clientOptions)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  });

// Configura CORS y el middleware de JSON
app.use(cors());
app.use(express.json());

// Define rutas
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde la API!' });
});

app.get('/api/pregunta/:id', (req, res) => {
  const preguntaId = req.params.id;
  res.json({ mensaje: `Has solicitado la pregunta con ID: ${preguntaId}` });
});

app.get('/api/trivias', async (req, res) => {
  try {
    const trivias = await findTrivias(); // Asegúrate de que `await` esté presente
    res.json({ mensaje: 'Trivias encontradas', body: trivias });
  } catch (error) {
    console.error('Error al buscar las trivias:', error); // Añade log para depurar
    res.status(500).json({ error: 'Error al buscar las trivias' });
  }
});

app.get('/api/getUser', async (req, res) => {
  const email = req.query.email; // Obtener el email desde los parámetros de consulta

  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  try {
    const user = await findUser(email);

    if (user) {
      res.json({ mensaje: 'Usuario encontrado', body: user });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});

app.get('/api/getUsers', async (req, res) => {
  try {
    const usuarios = await findUsers();
    res.json({ mensaje: 'Usuarios encontrados', body: usuarios });
  } catch (error) {
    console.error('Error al buscar los usuarios:', error);
    res.status(500).json({ error: 'Error al buscar los usuarios' });
  }
});

app.get('/api/triviasUser', async (req, res) => {
  const email = req.query.email; // Obtener el email desde los parámetros de consulta

  try {
    const trivias = await findTrivias();

    if (email) {
      const usuario = await findUser(email);

      const resultados = usuario ? 
        usuario.triviasCompletadas.reduce((acc, resultado) => {
          acc[resultado.triviaId] = resultado.puntaje;
          return acc;
        }, {}) : {};

      const triviasConResultados = trivias.map(trivia => ({
        ...trivia.toObject(),
        puntaje: resultados[trivia.id] ? `Mejor puntaje: ${resultados[trivia.id]}` : 'Nunca realizado',
      }));

      res.status(200).json({ mensaje: 'Trivias encontradas', body: triviasConResultados });
    } else {
      const triviasSinResultados = trivias.map(trivia => ({
        ...trivia.toObject(),
        puntaje: 'No autenticado',
      }));

      res.status(200).json({ mensaje: 'Trivias encontradas', trivias: triviasSinResultados });
    }
  } catch (error) {
    console.error('Error al obtener las trivias:', error);
    res.status(500).json({ error: 'Error al obtener las trivias' });
  }
});

app.post('/api/saveResult', async (req, res) => {
  const { puntaje, triviaId, email } = req.body;

  try {
    const usuario = await findUser(email);

    if (usuario) {
      const resultadoExistente = usuario.triviasCompletadas.find(r => r.triviaId === triviaId);

      if (resultadoExistente) {
        if (puntaje > resultadoExistente.puntaje) {
          resultadoExistente.puntaje = puntaje;
          await usuario.save();
        }
      } else {
        usuario.triviasCompletadas.push({ triviaId, puntaje });
        await usuario.save();
      }

      res.status(200).json({ mensaje: 'Resultado guardado/actualizado' });
    } else {
      const nuevoUsuario = new Usuario({
        email,
        triviasCompletadas: [{ triviaId, puntaje }],
      });
      await nuevoUsuario.save();
      res.status(200).json({ mensaje: 'Nuevo usuario creado y resultado guardado' });
    }
  } catch (error) {
    console.error('Error al guardar el resultado:', error);
    res.status(500).json({ error: 'Error al guardar el resultado' });
  }
});

app.post('/api/saveResults', async (req, res) => {
  const { email, triviaId, puntaje } = req.body;

  console.log(email);
  console.log({ puntaje });

  res.status(200).json({ email, puntaje });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

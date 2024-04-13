const express = require('express');
const axios = require('axios');
const uuid = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const chalk = require('chalk');

const app = express();
const PORT = process.env.PORT || 4000;

// Almacena los usuarios registrados
const users = [];

// Ruta para registrar un nuevo usuario
app.get('/registrar-usuario', async (req, res) => {
    try {
        const randomUserResponse = await axios.get('https://randomuser.me/api/');
        const randomUser = randomUserResponse.data.results[0];
    
        const nuevoUsuario = {
            nombre: randomUser.name.first,
            apellido: randomUser.name.last,
            id: uuid.v4(), 
            sexo: randomUser.gender,
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
        };
    
        users.push(nuevoUsuario);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para consultar todos los usuarios registrados
app.get('/usuarios', (req, res) => {
  const usuariosPorSexo = _.groupBy(users, 'sexo');
  
  const hombres = _.map(usuariosPorSexo['male'], user => ({
      nombre: user.nombre,
      apellido: user.apellido,
      id: _.truncate(user.id.replace(/\./g, ''), { length: 6 }), 
      timestamp: user.timestamp
  }));

  const mujeres = _.map(usuariosPorSexo['female'], user => ({
      nombre: user.nombre,
      apellido: user.apellido,
      id: _.truncate(user.id.replace(/\./g, ''), { length: 6 }), 
      timestamp: user.timestamp
  }));

  const usuariosFiltrados = {
      hombres,
      mujeres
  };

  // Imprimir en la consola con fondo blanco y texto azul
  console.log(chalk.white.bgBlue.bold('Lista de usuarios registrados:'));
  console.log(chalk.white.bgBlue.bold(JSON.stringify(usuariosFiltrados, null, 2))); 
  res.json(usuariosFiltrados);
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

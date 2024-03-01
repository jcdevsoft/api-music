const express = require('express');
const app = express();
const logger = require('morgan');
import {PORT,DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT} from '../config/connectdb.js';
const conn = require('mysql2');
const bodyParser = require('body-parser');
const cors=require('cors');

const conexion = conn.createConnection({
  host: DB_HOST ,
  user: DB_USER,
  database: DB_NAME,
  port: DB_PORT,
  password: DB_PASSWORD
});
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
// rutas de user
var user_routes=require('./routes/user');
app.use(user_routes);
// rutas de canciones
var song_routes=require('./routes/song');
app.use(song_routes);
// rutas de albums
var album_routes=require('./routes/album');
app.use(album_routes);
// rutas de artistas
var artist_routes=require('./routes/artist');
app.use(artist_routes);

app.get('*', (req, res) => {
  res.send({message:'Ruta no valida!'})
})
// verificamos que podemos conectar a la base de datos y
// si se conecta iniciamos el servidor express.
conexion.connect((error) => {
  if (error) {
    console.log('no se puede conectar a la base de datos')
  } else {
   console.log('Conectado a la base de datos');
    app.listen(PORT, () => {
      console.log(`Servidor API ejecutado en el puerto ${PORT}`)
    })
  }
});


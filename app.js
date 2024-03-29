const express = require('express');
const app = express();
const logger = require('morgan');
require('dotenv').config()

const PORT = process.env.PORT;
const conn = require('mysql2');
const bodyParser = require('body-parser');
const cors=require('cors');

const conexion = conn.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})
// const conexion = conn.createConnection({
 
// });

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
// conexion.connect((error) => {
//   if (error) {
//     console.log('no se puede conectar a la base de datos')
//   } else {
//    console.log('Conectado a la base de datos');
    app.listen(PORT, () => {
      console.log(`Servidor API ejecutado en el puerto ${PORT}`)
    })
//   }
// });


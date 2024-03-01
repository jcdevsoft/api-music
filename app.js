const express = require('express');
const app = express();
const logger = require('morgan');
const port = 3000;
const conn = require('mysql2');
const bodyParser = require('body-parser');
const cors=require('cors');

const conexion = conn.createConnection({
  host: 'monorail.proxy.rlwy.net',
  user: 'root',
  password: 'c4BAc1Gd3FafG-BCfggge535C6A-cC6g',
  database: 'railway',
  port:42219
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
    app.listen(port, () => {
      console.log(`Servidor API ejecutado en el puerto ${port}`)
    })
  }
});


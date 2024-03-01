const conn = require('mysql2');
var fs = require('fs');//Manejo de archivos FileSystem
var path = require('path');//Rutas o Ubicaciones 

const conexion = conn.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

module.exports = {
    save(req, res) {
        name = data.name;
        number = data.number;
        duration = data.duration;
        album_id = data.album_id;
        var sql = 'INSERT INTO song (name, number, duration,album_id) VALUES ("'+name+'","'+number+'","'+duration+'","'+album_id+'")';
        conexion.query(sql,function(err,results,fields){
            if(err){
                console.log(err)
            }else{
                console.log(results);
            }
        })
    },
    list(req, res) {
        conexion.query(
            'SELECT * FROM song',
            function (err, results, fields) {
                if (results) {
                    res.status(200).send({ data: results })
                } else {
                    res.status(500).send({ message: 'Error: intentalo mas tarde' })
                }
            }
        );
    },
    uploadSong(req, res) {
        var id = req.params.id;
        var file = 'Sin archivo...';
        if (req.files) {
            var file_path = req.files.file.path;
            var file_split = file_path.split('\/');
            var file_name = file_split[2];
            var ext = file_name.split('\.');
            var file_ext = ext[1];
            if (file_ext == 'mp3') {
                conexion.query('UPDATE song SET file="' + file_name + '" WHERE id=' + id,
                    function (err, results, fields) {
                        if (!err) {
                            if (results.affectedRows != 0) {
                                res.status(200).send({ message: 'Cancion actualizada' })
                            } else {
                                res.status(200).send({ message: 'Error al actualizar' })
                            }
                        } else {
                            console.log(err);
                            res.status(200).send({ message: 'Intentalo mas tarde' })
                        }
                    })
            } else {
                res.status(200).send({ message: 'Cancion no valida' })
            }
        }
    },
    getSong(req, res) {
        var song = req.params.file;
        var path_file = './uploads/songs/' + song;
        if (fs.existsSync(path_file)) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(404).send({ message: 'No existe el archivo' })
        }
    },
    delSong(req, res) {
        id = req.params.id;
        var sql = "SELECT file FROM song WHERE id =" + id;
        conexion.query(sql, function (err, results, fields) {
            if (!err) {
                if (results.length != 0) {
                    if (results[0].image != null) {
                        var path_file = './uploads/songs/' + results[0].file;
                        try {
                            fs.unlinkSync(path_file);
                            res.status(200).send({ message: "Cancion eliminada" })
                        } catch (error) {
                            console.log(error)
                            res.status(200).send({ message: "No se pudo eliminar, intenta mas tarde" })
                        }
                    } else {
                        res.status(404).send({ message: "No encontrada" })
                    }

                } else {
                    res.status(404).send({ message: "No encontrada" })
                }
            } else {
                console.log(err)
                res.status(500).send({ message: 'Intenta mas tarde' })
            }
        })
    }

}
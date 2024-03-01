const conn = require('mysql2');
var fs = require('fs');//Manejo de archivos FileSystem
var path = require('path');//Rutas o Ubicaciones 

const conexion = conn.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

module.exports={
    save(req,res){
        data = req.body;
        name = data.name;
        description = data.description;
        var sql = 'INSERT INTO artist (name, description) VALUES ("'+name+'","'+description+'")';
        conexion.query(sql,function(err,results,fields){
            if(err){
                console.log(err)
            }else{
                console.log(results);
            }
        })
    },
    list(req,res){
        conexion.query(
            'SELECT * FROM artist',
            function (err, results, fields) {
                if(results){
                    res.status(200).send({data: results})
                }else{
                    res.status(500).send({message:'Error: intentalo mas tarde'})
                }
            }
          );
    },
    uploadImage(req, res) {
        var id = req.params.id;
        var file = 'Sin imagen...';
        if (req.files) {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\/');
            var file_name = file_split[2];
            var ext = file_name.split('\.');
            var file_ext = ext[1];
            if (file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'png' || file_ext == 'jpeg') {
                conexion.query('UPDATE artist SET image="' + file_name + '" WHERE id=' + id,
                    function (err, results, fields) {
                        if (!err) {
                            if (results.affectedRows != 0) {
                                res.status(200).send({ message: 'Imagen actualizada' })
                            } else {
                                res.status(200).send({ message: 'Error al actualizar' })
                            }
                        } else {
                            console.log(err);
                            res.status(200).send({ message: 'Intentalo mas tarde' })
                        }
                    })
            } else {
                res.status(200).send({ message: 'Imagen no valida' })
            }
        }
    },
    getImage(req, res) {
        var image = req.params.image;
        var path_file = './uploads/artists/' + image;
        if (fs.existsSync(path_file)) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(404).send({ message: 'No existe el archivo' })
        }
    },
    delImage(req, res) {
        id = req.params.id;
        var sql = "SELECT image FROM artist WHERE id =" + id;
        conexion.query(sql, function (err, results, fields) {
            if (!err) {
                if (results.length != 0) {
                    if (results[0].image != null) {
                        var path_file = './uploads/users/' + results[0].image;
                        try {
                            fs.unlinkSync(path_file);
                            res.status(200).send({ message: "Imagen eliminada" })
                        } catch (error) {
                            console.log(error)
                            res.status(200).send({ message: "No se pudo eliminar, intenta mas tarde" })
                        }
                    }else{
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
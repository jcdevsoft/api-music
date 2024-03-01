var bcrypt = require('bcrypt-nodejs');
const conn = require('mysql2');// libreria para conectar la base de datos
var jwt = require('../services/jwt');//importamos el servicio
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
        console.log(req.body);
        console.log(req.user);
        data = req.body;
        name = data.name;
        username = data.username;
        email = data.email;
        if (data.password != '' && data.password != null) {
            bcrypt.hash(data.password, null, null, function (err, hash) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: 'Intenta nuevamente' })
                } else {
                    password = hash;
                    conexion.query(
                        'INSERT INTO user (name,username,password,email) VALUES("' + name + '","' + username + '","' + password + '","' + email + '")',
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.code)
                                res.status(200).send({ message: 'Error, instenta mas tarde' })
                            } else {
                                res.status(201).send({ message: 'Datos guardados' })
                            }
                        }
                    );

                }
            })
        } else {
            res.status(200).send({ message: 'intruduce una contraseña' })
        }
    },
    list(req, res) {
        user = req.user
        var sql = ''
        if (user.role == 'admin') {
            //mostrarle toda la informacion
            sql = 'SELECT * FROM user'
        } else {
            //mostrarle su informacion
            sql = 'SELECT * FROM user WHERE id=' + user.sub
        }
        conexion.query(
            sql,
            function (err, results, fields) {
                if (results) {
                    res.status(200).send({ data: results })
                } else {
                    res.status(500).send({ message: 'Error: intentalo mas tarde' })
                }
            }
        );
    },
    login(req, res) {
        var data = req.body;
        var username = data.username;
        var password = data.password;
        var token = data.token;
        conexion.query('SELECT * FROM user WHERE username ="' + username + '" LIMIT 1',
            function (err, results, fields) {
                if (!err) {
                    if (results.length == 1) {
                        bcrypt.compare(password, results[0].password, function (err, check) {
                            if (check) {
                                if (token) {
                                    res.status(200).send({ token: jwt.createToken(results[0]) })
                                } else {
                                    res.status(200).send({ message: 'Datos correctos' })
                                }
                            } else {
                                res.status(200).send({ message: 'Datos incorrectos' })
                            }
                        })
                    } else {
                        res.status(200).send({ message: 'Datos incorrectos' })
                    }
                }
            }
        );
    },
    delete(req, res) {
        id = req.params.id;
        conexion.query('DELETE FROM user WHERE id =' + id, function (err, results, fields) {
            if (!err) {
                if (results.affectedRows != 0) {
                    res.status(200).send({ message: 'Datos eliminados' })
                } else {
                    res.status(200).send({ message: 'no se borro nada' })
                }
            } else {
                console.log(err)
                res.status(500).send({ message: 'no se pudo eliminar intenta mas tarde' })
            }
        })
    },
    update(req, res) {
        id = req.params.id;
        data = req.body;
        var sql = 'UPDATE user SET ? WHERE id=?';
        if (data.password) {
            data.password = bcrypt.hashSync(data.password);
        }
        conexion.query(sql, [data, id],
            function (err, results, fields) {
                if (!err) {
                    console.log(results);
                    res.status(200).send({ message: "Datos actualizados" })
                } else {
                    console.log(err);
                    res.status(200).send({ message: "No se actualizo" })
                }
            });
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
                conexion.query('UPDATE user SET image="' + file_name + '" WHERE id=' + id,
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
        var path_file = './uploads/users/' + image;
        if (fs.existsSync(path_file)) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(404).send({ message: 'No existe el archivo' })
        }
    },
    delImage(req, res) {
        id = req.params.id;
        var sql = "SELECT image FROM user WHERE id =" + id;
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
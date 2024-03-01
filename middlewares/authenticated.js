var jwt = require('jwt-simple');//importamos el servicio
var moment = require('moment');
var secret= 'secret_key';

exports.Auth=function(req,res,next){
   //console.log(req.headers.authorzation);
    if(!req.headers.authorization){
        return res.status(403).send({message:'Falta llave de autorizacion'})
    }
    var token=req.headers.authorization.replace(/['"]+/g,'');
    try {
        var payload =jwt.decode(token,secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'sesion caducada'})
        }
    } catch (error) {
        return res.status(404).send({message:'llave no valida'})
    }
    req.user=payload;
    next();
}
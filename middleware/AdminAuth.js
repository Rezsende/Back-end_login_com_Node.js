var jwt = require("jsonwebtoken");
var secret = process.env.secret;

module.exports = function(req, res, next){

const authToken = req.headers['authorization'];

if(authToken != undefined){
    const bearer = authToken.split(' ');
    var token = bearer[1];

    var decoded = jwt.verify(token, secret);
    console.log(decoded);
    next();
}else{
    res.status(403);
    res.send("Voce nao esta autenticado")

    return;
}


}
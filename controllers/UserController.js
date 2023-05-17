require('dotenv').config()
var User = require("../model/UserModel");
var jwt = require("jsonwebtoken");
var secret = process.env.secret;
var bcrypt = require("bcrypt");
class UserController {
  async index(req, res) {
    var users = await User.findall();
    res.json(users);
  }
  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findByid(id)
    if (user == undefined) {
      res.status(404);
      res.json({ res: "Dados não encontrados" });
    } else {
      res.status(200)
      res.json(user);
    }
  }
  async create(req, res) {
    
    

    var { email, name, password } = req.body;
    if (email == undefined) {
      res.status(400);
      res.json({ err: "O e-mail invalido" });
      return;
    }

    if(email == ""){
      res.status(400);
      res.json({ err: "O e-mail é obrigatorio" });
    }

    if(name == ""){
      res.status(400);
      res.json({ err: "o nome é obrigatorio" });
    }

    if(password == ""){
      res.status(400);
      res.json({ err: "A senha é obrigatorio" });
    }
    
    var emailExist = await User.findEmail(email);

    if (emailExist) {
      res.status(406);
      res.json({ err: "O email ja esta cadastrado" });
      return;
    }


    await User.newCad(email, password, name);
    res.status(200);
    res.json({email:email, name:name, password:'**********'});
  }
  async edit(req, res) {
    var { name, email, password, role } = req.body;
    const { id } = req.params;
    var resultado = await User.update(id, name, email,password, role);
    if (resultado != undefined) {
      if (resultado.status) {
        res.status(200);
        // res.send("Tudo ok!");

        res.json({ nome: name, email: email, role: role })
      } else {
        res.status(406);
        res.send(resultado.err);
      }
    } else {
      res.status(406);
      res.send('O correu um erro no servidor');
    }

  }
  async remove(req, res) {
    var id = req.params.id;
    var resultado = await User.delete(id);
    if (resultado.status) {
      res.status(200);
      res.send("Tudo ok!");
    } else {
      res.status(406);
      res.send(resultado.err);
    }

  }
  async login(req, res) {
    var { email, password } = req.body;
    var user = await User.findByEmail(email);
    if (user != undefined) {
      var resultado = await bcrypt.compare(password, user.password);
      if (resultado) {
        var token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token: token, email: user.email, role: user.role });
        // res.json({status: resultado});
        // res.json(req.body);
      }else{
        res.status(400);
        res.json("Erro Usuario incorreto ou Senha invalida!")
      }

    } else {
      res.json({ status: false });

    }
  }s

}
module.exports = new UserController();
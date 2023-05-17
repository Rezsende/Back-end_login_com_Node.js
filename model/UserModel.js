var knex = require("../database/connection");
var bcrypt = require("bcrypt");
class UserModel {

    async findall() {
        var resultado = await knex.select(["id", "name", "email", "role"]).table("user");
        try {
            return resultado;
        } catch (err) {
            console.log(err);
        }
    }
    async findByid(id) {
        try {
            var resultado = await knex.select(["id", "name", "email", "role"]).where({ id: id }).table("user");
            if (resultado.length > 0) {
                return resultado[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async findByEmail(email) {
        try {
            var resultado = await knex.select(["id", "name", "email", "password", "role"]).where({ email: email }).table("user");
            if (resultado.length > 0) {
                return resultado[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
    async newCad(email, password, name) {
        var hash = await bcrypt.hash(password, 10);
        try {
            await knex.insert({ email, password: hash, name, role: 0 }).table("user");
        } catch (err) {
            console.log(err)
        }
    }
    async findEmail(email) {
        try {
            var resultado = await knex.select('*').from('user').where({ email: email });
            if (resultado.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
async update(id, name, email, password, role) {
    var hash = await bcrypt.hash(password, 10);
var user = await this.findByid(id);
        if (user != undefined) {

            var editeUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    var resultado = await this.findEmail(email);
                    if (resultado == false) {
                        editeUser.email = email;
                    } else {
                        return { status: false, err: "O E-mail ja esta cadastrado!" };
                    }
                }
            }
            if (name != undefined) {
                editeUser.name = name;
            }
            if (role != undefined) {
                editeUser.role = role;
            }
            if (password != undefined) {
                editeUser.password = hash;
            }
            try {
                await knex.update(editeUser).where({ id: +id }).table("user");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {
            return { status: false, err: "O usuario não existi!" }
        }
    }

    async delete(id) {

        var user = await this.findByid(id);

        if (user != undefined) {
            try {
                await knex.delete().where({ id: id }).table("user");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {

            return { status: false, err: "O usuario não existi e não pode ser deletado" }

        }



    }

}

module.exports = new UserModel();
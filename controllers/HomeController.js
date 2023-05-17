class HomeController{
    async index(req,res){
        res.send("APP EXpress");
    }
}

module.exports = new HomeController();
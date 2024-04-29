const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static(__dirname))


app.get("/", function(req, res){
    post.Servicos.findAll().then(function(post){
        res.render("index", {post}) 
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/admin", function(req, res){
    post.Servicos.findAll().then(function(post){
        res.render("admin", {post})
    })
})

app.get("/cadastroServico", function(req, res){
    res.render("cadastroServico")
})


app.post("/cadastrarNovoServico", function(req, res){
    post.Servicos.create({
        nome: req.body.nome_servico,
        informacoes: req.body.informacoes
    }).then(function(){
        res.redirect("admin")
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados: " + erro)
    })
})

// app.get("/admin", function(req, res){
//     post.findAll().then(function(post){
//         res.render("admin", {post})
//     }).catch(function(erro){
//         console.log("Erro ao carregar dados do banco: " + erro)
//     })
// })

app.get("/editar/:id", function(req, res){
    post.Servicos.findAll({where: {'id': req.params.id}}).then(function(post){
        res.render("editarServico", {post})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.get("/excluir/:id", function(req, res){
    post.destroy({where: {'id': req.params.id}}).then(function(){
        res.render("admin")
    }).catch(function(erro){
        console.log("Erro ao excluir ou encontrar os dados do banco: " + erro)
    })
})



app.post("/atualizarServico", function(req, res){
    post.Servicos.update({
        nome: req.body.nome_servico,
        informacoes: req.body.informacoes
    },{
        where: {
            id: req.body.id
        }
    }).then(function(){
        res.redirect("/admin")
    })
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})
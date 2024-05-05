const express = require("express")
//Importar módulo express-fileupload
const fileupload = require('express-fileupload');
const app = express()
//Habilitando o upload de arquivps
app.use(fileupload());
//Referenciar pasta de imagens
app.use('/static/imgs/imgs_bnc', express.static('./static/imgs/imgs_bnc'));
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")
const session = require('express-session');
const exphbs = require('express-handlebars');


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static(__dirname))

app.use(session({
    secret: 'suaChaveSecreta',
    resave: false,
    saveUninitialized: true
}));

app.get("/", function(req, res){
    // Verificar se o usuário está autenticado
    const isAuthenticated = req.session.usuario ? true : false;

    // Renderizar a página principal com base no estado de autenticação
    if (isAuthenticated) {
        // Se o usuário estiver autenticado, renderizar a página de administração
        post.Servicos.findAll().then(function(post){
            res.render("admin", {post}) 
        }).catch(function(erro){
            console.log("Erro ao carregar dados do banco: " + erro);
            res.status(500).send("Erro ao carregar dados do banco");
        });
    } else {
        // Se o usuário não estiver autenticado, renderizar a página padrão
        post.Servicos.findAll().then(function(post){
            res.render("index", { isAuthenticated, post }) 
        }).catch(function(erro){
            console.log("Erro ao carregar dados do banco: " + erro);
            res.status(500).send("Erro ao carregar dados do banco");
        });
    }
});


app.get("/login", function(req, res){
    res.render("login")
})

app.post("/logar", async function (req, res) {
    try {
        const { usuario, senha } = req.body;

        // Encontre o admin com base no username
        const admin = await post.Admin.findOne({ where: { usuario } });

        if (!admin) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verifique a senha
        if (admin.senha !== senha) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        // Se chegou até aqui, o login foi bem-sucedido
        // Armazene o usuário na sessão
        req.session.usuario = usuario;

        // Redirecione o usuário para a página de administração
        res.redirect("/admin");
    } catch (error) {
        console.error("Erro durante o login:", error);
        res.status(500).json({ message: "Ocorreu um erro durante o login", error: error.message });
    }
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
    // Destruir a sessão ao fazer logout
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

// Rota da área administrativa
app.get("/admin", function (req, res) {
    const isAuthenticated = req.session.usuario ? true : false;
    // Verificar se o usuário está autenticado
    if (req.session.usuario) {
        post.Servicos.findAll().then(function (post) {
            res.render("admin", {isAuthenticated, post });
        });
    } else {
        res.render("login");
    }
});

app.get("/cadastroServico", function(req, res){
    if (req.session.usuario) {
        post.Servicos.findAll().then(function (post) {
            res.render("cadastroServico")
        });
    } else {
        res.render("login");
    }
})


app.post("/cadastrarNovoServico", function(req, res){
    post.Servicos.create({
        nome: req.body.nome_servico,
        informacoes: req.body.informacoes,
        imagem: req.files.imagem.name
    }).then(function(){
        res.redirect("admin")
        req.files.imagem.mv(__dirname+'/static/imgs/imgs_bnc/'+req.files.imagem.name);
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados: " + erro)
    })
})



app.get("/editar/:id", function(req, res){
    if (req.session.usuario) {
        post.Servicos.findAll({where: {'id': req.params.id}}).then(function(post){
            res.render("editarServico", {post})
        }).catch(function(erro){
            console.log("Erro ao carregar dados do banco: " + erro)
        })
    } else {
        res.render("login");
    }
    
})

app.get("/excluir/:id", function(req, res){
    if (req.session.usuario) {
        post.Servicos.destroy({where: {'id': req.params.id}}).then(function(){
            res.redirect("/admin")
        }).catch(function(erro){
            console.log("Erro ao excluir ou encontrar os dados do banco: " + erro)
        })
    } else {
        res.render("login");
    }
    
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
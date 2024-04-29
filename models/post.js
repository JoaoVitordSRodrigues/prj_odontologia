const db = require("./banco")

const Servicos = db.sequelize.define('servicos',{
    nome:{
        type: db.Sequelize.STRING
    },
    imagem:{
        type: db.Sequelize.STRING
    },
    informacoes:{
        type: db.Sequelize.STRING
    }
})

const Admin = db.sequelize.define('admin',{
    usuario:{
        type: db.Sequelize.STRING
    },
    senha:{
        type: db.Sequelize.STRING
    }
})

Servicos.sync();
Admin.sync();

module.exports = {Servicos, Admin};

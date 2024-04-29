const Sequelize = require("sequelize")
const sequelize = new Sequelize("banco_odontopremium", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
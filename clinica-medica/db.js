const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('clinica', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
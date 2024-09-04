const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Paciente = sequelize.define('paciente', {
  cpf: {
    type: DataTypes.STRING(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nomeCompleto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  diaMarcado: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  horaMarcada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  tableName: 'paciente',
  timestamps: false,
});

module.exports = Paciente;
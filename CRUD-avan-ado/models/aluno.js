const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Aluno = sequelize.define('aluno', {
  id: {type: DataTypes.INTEGER, primaryKey: true,
    autoIncrement: true,
  },
  nome: {type: DataTypes.STRING(50),allowNull: false,
  },
  idade: { type: DataTypes.INTEGER,allowNull: false,
  },
}, {tableName: 'aluno',timestamps: false, 
});
module.exports = Aluno;
const sequelize = require('./db');
const Paciente = require('./models/paciente');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Banco de dados inicializado');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    process.exit();
  }
})();
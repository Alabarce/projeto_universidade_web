const app = require("./src/scripts/projeto_universidade_scripts");
const { connectDB } = require("./src/database/projeto_universidade_database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);

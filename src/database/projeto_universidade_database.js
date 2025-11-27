const sql = require("mssql");

const dbConfig = {
  server: "localhost",
  database: "ProjetoUniversidadeWeb",
  user: "sa",
  password: "123456",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  try {
    pool = await sql.connect(dbConfig);
    console.log("✅ Conectado ao SQL Server");
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message || err);
    console.error("📋 Detalhes do erro:", JSON.stringify(err, null, 2));
  }
}

function getPool() {
  return pool;
}

module.exports = {
  sql,
  connectDB,
  getPool,
};

const { sql, getPool } = require("../database/projeto_universidade_database");

async function getDepartamentos(req, res) {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM departamento ORDER BY descricao");
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar departamentos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createDepartamento(req, res) {
  try {
    const pool = getPool();
    const { descricao } = req.body;
    const result = await pool
      .request()
      .input("descricao", sql.VarChar, descricao)
      .query(
        "INSERT INTO departamento (descricao) OUTPUT INSERTED.* VALUES (@descricao)"
      );
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao criar departamento:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateDepartamento(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { descricao } = req.body;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("descricao", sql.VarChar, descricao)
      .query(
        "UPDATE departamento SET descricao = @descricao OUTPUT INSERTED.* WHERE id_departamento = @id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Departamento não encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao atualizar departamento:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteDepartamento(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM departamento WHERE id_departamento = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Departamento não encontrado" });
    }
    res.json({ message: "Departamento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir departamento:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getCursos(req, res) {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
            SELECT c.*, d.descricao as departamento_nome 
            FROM curso c 
            JOIN departamento d ON c.id_departamento = d.id_departamento 
            ORDER BY d.descricao, c.descricao
        `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createCurso(req, res) {
  try {
    const pool = getPool();
    const {
      id_departamento,
      descricao,
      sigla,
      valor_mensalidade,
      duracao_semestres,
    } = req.body;
    const result = await pool
      .request()
      .input("id_departamento", sql.Int, id_departamento)
      .input("descricao", sql.VarChar, descricao)
      .input("sigla", sql.VarChar, sigla)
      .input("valor_mensalidade", sql.Decimal(10, 2), valor_mensalidade)
      .input("duracao_semestres", sql.Int, duracao_semestres).query(`
                INSERT INTO curso (id_departamento, descricao, sigla, valor_mensalidade, duracao_semestres) 
                OUTPUT INSERTED.* 
                VALUES (@id_departamento, @descricao, @sigla, @valor_mensalidade, @duracao_semestres)
            `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao criar curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateCurso(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      id_departamento,
      descricao,
      sigla,
      valor_mensalidade,
      duracao_semestres,
    } = req.body;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("id_departamento", sql.Int, id_departamento)
      .input("descricao", sql.VarChar, descricao)
      .input("sigla", sql.VarChar, sigla)
      .input("valor_mensalidade", sql.Decimal(10, 2), valor_mensalidade)
      .input("duracao_semestres", sql.Int, duracao_semestres).query(`
                UPDATE curso 
                SET id_departamento = @id_departamento, descricao = @descricao, sigla = @sigla, 
                    valor_mensalidade = @valor_mensalidade, duracao_semestres = @duracao_semestres 
                OUTPUT INSERTED.* 
                WHERE id_curso = @id
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao atualizar curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteCurso(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM curso WHERE id_curso = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }
    res.json({ message: "Curso excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getTurmas(req, res) {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
            SELECT t.*, c.descricao as curso_nome 
            FROM turma t 
            JOIN curso c ON t.id_curso = c.id_curso 
            ORDER BY c.descricao, t.periodo
        `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar turmas:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createTurma(req, res) {
  try {
    const pool = getPool();
    const {
      id_curso,
      semestre,
      limite_alunos,
      periodo,
      turno,
      sala,
      data_inicio,
      data_termino,
    } = req.body;
    const result = await pool
      .request()
      .input("id_curso", sql.Int, id_curso)
      .input("semestre", sql.Int, semestre)
      .input("limite_alunos", sql.Int, limite_alunos)
      .input("periodo", sql.VarChar, periodo)
      .input("turno", sql.VarChar, turno)
      .input("sala", sql.VarChar, sala)
      .input("data_inicio", sql.Date, data_inicio)
      .input("data_termino", sql.Date, data_termino).query(`
                INSERT INTO turma (id_curso, semestre, limite_alunos, periodo, turno, sala, data_inicio, data_termino) 
                OUTPUT INSERTED.* 
                VALUES (@id_curso, @semestre, @limite_alunos, @periodo, @turno, @sala, @data_inicio, @data_termino)
            `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao criar turma:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateTurma(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      id_curso,
      semestre,
      limite_alunos,
      periodo,
      turno,
      sala,
      data_inicio,
      data_termino,
    } = req.body;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("id_curso", sql.Int, id_curso)
      .input("semestre", sql.Int, semestre)
      .input("limite_alunos", sql.Int, limite_alunos)
      .input("periodo", sql.VarChar, periodo)
      .input("turno", sql.VarChar, turno)
      .input("sala", sql.VarChar, sala)
      .input("data_inicio", sql.Date, data_inicio)
      .input("data_termino", sql.Date, data_termino).query(`
                UPDATE turma 
                SET id_curso = @id_curso, semestre = @semestre, limite_alunos = @limite_alunos, 
                    periodo = @periodo, turno = @turno, sala = @sala, data_inicio = @data_inicio, data_termino = @data_termino 
                OUTPUT INSERTED.* 
                WHERE id_turma = @id
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao atualizar turma:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteTurma(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM turma WHERE id_turma = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Turma não encontrada" });
    }
    res.json({ message: "Turma excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir turma:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getAlunos(req, res) {
  try {
    const pool = getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM aluno ORDER BY nome");
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createAluno(req, res) {
  try {
    const pool = getPool();
    const { nome, cidade, estado, data_nascimento, status } = req.body;
    const result = await pool
      .request()
      .input("nome", sql.VarChar, nome)
      .input("cidade", sql.VarChar, cidade)
      .input("estado", sql.VarChar, estado)
      .input("data_nascimento", sql.Date, data_nascimento)
      .input("status", sql.VarChar, status).query(`
                INSERT INTO aluno (nome, cidade, estado, data_nascimento, status) 
                OUTPUT INSERTED.* 
                VALUES (@nome, @cidade, @estado, @data_nascimento, @status)
            `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao criar aluno:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateAluno(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { nome, cidade, estado, data_nascimento, status } = req.body;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("nome", sql.VarChar, nome)
      .input("cidade", sql.VarChar, cidade)
      .input("estado", sql.VarChar, estado)
      .input("data_nascimento", sql.Date, data_nascimento)
      .input("status", sql.VarChar, status).query(`
                UPDATE aluno 
                SET nome = @nome, cidade = @cidade, estado = @estado, data_nascimento = @data_nascimento, status = @status 
                OUTPUT INSERTED.* 
                WHERE id_aluno = @id
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao atualizar aluno:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteAluno(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM aluno WHERE id_aluno = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }
    res.json({ message: "Aluno excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir aluno:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getMatriculas(req, res) {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
            SELECT m.*, a.nome as aluno_nome, t.periodo as turma_periodo, c.descricao as curso_nome
            FROM matricula m 
            JOIN aluno a ON m.id_aluno = a.id_aluno 
            JOIN turma t ON m.id_turma = t.id_turma
            JOIN curso c ON t.id_curso = c.id_curso
            ORDER BY m.data_matricula DESC
        `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar matrículas:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createMatricula(req, res) {
  try {
    const pool = getPool();
    const { id_aluno, id_turma, status_matricula, observacoes } = req.body;
    const result = await pool
      .request()
      .input("id_aluno", sql.Int, id_aluno)
      .input("id_turma", sql.Int, id_turma)
      .input("status_matricula", sql.VarChar, status_matricula)
      .input("observacoes", sql.Text, observacoes).query(`
                INSERT INTO matricula (id_aluno, id_turma, status_matricula, observacoes) 
                OUTPUT INSERTED.* 
                VALUES (@id_aluno, @id_turma, @status_matricula, @observacoes)
            `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao criar matrícula:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateMatricula(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { id_aluno, id_turma, status_matricula, observacoes } = req.body;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("id_aluno", sql.Int, id_aluno)
      .input("id_turma", sql.Int, id_turma)
      .input("status_matricula", sql.VarChar, status_matricula)
      .input("observacoes", sql.Text, observacoes).query(`
                UPDATE matricula 
                SET id_aluno = @id_aluno, id_turma = @id_turma, status_matricula = @status_matricula, observacoes = @observacoes 
                OUTPUT INSERTED.* 
                WHERE id_matricula = @id
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Matrícula não encontrada" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao atualizar matrícula:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteMatricula(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM matricula WHERE id_matricula = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Matrícula não encontrada" });
    }
    res.json({ message: "Matrícula excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir matrícula:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getPagamentos(req, res) {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
            SELECT p.*, m.id_aluno, a.nome as aluno_nome
            FROM pagamento p 
            JOIN matricula m ON p.id_matricula = m.id_matricula
            JOIN aluno a ON m.id_aluno = a.id_aluno
            ORDER BY p.data_pagamento DESC
        `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createPagamento(req, res) {
  try {
    const pool = getPool();
    const { id_matricula, valor, tipo_pagamento, periodo_referencia, status } =
      req.body;
    const result = await pool
      .request()
      .input("id_matricula", sql.Int, id_matricula)
      .input("valor", sql.Decimal(10, 2), valor)
      .input("tipo_pagamento", sql.VarChar, tipo_pagamento)
      .input("periodo_referencia", sql.VarChar, periodo_referencia)
      .input("status", sql.VarChar, status).query(`
                INSERT INTO pagamento (id_matricula, valor, tipo_pagamento, periodo_referencia, status) 
                OUTPUT INSERTED.* 
                VALUES (@id_matricula, @valor, @tipo_pagamento, @periodo_referencia, @status)
            `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updatePagamento(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { id_matricula, valor, tipo_pagamento, periodo_referencia, status } =
      req.body;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("id_matricula", sql.Int, id_matricula)
      .input("valor", sql.Decimal(10, 2), valor)
      .input("tipo_pagamento", sql.VarChar, tipo_pagamento)
      .input("periodo_referencia", sql.VarChar, periodo_referencia)
      .input("status", sql.VarChar, status).query(`
                UPDATE pagamento 
                SET id_matricula = @id_matricula, valor = @valor, tipo_pagamento = @tipo_pagamento, 
                    periodo_referencia = @periodo_referencia, status = @status 
                OUTPUT INSERTED.* 
                WHERE id_pagamento = @id
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Erro ao atualizar pagamento:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deletePagamento(req, res) {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM pagamento WHERE id_pagamento = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }
    res.json({ message: "Pagamento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir pagamento:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  getTurmas,
  createTurma,
  updateTurma,
  deleteTurma,
  getAlunos,
  createAluno,
  updateAluno,
  deleteAluno,
  getMatriculas,
  createMatricula,
  updateMatricula,
  deleteMatricula,
  getPagamentos,
  createPagamento,
  updatePagamento,
  deletePagamento,
};

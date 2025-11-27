const express = require("express");
const router = express.Router();
const controller = require("../controllers/projeto_universidade_controller");

router.get("/departamentos", controller.getDepartamentos);
router.post("/departamentos", controller.createDepartamento);
router.put("/departamentos/:id", controller.updateDepartamento);
router.delete("/departamentos/:id", controller.deleteDepartamento);

router.get("/cursos", controller.getCursos);
router.post("/cursos", controller.createCurso);
router.put("/cursos/:id", controller.updateCurso);
router.delete("/cursos/:id", controller.deleteCurso);

router.get("/turmas", controller.getTurmas);
router.post("/turmas", controller.createTurma);
router.put("/turmas/:id", controller.updateTurma);
router.delete("/turmas/:id", controller.deleteTurma);

router.get("/alunos", controller.getAlunos);
router.post("/alunos", controller.createAluno);
router.put("/alunos/:id", controller.updateAluno);
router.delete("/alunos/:id", controller.deleteAluno);

router.get("/matriculas", controller.getMatriculas);
router.post("/matriculas", controller.createMatricula);
router.put("/matriculas/:id", controller.updateMatricula);
router.delete("/matriculas/:id", controller.deleteMatricula);

router.get("/pagamentos", controller.getPagamentos);
router.post("/pagamentos", controller.createPagamento);
router.put("/pagamentos/:id", controller.updatePagamento);
router.delete("/pagamentos/:id", controller.deletePagamento);

module.exports = router;

import { prisma } from "./config/database.js";
import { turma } from "./sla/turma.js";
import { estudante } from "./sla/estudante.js";
import { turmaDAO } from "./persistencia/turmaDAO.js";
import { estudanteDAO } from "./persistencia/estudanteDAO.js";

const TurmaDAO = new turmaDAO();
const EstudanteDAO = new estudanteDAO();

async function main() {
  console.log("CRUD com Prisma e relacionamento 1:N\n");

  const turmaLatim = await TurmaDAO.criar({
    nome: "espanhol basico",
    horario: "terça a domingo 7:00-10:00",
    idioma: "Latim",
  });
  console.log("turma criada:", turmaLatim);

  const a1 = await EstudanteDAO.criar({
    nome: "Jacinto",
    turmaCodigo: turmaLatim.codigo,
  });
  console.log("estudante criado:", a1);

  const a2 = await EstudanteDAO.criar({
    nome: "Josefa",
    turmaCodigo: turmaLatim.codigo,
  });
  console.log("estudante criado:", a2);

  const turmaAtualizada = await TurmaDAO.atualizar(turmaLatim.codigo, {
    horario: "seg a sex 07:00-10:00",
  });
  console.log("hora mudada:", turmaAtualizada.horario);

  const alunoTransferido = await EstudanteDAO.atualizar(a2.codigo, {
    turmaCodigo: turmaLatim.codigo,
  });
  console.log(
    `${alunoTransferido.nome} agora está na turma ${alunoTransferido.turmaCodigo}`,
  );

  await EstudanteDAO.remover(a2.codigo);
  console.log("estudante removido.");

  await TurmaDAO.remover(turmaLatim.codigo);
  console.log("turma removida.");

  const turmasFinal = await TurmaDAO.listarTodas();
  turmasFinal.forEach((t) => {
    console.log(`${t.nome} (${t.estudantes.length} alunos)`);
  });
}

main()
  .catch((e) => console.error("erro na execuçao:", e))
  .finally(() => prisma.$disconnect());

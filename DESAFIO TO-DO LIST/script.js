const form = document.getElementById("formTarefa");
const input = document.getElementById("tarefa");
const tarefaPendente = document.getElementById("pendente");
const tarefaConcluido = document.getElementById("concluido");
const button = document.getElementById("btnAdicionar");

//DIALOG EDITAR
const dialogEditar = document.getElementById("dialogEditar");
const inputEditar = document.getElementById("inputEditar");
const salvarEdicao = document.getElementById("salvarEdicao");

//DIALOG EXCLUIR
const dialogExcluir = document.getElementById("dialogExcluir");
const confirmarExcluir = document.getElementById("confirmarExcluir");
const cancelarExcluir = document.getElementById("cancelarExcluir");

//ARRAY DE TAREFAS
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

//CONTROLE
let idEdicao = null;
let indiceExcluir = null;

// BOTAO COMEÇA DESABILITADO
button.disabled = true;

// HABILITAR / DESABILITAR BOTÃO
input.addEventListener("input", () => {
  if (input.value.trim() !== "") {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
});

//SALVAR NO LOCAL STORAGE
function salvarLocalStorage() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// CRIAR CARD
function criarCardTarefa(tarefa, indice) {
  //CARD
  const card = document.createElement("div");
  card.classList.add("tarefa");

  //CHECKBOX
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = tarefa.concluida;

  // TEXTO
  const span = document.createElement("span");
  span.textContent = tarefa.nome;
  //ACOES
  const divAcoes = document.createElement("div");
  divAcoes.classList.add("acoes");

  // BOTÃO EDITAR
  const btnEditar = document.createElement("button");
  btnEditar.innerHTML = ` <i class="bi bi-pencil-fill"></i>`;
  btnEditar.classList.add("editar");

  btnEditar.addEventListener("click", () => {
    idEdicao = indice;

    inputEditar.value = tarefas[indice].nome;

    dialogEditar.showModal();
  });

  // BOTÃO EXCLUIR
  const btnExcluir = document.createElement("button");
  btnExcluir.innerHTML = `<i class="bi bi-trash-fill"></i>`;
  btnExcluir.classList.add("excluir");

  btnExcluir.addEventListener("click", () => {
    indiceExcluir = indice;

    dialogExcluir.showModal();
  });

  //CHECKBOX
  checkbox.addEventListener("change", () => {
    tarefa.concluida = checkbox.checked;

    salvarLocalStorage();
    renderizarTarefas();
  });

  //ADICIONAR BOTÕES
  divAcoes.appendChild(btnEditar);
  divAcoes.appendChild(btnExcluir);

  //ELEMENTODS DENTRO DO CARD
  card.appendChild(checkbox);
  card.appendChild(span);
  card.appendChild(divAcoes);

  // VERIFICAR ONDE VAI OS CARDS
  if (tarefa.concluida) {
    tarefaConcluido.appendChild(card);
  } else {
    tarefaPendente.appendChild(card);
  }
}

//RENDERIZAR
function renderizarTarefas() {
  //LIMPAR
  tarefaPendente.innerHTML = "<h3>Pendente</h3>";
  tarefaConcluido.innerHTML = "<h3>Concluído</h3>";

  // CASO NAO TENHA TAREFA
  if (tarefas.length === 0) {
    tarefaPendente.style.display = "none";
    tarefaConcluido.style.display = "none";

    return;
  }
  // MOSTRAR SECOES
  tarefaPendente.style.display = "block";
  tarefaConcluido.style.display = "block";

  //PERCORRER ARRAY

  tarefas.forEach((tarefa, indice) => {
    const card = criarCardTarefa(tarefa, indice);
  });
}

// CADASTRAR / EDITAR
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nomeTarefa = input.value.trim();

  // VALIDAR

  if (nomeTarefa === "") {
    alert("Digite uma tarefa");
    return;
  }

  //EDITAR

  if (idEdicao !== null) {
    tarefas[idEdicao].nome = nomeTarefa;
    idEdicao = null;
  } else {
    //NOVA TAREFA

    tarefas.push({
      nome: nomeTarefa,
      concluida: false,
    });
  }

  salvarLocalStorage();
  renderizarTarefas();
  form.reset();
  button.disabled = true;
});

//EXCLUIR

function excluirTarefa(indice) {
  tarefas.splice(indice, 1);

  salvarLocalStorage();
  renderizarTarefas();
}

//CONFIRMAR EXCLUSÃO

confirmarExcluir.addEventListener("click", () => {
  excluirTarefa(indiceExcluir);

  dialogExcluir.close();
});

//CANCELAR EXCLUSÃO
cancelarExcluir.addEventListener("click", () => {
  dialogExcluir.close();
});

// SALVAR EDICAO
salvarEdicao.addEventListener("click", () => {
  const novoValor = inputEditar.value.trim();
  if (novoValor === "") return;
  tarefas[idEdicao].nome = novoValor;

  salvarLocalStorage();
  renderizarTarefas();
  dialogEditar.close();
});

//EDITAR

/*function editarTarefa(indice) {
  input.value = tarefas[indice].nome;

  idEdicao = indice;

  input.focus();
}*/

renderizarTarefas();

// ==================================================
// 1. ELEMENTOS DO DOM
// ==================================================

const inputTitulo = document.querySelector("#input-titulo");
const btnAdicionar = document.querySelector("#btn-adicionar");
const listaFilmes = document.querySelector("#lista-filmes");
const mensagem = document.querySelector("#mensagem");

// ==================================================
// 2. ESTADO DA APLICAÇÃO
// ==================================================

let filmes = [];

// ==================================================
// 3. FUNÇÕES
// ==================================================

function salvarFilmes() {
  const filmesEmTexto = JSON.stringify(filmes);
  localStorage.setItem("meus_filmes", filmesEmTexto);
}

function carregarFilmes() {
  const filmesEmTexto = localStorage.getItem("meus_filmes");

  if (filmesEmTexto === null) {
    filmes = [];
    return;
  }

  filmes = JSON.parse(filmesEmTexto);
}

function adicionarFilme() {
  const titulo = inputTitulo.value.trim();

  // Validação
  if (titulo === "") {
    mensagem.textContent =
      "Digite o título de um filme antes de adicionar.";

    mensagem.className = "mensagem erro";
    return;
  }

  // Novo objeto filme
  const novoFilme = {
    id: Date.now(),
    titulo: titulo,
    assistido: false
  };

  // Adiciona ao array
  filmes.push(novoFilme);

  // Salva e atualiza a tela
  salvarFilmes();
  renderizarFilmes();

  // Limpa o input
  inputTitulo.value = "";
  inputTitulo.focus();

  // Mensagem
  mensagem.textContent = "Filme adicionado com sucesso!";
  mensagem.className = "mensagem sucesso";
}

function alternarAssistido(id) {
  const filmeEncontrado = filmes.find(function (filme) {
    return filme.id === id;
  });

  if (filmeEncontrado === undefined) {
    mensagem.textContent = "Não foi possível localizar o filme.";
    mensagem.className = "mensagem erro";
    return;
  }

  // Inverte true/false
  filmeEncontrado.assistido = !filmeEncontrado.assistido;

  salvarFilmes();
  renderizarFilmes();

  mensagem.textContent = "Status do filme atualizado.";
  mensagem.className = "mensagem sucesso";
}

function excluirFilme(id) {
  filmes = filmes.filter(function (filme) {
    return filme.id !== id;
  });

  salvarFilmes();
  renderizarFilmes();

  mensagem.textContent = "Filme excluído com sucesso.";
  mensagem.className = "mensagem sucesso";
}

function renderizarFilmes() {
  listaFilmes.innerHTML = "";

  // Lista vazia
  if (filmes.length === 0) {
    const itemVazio = document.createElement("li");

    itemVazio.textContent = "Nenhum filme cadastrado.";
    itemVazio.className = "filme";

    listaFilmes.appendChild(itemVazio);
    return;
  }

  // Percorre o array
  filmes.forEach(function (filme) {
    const item = document.createElement("li");
    item.className = "filme";

    if (filme.assistido) {
      item.classList.add("assistido");
    }

    // Título
    const titulo = document.createElement("span");
    titulo.textContent = filme.titulo;
    titulo.className = "titulo-filme";

    // Botão status
    const btnStatus = document.createElement("button");
    btnStatus.className = "btn-status";

    if (filme.assistido) {
      btnStatus.textContent = "Marcar como não assistido";
    } else {
      btnStatus.textContent = "Marcar como assistido";
    }

    btnStatus.addEventListener("click", function () {
      alternarAssistido(filme.id);
    });

    // Botão excluir
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "btn-excluir";

    btnExcluir.addEventListener("click", function () {
      excluirFilme(filme.id);
    });

    // Monta o item
    item.appendChild(titulo);
    item.appendChild(btnStatus);
    item.appendChild(btnExcluir);

    // Adiciona na lista
    listaFilmes.appendChild(item);
  });
}

// ==================================================
// 4. EVENTOS
// ==================================================

btnAdicionar.addEventListener("click", adicionarFilme);

// Adicionar pressionando Enter
inputTitulo.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    adicionarFilme();
  }
});

// ==================================================
// 5. INICIALIZAÇÃO
// ==================================================

carregarFilmes();
renderizarFilmes();
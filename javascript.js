// Elementos da pagina web
const modalContainer = document.getElementById('modal-tela');
const modal = document.querySelector('.modal');

const botaoFecharModal = document.querySelector('.fechar');
const form = document.forms['myForm'];

const tabela = document.querySelector('tbody');
const colectionLinhas = tabela.getElementsByTagName('tr');

let linhaSelecionadaParaEditar = null;
let indexLinhaSelecionada = -1;

const inputPesquisa = document.querySelector(
  '.box-pesquisa > input[type=text]'
);

let x = 1;
let pessoasArray = [
  {
    id: x++,
    nome: 'Alex',
    sobrenome: 'Silva',
    pontos: 81,
  },
  {
    id: x++,
    nome: 'Brunna',
    sobrenome: 'Ferreira',
    pontos: 59,
  },
  {
    id: x++,
    nome: 'Patricia',
    sobrenome: 'Sampaio',
    pontos: 15,
  },
  {
    id: x++,
    nome: 'Ricardo',
    sobrenome: 'Azevedo',
    pontos: 221,
  },
  {
    id: x++,
    nome: 'Mariana',
    sobrenome: 'Ximenes',
    pontos: 77,
  },
  {
    id: x++,
    nome: 'Maria',
    sobrenome: 'Aparecida',
    pontos: 88,
  },
  {
    id: x++,
    nome: 'Lucas',
    sobrenome: 'Medeiros',
    pontos: 47,
  },
  {
    id: x++,
    nome: 'Alexandre',
    sobrenome: 'Constantino',
    pontos: 74,
  },
  {
    id: x++,
    nome: 'Silvana',
    sobrenome: 'Maia',
    pontos: 63,
  },
  {
    id: x++,
    nome: 'Sergio',
    sobrenome: 'Maia',
    pontos: 111,
  },
  {
    id: x++,
    nome: 'Tadeu',
    sobrenome: 'Melo',
    pontos: 98,
  },
  {
    id: x++,
    nome: 'Luana',
    sobrenome: 'Piovanni',
    pontos: 111,
  },
  {
    id: x++,
    nome: 'Zeca',
    sobrenome: 'Camargo',
    pontos: 111,
  },
  {
    id: x++,
    nome: 'Alessandra',
    sobrenome: 'Noronha',
    pontos: 111,
  },
];

//funcao responsavel por adicional plano de fundo as linhas da tabela
function clickLinhaHandle(event) {
  //Limpa a linha que estiver selecionada
  for (let linha of tabela.rows) {
    if (linha.classList.contains('fundo-linha')) {
      linha.classList.remove('fundo-linha');
      break;
    }
  }

  const linhaClicada = event.currentTarget;
  linhaClicada.classList.add('fundo-linha'); //muda background
}

// Popular linhas da tabela
function carregarLinhasDaTabela(array = pessoasArray) {
  //Limpar tabela
  tabela.innerHTML = null;

  let numeroDeLinhas = 0;
  for (let pessoa of array) {
    const linha = tabela.insertRow(numeroDeLinhas);
    linha.onclick = clickLinhaHandle;
    linha.setAttribute('data-index_number', pessoa.id);

    linha.insertCell(0).textContent = pessoa.nome;
    linha.insertCell(1).textContent = pessoa.sobrenome;
    linha.insertCell(2).textContent = pessoa.pontos;

    const celulaActions = linha.insertCell(3);
    celulaActions.classList.add('icon-container');
    celulaActions.innerHTML = `
              <span class="material-icons icons">edit</span>
              <span class="material-icons icons">delete</span>
         `;

    numeroDeLinhas++;
  }

  /*Add evento de click ao botao editar e deletar */
  const celulasAction = document.getElementsByClassName('icon-container'); //td
  for (celula of celulasAction) {
    celula.firstElementChild.onclick = editarLinhaHandle;
    celula.lastElementChild.onclick = deletarLinhaHandle;
  }
}
//Descobrir posicao da linha na tabela, que pode variar  de 0 a n posicões
function getIndexLinha(linha) {
  // Salvar a posicao da linha selecionada na tabela
  const colectionLinhas = tabela.rows;
  for (posicao in colectionLinhas) {
    if (colectionLinhas[posicao] == linha) {
      return posicao;
    }
  }
}

function removerLinhaDaTabela(linha) {
  // Descobre o id do objeto para remove-lo depois no array de dados
  const indexLinha = Number(linha.dataset.index_number);
  //Remove o obejeto que representa a linha selecionada no Array de dados
  pessoasArray = pessoasArray.filter((pessoa) => pessoa.id != indexLinha);
  //Retorna a posicao da linha na tabela
  indexLinhaSelecionada = getIndexLinha(linha);
  //Remove a linha da tabela e atualiza automaticamente
  tabela.deleteRow(indexLinhaSelecionada);
}

function deletarLinhaHandle(evento) {
  const linhaParaRemover = evento.target.parentElement.parentElement;
  removerLinhaDaTabela(linhaParaRemover);
}

function editarLinhaHandle(event) {
  //Salvo a linha selecionada
  linhaSelecionadaParaEditar = event.target.parentElement.parentElement;

  //Recupera uma colection de celulas (td) de uma linha especifica
  const celulas = linhaSelecionadaParaEditar.cells;

  // Carregando os dados para o formulario:
  form.firstname.value = celulas[0].textContent;
  form.lastname.value = celulas[1].textContent;
  form.points.value = celulas[2].textContent;

  modalContainer.classList.add('mostrar');
}

form.btnSalvar.onclick = function executarSubmitHandle(event) {
  event.preventDefault();
  //Salva o index do objeto pessoa que a linha representa
  const idPessoa = Number(linhaSelecionadaParaEditar.dataset.index_number);
  //Edita o objeto correspondente com os dados coletados
  const pessoa = {
    id: idPessoa,
    nome: form.firstname.value,
    sobrenome: form.lastname.value,
    pontos: Number(form.points.value),
  };
  //funcao de pesquisa que retorna a posicao do elemento encontrado
  const getIndexPessoa = (pessoa) => {
    return pessoa.id == idPessoa;
  };
  const indexPessoa = pessoasArray.findIndex(getIndexPessoa);
  //Atualiza os dados do array de pessoas
  pessoasArray.splice(indexPessoa, 1, pessoa);

  //
  // Pega somente as pessoas correspondentes as linhas na tabela
  const idsNumber = [];
  for (linha of tabela.rows) {
    idsNumber.push(Number(linha.dataset.index_number));
  }
  const arrayFiltre = pessoasArray.filter((pessoa) => {
    return idsNumber.indexOf(pessoa.id) != -1;
  });
  //Atualizar tabela
  carregarLinhasDaTabela(arrayFiltre);

  //Remover o modal da tela
  modalContainer.classList.remove('mostrar');
};
//------
form.btnDeletar.onclick = function resolverBotaoDeleteHandle(event) {
  removerLinhaDaTabela(linhaSelecionadaParaEditar);
  //Remover o modal da tela
  modalContainer.classList.remove('mostrar');
};

//Anexar ouvite de evento para a janela atual
window.onclick = function resolverClick(evento) {
  const elementoHTML = evento.target;

  //Se clicar em qualquer area fora do modal
  /* if (elementoHTML == modalContainer) {
    modalContainer.classList.remove('mostrar');
  } */
  //Se clicar no botao fechar do modal
  if (elementoHTML == botaoFecharModal) {
    modalContainer.classList.remove('mostrar');
  }
};

// Pesquisar linhas na tabela
function pesquisarLinhasHandleInput(event) {
  const ENTER = 13;
  if (event.keyCode != ENTER) {
    return;
  }

  let textoValue = event.target.value;

  //Verifica se o usuario digitou so espaços em branco
  if (textoValue.length > 0 && !(textoValue.trim() != '')) {
    alert('AVISO: DIGITE UM VALOR VALIDO!!');
    this.value = '';
    // se o usuario nao digitou nada e clicou so no ENTER
  } else if (!textoValue.length > 0) {
    carregarLinhasDaTabela();
  } else {
    const wordSearch = textoValue.trim().toLowerCase();
    //retorna true caso palavra pesquisada aparesca no nome ou sobrenome
    const pesquisarPalavra = ({ nome, sobrenome }) => {
      return (
        nome.toLowerCase().search(wordSearch) != -1 ||
        sobrenome.toLowerCase().search(wordSearch) != -1
      );
    };

    const arrayPessoasFiltradas = pessoasArray.filter(pesquisarPalavra);
    carregarLinhasDaTabela(arrayPessoasFiltradas);
  }
}

carregarLinhasDaTabela();
inputPesquisa.onkeyup = pesquisarLinhasHandleInput;
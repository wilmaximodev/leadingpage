//Buscando elementos do HTML

const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const quantidadeDePaginas = document.getElementById('quantidadeDePaginas');
const quantidadeDeFolhas = document.getElementById('quantidadeDeFolhas');
const encadernacao = [...document.getElementsByName('encadernacao')];
const frenteEVerso = [...document.getElementsByName('lado')];
const avisoValorMaximo = document.getElementById('avisoValorMaximo');
const avisoValorMinimo = document.getElementById('avisoValorMinimo');
const quantidadeMaxima = 3000;
const quantidadeMinima = 1;
const buttonSubmit = document.getElementById('submit');
const inputNome = document.getElementById('inputNome');
const inputTelefone = document.getElementById('inputTelefone');
const inputEmail = document.getElementById('inputEmail');

//Funções para cálculos e formatação de valores

const calcularPrecoImpressao = (qtd) => {
  const precos = [
    { limite: 1000, preco: 0.25 },
    { limite: 500, preco: 0.40 },
    { limite: 150, preco: 0.45 },
    { limite: 50, preco: 0.50 },
  ];
  const faixa = precos.find(({ limite }) => qtd >= limite);
  return faixa ? faixa.preco : 1;
};

const calcularPrecoEncadernacao = (qtd) => {
  const precos = [
    { limite: 49, preco: 6.00 },
    { limite: 149, preco: 10.00 },
    { limite: 249, preco: 15.00 },
    { limite: 500, preco: 25.00 },
    { limite: 1000, preco: 45.00 },
  ];
  const faixa = precos.find(({ limite }) => qtd <= limite);
  return faixa ? faixa.preco : 6.00;
};

const formatarValor = (numero) => numero.toFixed(2).replace('.', ',');

const processarNumero = (numero) => numero % 2 === 0 ? numero / 2 : (numero - 1) / 2 + 1;

const calcularValorTotal = (paginas, preco, encadernacao) =>
  paginas * preco + encadernacao;

//Funções para atualizar valores no HTML

const seEFrente = (tipo, paginas, folhas) =>
  tipo === 'frenteEVerso' ? folhas : paginas;

const obterValoresAtuais = () => {
  const qtdDePaginas = parseInt(quantidadeDePaginas?.value) || 0;
  const qtdDeFolhas = processarNumero(qtdDePaginas);

  const tipoEncadernacao = encadernacao.find(e => e.checked)?.id || null;
  const tipoFrenteEVerso = frenteEVerso.find(e => e.checked)?.id || null;

  return {
    qtdDePaginas,
    qtdDeFolhas,
    tipoEncadernacao,
    tipoFrenteEVerso
  };
};

const atualizarValores = () => {
  const {
    qtdDePaginas,
    qtdDeFolhas,
    tipoEncadernacao,
    tipoFrenteEVerso
  } = obterValoresAtuais();

  //frente e verso
  tipoFrenteEVerso === 'frenteEVerso' ?
    quantidadeDeFolhas.textContent = `Quantidade de Folhas: ${qtdDeFolhas}` :
    quantidadeDeFolhas.textContent = '';

  //encadernação
  const qtdDeFolhasOuPaginas = seEFrente(tipoFrenteEVerso, qtdDePaginas, qtdDeFolhas);

  const precoEncadernacao =
  tipoEncadernacao === 'comEncadernacao' ? calcularPrecoEncadernacao(qtdDeFolhasOuPaginas) : 0;

  tipoEncadernacao === 'comEncadernacao' ?
    valorEncadernacao.textContent =
      `Valor da Encadernação: R$${formatarValor(precoEncadernacao)}` :
    valorEncadernacao.textContent = '';

  //impressão
  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);
  valorPorPagina.textContent =
    `Valor por Página: R$${formatarValor(precoImpressao)}`;

  const novoValor = calcularValorTotal(qtdDePaginas, precoImpressao, precoEncadernacao);

  valorTotal.textContent = `Valor Total: R$${formatarValor(novoValor)}`;
};

//validações
const validarEmail = (email) => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email);
};

const validarTelefone = (telefone) => {
  const regexTelefone = /^\d{2}\d{4,5}-\d{4}$/;
  return regexTelefone.test(telefone);
};

const validarNome = (nome) => {
  const regexNome = /^[A-Za-zÀ-ÿ\s]{6,}$/;
  return regexNome.test(nome);
};

//Função para submeter o formulário

const submitFormulario = () => {
  formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Submit clicado');
  });
};

const setarEntrada = () => {
  const { qtdDeFolhas } = obterValoresAtuais();

  if (qtdDeFolhas > quantidadeMaxima) {
    quantidadeDePaginas.value = quantidadeMaxima;
    avisoValorMaximo.style.display = 'inline';
  } else {
    avisoValorMaximo.style.display = 'none';
  }

  if (qtdDeFolhas < quantidadeMinima) {
    quantidadeDePaginas.value = quantidadeMinima;
  }
};

//Eventos
document.addEventListener('DOMContentLoaded', () => {
  quantidadeDePaginas.addEventListener('input', () => {
    setarEntrada();
    atualizarValores();
  });

  encadernacao.forEach((e) =>
    e.addEventListener('click', () => {
      atualizarValores();
    })
  );

  frenteEVerso.forEach((e) => {
    e.addEventListener('click', () => {
      atualizarValores();
    });
  });

  inputNome.addEventListener('input', () => {
    console.log('Nome digitado:', inputNome.value);
    console.log('Nome válido:', validarNome(inputNome.value));
  });

  submitFormulario();
});
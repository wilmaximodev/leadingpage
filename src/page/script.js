//Buscando elementos do HTML

const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const quantidadeDePaginas = document.getElementById('quantidadeDePaginas');
const quantidadeDeFolhas = document.getElementById('quantidadeDeFolhas');
const encadernacao = [...document.getElementsByName('encadernacao')];
const frenteEVerso = [...document.getElementsByName('lado')];
const corOuPEB = document.getElementsByName('cor');
const eFrenteEVerso = document.getElementById('frenteEVerso');
const avisoValorMaximo = document.getElementById('avisoValorMaximo');
const quantidadeMaxima = 3000;
const buttonSubmit = document.getElementById('submit');

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

const obterValoresAtuais = () => {
  const qtdDePaginas = parseInt(quantidadeDePaginas?.value) || 0;
  const qtdDeFolhas = processarNumero(qtdDePaginas);

  const tipoEncadernacao = encadernacao.find(e => e.checked)?.id || null;
  const tipoFrenteEVerso = frenteEVerso.find(e => e.checked)?.id || null;

  return {
    qtdDeFolhas,
    qtdDePaginas,
    tipoEncadernacao,
    tipoFrenteEVerso
  };
};

const atualizarValorImpressao = () => {
  const { qtdDePaginas } = obterValoresAtuais();
  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);
  valorPorPagina.textContent =
    `Valor por Página: R$${formatarValor(precoImpressao)}`;
};

const atualizarValorEncadernacao = () => {
  const { qtdDeFolhas, tipoEncadernacao } = obterValoresAtuais();
  const valor = calcularPrecoEncadernacao(qtdDeFolhas);

  tipoEncadernacao === 'comEncadernacao' ?
    valorEncadernacao.textContent =
      `Valor da Encadernação: R$${formatarValor(valor)}` :
    valorEncadernacao.textContent = '';
};

const atualizarValorTotal = () => {
  const { qtdDePaginas, tipoEncadernacao, qtdDeFolhas } = obterValoresAtuais();

  const precoEncadernacao =
    tipoEncadernacao === 'comEncadernacao' ? calcularPrecoEncadernacao(qtdDeFolhas) : 0;

  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);

  const novoValor = calcularValorTotal(qtdDePaginas, precoImpressao, precoEncadernacao);

  valorTotal.textContent = `Valor Total: R$${formatarValor(novoValor)}`;
};

const frenteEVersoSelecionado = () => {
  const { qtdDeFolhas, tipoFrenteEVerso } = obterValoresAtuais();

  tipoFrenteEVerso === 'frenteEVerso' ?
    quantidadeDeFolhas.textContent = `Quantidade de Folhas: ${qtdDeFolhas}` :
    quantidadeDeFolhas.textContent = '';
};

//Função para submeter o formulário

const submitFormulario = () => {
  formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Submit clicado:', formulario);
  });
};

const atualizarValores = () => {
  atualizarValorEncadernacao();
  atualizarValorImpressao();
  atualizarValorTotal();
  frenteEVersoSelecionado()
};

//Eventos

document.addEventListener('DOMContentLoaded', () => {
  quantidadeDePaginas.addEventListener('input', () => {
    const { qtdDeFolhas } = obterValoresAtuais();

    atualizarValores();

    if (qtdDeFolhas > quantidadeMaxima) {
      quantidadeDePaginas.value = quantidadeMaxima;
      avisoValorMaximo.style.display = 'inline';
    } else {
      avisoValorMaximo.style.display = 'none';
    }
  });

  encadernacao.forEach(e => e.addEventListener('click', () => {
    atualizarValorEncadernacao();
    atualizarValorTotal();
  })
  );

  frenteEVerso.forEach(e => e.addEventListener('click', () => {
    frenteEVersoSelecionado();
    atualizarValores();
  })
  );

  submitFormulario();
});
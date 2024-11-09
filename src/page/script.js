const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const quantidadeDePaginas = document.getElementById('quantidadeDePaginas');
const quantidadeDeFolhas = document.getElementById('quantidadeDeFolhas');
const encadernacao = [...document.getElementsByName('encadernado')];
const frenteEVerso = [...document.getElementsByName('lado')];
const corOuPEB = document.getElementsByName('cor');
const eFrenteEVerso = document.getElementById('frenteEVerso');
const avisoValorMaximo = document.getElementById('avisoValorMaximo');
const quantidadeMaxima = 3000;

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

const obterValoresAtuais = () => {
  let qtdDePaginas = parseInt(quantidadeDePaginas.value) || 0;
  let qtdDeFolhas = processarNumero(qtdDePaginas);

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
  valorPorPagina.innerHTML =
    `Valor por Página: R$${formatarValor(precoImpressao)}`;
};

const atualizarValorEncadernacao = () => {
  const { qtdDeFolhas, tipoEncadernacao } = obterValoresAtuais();
  const valor = calcularPrecoEncadernacao(qtdDeFolhas);

  tipoEncadernacao === 'comEncadernacao' ?
    valorEncadernacao.innerHTML =
      `Valor da Encadernação: R$${formatarValor(valor)}` :
    valorEncadernacao.innerHTML = '';
};

const atualizarValorTotal = () => {
  const { qtdDePaginas, tipoEncadernacao, qtdDeFolhas } = obterValoresAtuais();

  const precoEncadernacao =
    tipoEncadernacao === 'comEncadernacao' ? calcularPrecoEncadernacao(qtdDeFolhas) : 0;

  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);

  let novoValor = calcularValorTotal(qtdDePaginas, precoImpressao, precoEncadernacao);

  valorTotal.innerHTML = `Valor Total: R$${formatarValor(novoValor)}`;
};

const frenteEVersoSelecionado = () => {
  const { qtdDeFolhas, tipoFrenteEVerso } = obterValoresAtuais();

  tipoFrenteEVerso === 'frenteEVerso' ?
    quantidadeDeFolhas.innerHTML = `Quantidade de Folhas: ${qtdDeFolhas}` :
    quantidadeDeFolhas.innerHTML = '';
};

const submitFormulario = () => {
  formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('Submit clicado');

  });
};

const executarFuncoes = () => {
  atualizarValorEncadernacao();
  atualizarValorImpressao();
  atualizarValorTotal();
  frenteEVersoSelecionado()
};

document.addEventListener('DOMContentLoaded', () => {
  quantidadeDePaginas.addEventListener('input', () => {
    const { qtdDeFolhas } = obterValoresAtuais();

    executarFuncoes();

    if (qtdDeFolhas > quantidadeMaxima) {
      quantidadeDePaginas.value = quantidadeMaxima;
      avisoValorMaximo.style.display = 'inline';
    } else {
      avisoValorMaximo.style.display = 'none'; // Esconde o aviso
    }
  });

  encadernacao.forEach((e) =>
    e.addEventListener('click', () => {
      atualizarValorEncadernacao();
      atualizarValorTotal();
    })
  );

  frenteEVerso.forEach((e) => {
    e.addEventListener('click', () => {
      frenteEVersoSelecionado();
      executarFuncoes();
    });
  });

  submitFormulario();
});
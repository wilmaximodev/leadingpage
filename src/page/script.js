const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const quantidadeDePaginas = document.getElementById('quantidadeDePaginas');
const quantidaDeFolhas = document.getElementById('quantidadeDeFolhas');
const encadernacao = [...document.getElementsByName('encadernado')];
const frenteEVerso = [...document.getElementsByName('lado')];
const corOuPEB = document.getElementsByName('cor');
const eFrenteEVerso = document.getElementById('frenteEVerso');

const formatarMoeda = (numero) => {
  return numero.toFixed(2).replace('.', ',');
};

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

const comOuSemEncadernacao = () => {

  const { qtdDeFolhas, tipoEncadernacao } = obterValoresAtuais();
  const valor = calcularPrecoEncadernacao(qtdDeFolhas);

  if (tipoEncadernacao=== 'comEncadernacao') {
    valorEncadernacao.innerHTML =
      `Valor da Encadernação: R$${formatarMoeda(valor)}`;
  } else {
    valorEncadernacao.innerHTML = '';
  }
};

const atualizarValorImpressao = () => {
  const { qtdDePaginas, qtdDeFolhas } = obterValoresAtuais();
  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);
  valorPorPagina.innerHTML =
    `Valor por Página: R$${formatarMoeda(precoImpressao)}`;

  const max = 3000;
  if (qtdDeFolhas > max) {
    quantidadeDePaginas.value = max;
  }
};

const atualizarValorTotal = () => {
  const { qtdDePaginas, tipoEncadernacao, qtdDeFolhas } = obterValoresAtuais();

  const precoEncadernacao =
    tipoEncadernacao === 'comEncadernacao' ? calcularPrecoEncadernacao(qtdDeFolhas) : 0;

  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);

  valorTotal.innerHTML = `Valor Total: R$${formatarMoeda(qtdDePaginas * precoImpressao + precoEncadernacao)}`;
};

const atualizarValorEncadernacao = () => {
  const { qtdDeFolhas, qtdDePaginas, tipoFrenteEVerso } = obterValoresAtuais();

  let valorAtual = qtdDePaginas;
  if (tipoFrenteEVerso === 'frenteEVerso') {
    valorAtual = qtdDeFolhas;
  }

  console.log('Valor Atual: ', valorAtual);

  const precoEncadernacao = calcularPrecoEncadernacao(valorAtual);
  comOuSemEncadernacao(precoEncadernacao);
};

const processarNumero = (numero) => {
  if (numero % 2 === 0) {
    return numero /2;
  } else {
    return (numero - 1) / 2 + 1;
  }
};

const frenteEVersoSelecionado = () => {
  const { qtdDeFolhas, tipoFrenteEVerso } = obterValoresAtuais();

  if (tipoFrenteEVerso === 'frenteEVerso') {
    quantidaDeFolhas.innerHTML = `Quantidade de Folhas: ${qtdDeFolhas}`;
  } else {
    quantidaDeFolhas.innerHTML = '';
  }
};


const submitFormulario = () => {
  formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('Submit clicado');

  });
};


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

const executarFuncoes = () => {
  atualizarValorEncadernacao();
  atualizarValorImpressao();
  atualizarValorTotal();
  frenteEVersoSelecionado()
};

window.onload = () => {
  quantidadeDePaginas.addEventListener('input', executarFuncoes);

  encadernacao.forEach((e) =>
    e.addEventListener('click', () => {
      comOuSemEncadernacao();
      atualizarValorTotal();
    })
  );

  const {
    tipoEncadernacao,
    tipoFrenteEVerso,
    qtdDeFolhas,
    qtdDePaginas
  } = obterValoresAtuais();

  console.log("Tipo de Encadernação: ", tipoEncadernacao);

  console.log("Tipo de Frente e Verso: ", tipoFrenteEVerso);

  console.log("Quantidade de Folhas: ", qtdDeFolhas);


  console.log("Quantidade de Páginas: ", qtdDePaginas);

  frenteEVerso.forEach((e) => {
    e.addEventListener('click', () => {
      frenteEVersoSelecionado();
      executarFuncoes();
    });
  });

  submitFormulario();
};
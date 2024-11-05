const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const quantidadeDePaginas = document.getElementById('quantidadeDePaginas');
const quantidaDeFolhas = document.getElementById('quantidadeDeFolhas');
const encadernacao = document.getElementsByName('encadernado');
const frenteEVerso = document.getElementsByName('lado');
const corOuPEB = document.getElementsByName('cor');
const eFrenteEVerso = document.getElementById('frenteEVerso');
let encadernacaoChecked = false;

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

const comOuSemEncadernacao = (valor) => {
  for (e of encadernacao) {
    if (e.checked) {
      if (e.id === 'comEncadernacao') {
        valorEncadernacao.innerHTML =
                    `Valor da Encadernação: R$${formatarMoeda(valor)}`;
        encadernacaoChecked = true;
      } else {
        valorEncadernacao.innerHTML = '';
        encadernacaoChecked = false;
      }
    }
  }
};

const atualizarValorImpressao = () => {
  const qtd = parseInt(quantidadeDePaginas.value) || 0;
  const precoImpressao = calcularPrecoImpressao(qtd);
  valorPorPagina.innerHTML = `Valor por Página: R$${formatarMoeda(precoImpressao)}`;

  const max = 3000;
  if (qtd > max) {
    quantidadeDePaginas.value = max;
  }
};

const atualizarValorTotal = () => {
  const qtd = parseInt(quantidadeDePaginas.value) || 0;
  const precoEncadernacao = encadernacaoChecked ? calcularPrecoEncadernacao(qtd) : 0;
  const precoImpressao = calcularPrecoImpressao(qtd);

  valorTotal.innerHTML = `Valor Total: R$${formatarMoeda(qtd * precoImpressao + precoEncadernacao)}`;
};

const atualizarValorEncadernacao = () => {
  const qtd = parseInt(quantidadeDePaginas.value) || 0;
  const precoEncadernacao = calcularPrecoEncadernacao(qtd);
  comOuSemEncadernacao(precoEncadernacao);
};

const frenteEVersoSelecionado = () => {

  for (e of frenteEVerso) {
    if (e.checked) {
      if (e.id === eFrenteEVerso.id) {
        let quantidadeAtual = quantidadeDePaginas.value ;
        quantidaDeFolhas.innerHTML = `Quantidade de folhas: ${quantidadeAtual}`;
      } else {
        quantidaDeFolhas.innerHTML = '';
      }
    }
  }

  console.log(frenteEVerso);
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

window.onload = () => {
  quantidadeDePaginas.addEventListener('input', executarFuncoes);

  encadernacao.forEach((e) =>
    e.addEventListener('click', () => {
      const qtd = parseInt(quantidadeDePaginas.value) || 0;
      const precoEncadernacao = calcularPrecoEncadernacao(qtd);
      comOuSemEncadernacao(precoEncadernacao);
      atualizarValorTotal();
    })
  );

  frenteEVerso.forEach((e) => {
    e.addEventListener('click', () => frenteEVersoSelecionado());
  });

  submitFormulario();
};
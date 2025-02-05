const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const quantidadeDePaginas = document.getElementById('quantidadeDePaginas');
const quantidadeDeFolhas = document.getElementById('quantidadeDeFolhas');
const encadernacao = [...document.getElementsByName('encadernacao')];
const frenteEVerso = [...document.getElementsByName('lado')];
const cor = [...document.getElementsByName('cor')];
const avisoValorMaximo = document.getElementById('avisoValorMaximo');

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
  ];
  const faixa = precos.find(({ limite }) => qtd <= limite);
  return faixa ? faixa.preco : 6.00;
};

const formatarValor = (numero) => numero.toFixed(2).replace('.', ',');

const processarNumero = (numero) => numero % 2 === 0 ? numero / 2 : (numero - 1) / 2 + 1;

const calcularValorTotal = (paginas, preco, encadernacao) =>
  paginas * preco + encadernacao;

const seEFrente = (tipo, paginas, folhas) =>
  tipo === 'frenteEVerso' ? folhas : paginas;

//Funções para atualizar valores no HTML
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
    qtdDePaginas ,
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

  var precoEncadernacao = 0;

  if (tipoEncadernacao === 'comEncadernacao') {
    quantidadeDePaginas.max = 500;
    quantidadeDePaginas.value > 500 ? quantidadeDePaginas.value = 500 : null;
    precoEncadernacao = calcularPrecoEncadernacao(qtdDeFolhasOuPaginas);
    valorEncadernacao.textContent =
      `Valor da Encadernação: R$${formatarValor(precoEncadernacao)}`;
  } else {
    quantidadeDePaginas.max = 1000;
    precoEncadernacao = 0;
    valorEncadernacao.textContent = '';
  }

  //impressão
  const precoImpressao = calcularPrecoImpressao(qtdDePaginas);
  valorPorPagina.textContent =
    `Valor por Página: R$${formatarValor(precoImpressao)}`;

  const novoValor = calcularValorTotal(qtdDePaginas, precoImpressao, precoEncadernacao);

  valorTotal.textContent = `Valor Total: R$${formatarValor(novoValor)}`;
};

const buscarTexto = (id) => {
  const texto = document.querySelector(`label[for="${id}"]`);
  return texto ? texto.textContent : null;
};

const submitFormulario = (event) => {
  event.preventDefault();
  const idEncadernacao = buscarTexto(encadernacao.find(e => e.checked).id);
  const idFrenteEVerso = buscarTexto(frenteEVerso.find(e => e.checked).id);
  const idColorido = buscarTexto(cor.find(e => e.checked).id);
  const nome = document.getElementById('inputNome').value;
  // const numero = document.getElementById('inputTelefone').value;
  //const email = document.getElementById('inputEmail')?.value;

  alert(`Olá ${nome}, você solicitou um orçamento para ${quantidadeDePaginas.value} páginas, ${idEncadernacao}, ${idFrenteEVerso} e ${idColorido}.
    
    Orçamento no ${valorTotal.textContent}.
    
    Em breve entraremos em contato :)`);
  formulario.reset();
};

const setarEntrada = () => {
  const { qtdDeFolhas, tipoEncadernacao } = obterValoresAtuais();
  const quantidadeMinima = 1;
  const texto = buscarTexto(tipoEncadernacao).toLowerCase();
  let quantidadeMaxima = 500;


  if (tipoEncadernacao === 'comEncadernacao') {
    quantidadeMaxima = 500;
    quantidadeDePaginas.max = 500;
  } else {
    quantidadeMaxima = 1000;
    quantidadeDePaginas.max = 1000;
  }

  if (qtdDeFolhas > quantidadeMaxima) {
    quantidadeDePaginas.value = quantidadeMaxima;
    avisoValorMaximo.textContent = `O valor máximo ${texto} é de ${quantidadeMaxima} páginas.`;
    avisoValorMaximo.style.display = 'inline';
  } else {
    avisoValorMaximo.style.display = 'none';
  }

  if (qtdDeFolhas < quantidadeMinima) {
    avisoValorMaximo.textContent = `O valor mínimo permitido é ${quantidadeMinima}.`;
    avisoValorMaximo.style.display = 'inline';
  } else {
    avisoValorMaximo.style.display = 'none';
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

  formulario.addEventListener('submit', (event) => submitFormulario(event));
  formulario.addEventListener('reset', atualizarValores);

});
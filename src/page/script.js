const formulario = document.getElementById('meuFormulario');
const valorTotal = document.getElementById('valorTotal');
const quantidade = document.getElementById('quantidade');
const valorPorPagina = document.getElementById('valorPorPagina');
const valorEncadernacao = document.getElementById('valorEncadernacao');
const encadernacao = document.getElementsByName('encadernado');
const frenteEVerso = document.getElementsByName('lado');
const corOuPEB = document.getElementsByName('cor');
let encadernacaoChecked = false;

const formatarMoeda = (numero) => {
    return numero.toFixed(2).replace('.', ',');
};

const calcularPrecoImpressao = (qtd) => {
    const precos = [
        { limite: 1000, preco: 0.25 },
        { limite: 500, preco: 0.40 },
        { limite: 150, preco: 0.45 },
        { limite: 50, preco: 0.70 },
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
    const faixa = precos.find(({ limite  }) => qtd <= limite);
    return faixa ? faixa.preco : 6.00;
};

const comOuSemEncadernacao = (valor) => {
    for (e of encadernacao) {
        if (e.checked) {
            if (e.id === 'sim') {
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
    const qtd = parseInt(quantidade.value) || 0;
    const precoImpressao = calcularPrecoImpressao(qtd);
    valorPorPagina.innerHTML = `Valor por Página: R$${formatarMoeda(precoImpressao)}`;
    
    const max = 3000;
    if (qtd > max) {
        quantidade.value = max;
    }
};

const atualizarValorTotal = () => {
    const qtd = parseInt(quantidade.value) || 0;
    const precoEncadernacao = encadernacaoChecked ? calcularPrecoEncadernacao(qtd) : 0;
    const precoImpressao = calcularPrecoImpressao(qtd);

    valorTotal.innerHTML = `Valor Total: R$${formatarMoeda(qtd * precoImpressao + precoEncadernacao)}`;
};

const atualizarValorEncadernacao = () => {
    const qtd = parseInt(quantidade.value) || 0;
    const precoEncadernacao = calcularPrecoEncadernacao(qtd);
    comOuSemEncadernacao(precoEncadernacao);
};

const formatarMensagem = () => {
    let mensagem = 'Orçamento solicitado para impressão de ';
    const qtd = parseInt(quantidade.value) || 0;
    mensagem += `${qtd} páginas, `;
    for (e of encadernacao) {
        if (e.checked) {
            if (e.id === 'sim') {
                mensagem += 'com encadernação. ';
            } else {
                mensagem += 'sem encadernação. ';
            }
        }
    }
    for (e of frenteEVerso) {
        if (e.checked) {
            if (e.id === 'frenteEVerso') {
                mensagem += 'Impressão apenas frente. ';
            } else {
                mensagem += 'Impressão frente e verso. ';
            }
        }
    }
    for (e of corOuPEB) {
        if (e.checked) {
            if (e.id === 'colorido') {
                mensagem += 'Impressão colorida. ';
            } else {
                mensagem += 'Impressão preto e branco. ';
            }
        }
    }
    return mensagem;
};

const submitFormulario = () => {
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        const mensagem = formatarMensagem();
        console.log(mensagem);

        const orcamento = {

        };

    });
};

const executarFuncoes = () => {
    atualizarValorEncadernacao();
    atualizarValorImpressao();
    atualizarValorTotal();
};

window.onload = () => {
    quantidade.addEventListener('input', executarFuncoes);
    encadernacao.forEach((e) =>
        e.addEventListener('click', () => {
            const qtd = parseInt(quantidade.value) || 0;
            const precoEncadernacao = calcularPrecoEncadernacao(qtd);
            comOuSemEncadernacao(precoEncadernacao);
            atualizarValorTotal();
        })
    );
    submitFormulario();
};
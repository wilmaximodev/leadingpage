const valorTotal = document.getElementById('valorTotal');
const quantidade = document.getElementById('quantidade');
const precoPorPagina = document.getElementById('precoPorPagina');

const formatarMoeda = (numero) => {
    return numero.toFixed(2).replace('.', ',');
}

const calcularPreco = (qtd) => {
    const precos = [
        { limite: 1000, preco: 0.25 },
        { limite: 500, preco: 0.40 },
        { limite: 150, preco: 0.45 },
        { limite: 50, preco: 0.70 },
    ];

    const faixa = precos.find(({ limite }) => qtd >= limite);
    return faixa ? faixa.preco : 1;
};

const atualizarValor = () => {
    const qtd = parseInt(quantidade.value) || 0;
    const precoAtual = calcularPreco(qtd);
    precoPorPagina.innerHTML =
        `Preço por Página: R$${formatarMoeda(precoAtual)}`;
    valorTotal.innerHTML =
        `Valor Total: R$${formatarMoeda(qtd * precoAtual)}`;
    
    const max = 3000;
    if (qtd > max) {
        quantidade.value = max;
        atualizarValor();
    }
}

window.onload = () => {
    quantidade.addEventListener('input', atualizarValor);
};
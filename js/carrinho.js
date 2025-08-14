/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

// Refatoração: Modularização da lógica de adicionar produto ao carrinho
// Melhora a legibilidade e facilita a manutenção
document.querySelectorAll(".Adicionar-ao-carrinho").forEach(botao => {
    botao.addEventListener("click", handleAdicionarAoCarrinho);
});

function handleAdicionarAoCarrinho(evento) {
    // Refatoração: Extração da lógica para uma função separada
    const elementoProduto = evento.target.closest(".produto");
    const produto = obterDadosProduto(elementoProduto);
    adicionarProdutoAoCarrinho(produto);
    atualizarCarrinhoETabela();
}

function obterDadosProduto(elementoProduto) {
    // Refatoração: Função para obter dados do produto, evitando repetição de código
    return {
        id: elementoProduto.dataset.id,
        nome: elementoProduto.querySelector(".nome").textContent,
        imagem: elementoProduto.querySelector("img").getAttribute("src"),
        preco: parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", ".")),
        quantidade: 1
    };
}

function adicionarProdutoAoCarrinho(produto) {
    // Refatoração: Função dedicada para adicionar ou atualizar produto no carrinho
    const carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(p => p.id === produto.id);
    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push(produto);
    }
    salvarProdutosNoCarrinho(carrinho);
}

// Refatoração: Adição de checagem para evitar sobrescrever carrinho com valores inválidos
function salvarProdutosNoCarrinho(carrinho) {
    if (Array.isArray(carrinho)) {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// Refatoração: Uso de reduce para somar quantidades de forma mais concisa
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((soma, produto) => soma + produto.quantidade, 0);
    document.getElementById("contador-carrinho").textContent = total;
}

// Refatoração: Função para criar linha da tabela separada, melhorando clareza
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = "";
    produtos.forEach(produto => {
        corpoTabela.appendChild(criarLinhaProduto(produto));
    });
}

function criarLinhaProduto(produto) {
    // Refatoração: Função para criar elemento <tr> de produto
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="td-produto">
            <img src="${produto.imagem}" alt="${produto.nome}">
        </td>
        <td>${produto.nome}</td>
        <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
        <td class="td-quantidade"><input type="number" value="${produto.quantidade}" min="1"></td>
        <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
        <td><button class="btn-remover" data-id="${produto.id}" id="deletar">.</button></td>
    `;
    return tr;
}

// Refatoração: Agrupamento dos listeners do tbody em uma função para evitar código solto
function inicializarListenersTabela() {
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    // Listener para remover produto
    corpoTabela.addEventListener("click", evento => {
        if (evento.target.classList.contains('btn-remover')) {
            const id = evento.target.dataset.id;
            removerProdutoDoCarrinho(id);
        }
    });
    // Listener para atualizar quantidade
    corpoTabela.addEventListener("input", evento => {
        if (evento.target.type === "number") {
            const inputQuantidade = evento.target;
            const tr = inputQuantidade.closest("tr");
            const precoUnitario = parseFloat(tr.querySelector(".td-preco-unitario").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));
            const quantidade = parseInt(inputQuantidade.value);
            const precoTotal = precoUnitario * quantidade;
            tr.querySelector(".td-preco-total").textContent = `R$ ${precoTotal.toFixed(2).replace(".", ",")}`;
            const idProduto = tr.querySelector(".btn-remover").dataset.id;
            const produtos = obterProdutosDoCarrinho();
            const produto = produtos.find(produto => produto.id === idProduto);
            if (produto) {
                produto.quantidade = quantidade;
                salvarProdutosNoCarrinho(produtos);
                atualizarCarrinhoETabela();
            }
        }
    });
}

// Refatoração: Função mais concisa e com comentário explicativo
function removerProdutoDoCarrinho(id) {
    // Remove o produto do carrinho pelo id e atualiza o DOM
    const produtos = obterProdutosDoCarrinho();
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}
// Refatoração: Uso de reduce para calcular o total do carrinho de forma mais elegante
function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const totalCarrinho = produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
    document.querySelector("#total-carrinho").textContent = `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;
}

// Refatoração: Função central para atualizar o carrinho e DOM
function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

// Inicialização dos listeners e atualização inicial do carrinho
inicializarListenersTabela();
atualizarCarrinhoETabela();







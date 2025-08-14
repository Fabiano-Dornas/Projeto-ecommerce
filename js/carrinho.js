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

//Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
//    - atualizar o contador

const botoesAdicionarAoCarrinho = document.querySelectorAll(".Adicionar-ao-carrinho");


//Adicionar um evento de escuta nos botões para que quando clicar disparar uma ação.
botoesAdicionarAoCarrinho.forEach((botao) => {
    botao.addEventListener("click", (evento) => {
        //- adicionar o produto no localStorage
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));
      


        //buscar a lista de produtos do carrinho no localStorage
        const carrinho = obterProdutosDoCarrinho();
        //verificar se o produto já existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        if (existeProduto) {
            //se já existir, incrementar a quantidade
            existeProduto.quantidade += 1;
        } else {
            //se não existir, adicionar o produto ao carrinho
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarCarrinhoETabela();

    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

//atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;
    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = total;
}

//Renderizar a tabela do carrinho
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = ""; // Limpar a tabela antes de renderizar
   
    produtos.forEach(produto => {
        
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto">
                                    <img src="${produto.imagem}" alt="${produto.nome}">
                                </td>
                                <td>${produto.nome}</td>
                                <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                                <td class="td-quantidade"><input type="number" value="${produto.quantidade}" min="1"></td>
                                <td class="td-preco-total">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                                <td><button class="btn-remover" data-id="${produto.id}" id="deletar">.</button></td>`;

        corpoTabela.appendChild(tr);

    });
}

//Objetivo 2 - remover produtos do carrinho:
//passo 1: ouvir o botão de deletar
const corpoTabela = document.querySelector("#modal-1-content table tbody");

//passo 2: adicionar um evento de escuta no tbody
corpoTabela.addEventListener("click", (evento) => {
    if (evento.target.classList.contains('btn-remover')) {
        const id = evento.target.dataset.id;
        //passo 3 - remover produto do localStorage
        removerProdutoDoCarrinho(id);
    }
});
//objetivo 3 - atualizar valores do carrinho:
//passo 1: adicionar um evento de escuta no tbody
corpoTabela.addEventListener("input", evento => {
    //passo 2 - atualizar valor total do produto
    if (evento.target.type === "number") {
        const inputQuantidade = evento.target;
        const tr = inputQuantidade.closest("tr");
        const precoUnitario = parseFloat(tr.querySelector(".td-preco-unitario").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));
        const quantidade = parseInt(inputQuantidade.value);
        
        //calcular o total do produto
        const precoTotal = precoUnitario * quantidade;
        
        //atualizar o valor total na tabela
        tr.querySelector(".td-preco-total").textContent = `R$ ${precoTotal.toFixed(2).replace(".", ",")}`;
        
        //atualizar o localStorage
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

//passo 4 - Atualizar o html do carrinho retirando o produto
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    //filtrar o produto que não tem o id igual ao que foi clicado
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}
//Atualizar o total geral do carrinho
function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let totalCarrinho = 0;

    produtos.forEach(produto => {
        totalCarrinho += produto.preco * produto.quantidade;
    });

    document.querySelector("#total-carrinho").textContent = `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}
// Chamar a função para atualizar o total geral ao carregar a página
atualizarCarrinhoETabela();







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
        const produtoPreco = elementoProduto.querySelector(".preco").textContent.replace("R$", "").replace(".", "").replace(",", ".");
        

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

    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}
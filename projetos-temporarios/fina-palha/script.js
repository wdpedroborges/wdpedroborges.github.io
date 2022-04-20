const sacolaModal = document.querySelector('#sacolaModal');
const produtoModal = document.querySelector('#produtoModal');
const toast = document.querySelector('.toast');
const btnAdicionarSacola = [... document.querySelectorAll('.btnAdicionarSacola')];
const valorProdutosSacola = document.querySelector('#valorProdutosSacola');
const sacolaFlutuante = document.querySelector('#sacolaFlutuante');
const tabelaSacola = document.querySelector('#tabelaSacola');

let numeroProdutosSacola = 0;
let produtosSacola = [];

function exibeToast(texto) {
	toast.innerText = texto;
	toast.style.setProperty('display', 'block');
	setTimeout(() => {
		toast.style.setProperty('display', 'none');
	}, 1000);
}

function distingueElementosArray(array) {
	let distinguidos = [];
	for (let i = 0; i < array.length; i++) {
		let presente = false;
		for (let j = 0; j < distinguidos.length; j++) {
			if (array[i] === distinguidos[j]) {
				presente = true;
				continue;
			}
		}
		if (!presente) {
			distinguidos.push(array[i]);
		}
	}

	return distinguidos;
}

function criaObjetosProdutos(distinguidos) {
	for (let i = 0; i < distinguidos.length; i++) {
		distinguidos[i] = {
			nome: distinguidos[i],
			quantidade: 0,
			preco: 0
		};
	}

	return distinguidos;
}

function verificaProdutosSacola(produtosSacola) {
	let objetos = criaObjetosProdutos(distingueElementosArray(produtosSacola));
	for (let i = 0; i < objetos.length; i++) {
		for (let j = 0; j < produtosSacola.length; j++) {
			if (objetos[i].nome === produtosSacola[j]) {
				objetos[i].quantidade++;
			}
		}
	}

	return objetos;
}

function insereProdutosTabelaSacola(produtos) {
	limpaTabelaSacola();
	for (let i = 0; i < produtos.length; i++) {
		let linha = document.createElement('tr');
		let nome = document.createElement('td');
		let quantidade = document.createElement('td');
		let preco = document.createElement('td');

		nome.innerText = produtos[i].nome;
		quantidade.innerText = produtos[i].quantidade;
		preco.innerText = produtos[i].preco;
		linha.append(nome, quantidade, preco);

		tabelaSacola.append(linha);
	}
}

function limpaTabelaSacola() {
	tabelaSacola.innerHTML = '';
	let cabecalho = document.createElement('tr');
	let nome = document.createElement('th');
	let quantidade = document.createElement('th');
	let preco = document.createElement('th');
	nome.innerText = 'Nome';
	quantidade.innerText = 'Quantidade';
	preco.innerText = 'Preço';
	cabecalho.append(nome, quantidade, preco);
	tabelaSacola.append(cabecalho);
}

btnAdicionarSacola.forEach(btn => {
	btn.addEventListener('click', () => {
		valorProdutosSacola.innerText = ++numeroProdutosSacola;
		let infoProduto = btn.getAttribute('title');
		produtosSacola.push(infoProduto);
		exibeToast(`O produto "${infoProduto}" foi adicionado à sacola com sucesso.`);

		insereProdutosTabelaSacola(verificaProdutosSacola(produtosSacola));

	})
});

document.addEventListener('click', e => {
	if (e.target.classList.contains('bg-modal')) {
		e.target.style.setProperty('display', 'none');
	} else if (e.target.classList.contains('icone-fechar')) {
		const bgModais = [... document.querySelectorAll('.bg-modal')];
		bgModais.forEach(bgModal => {
			bgModal.style.setProperty('display', 'none');
		});
	}
});

sacolaFlutuante.addEventListener('click', () => {
	sacolaModal.style.setProperty('display', 'flex');
});
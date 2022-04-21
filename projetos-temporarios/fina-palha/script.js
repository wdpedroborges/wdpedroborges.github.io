const sacolaModal = document.querySelector('#sacolaModal');
const produtoModal = document.querySelector('#produtoModal');
const toast = document.querySelector('.toast');
const btnAdicionarSacola = [... document.querySelectorAll('.btnAdicionarSacola')];
const btnLimparSacola = document.querySelector('#btnLimparSacola');
const btnFinalizarCompra = document.querySelector('#btnFinalizarCompra');
const valorProdutosSacola = document.querySelector('#valorProdutosSacola');
const sacolaFlutuante = document.querySelector('#sacolaFlutuante');
const tabelaSacola = document.querySelector('#tabelaSacola');
const iconeMenuResponsivo = document.querySelector('#iconeMenuResponsivo');
const menuResponsivo = document.querySelector('nav ul');

let numeroProdutosSacola = 0;
let produtosSacola = [];
let objetosProdutosSacola;


let abriuMenuResponsivo = false;
iconeMenuResponsivo.addEventListener('click', () => {
	if (!abriuMenuResponsivo) {
		abriuMenuResponsivo = true;
		iconeMenuResponsivo.classList.remove('bi-list');
		iconeMenuResponsivo.classList.add('bi-x');
		menuResponsivo.style.setProperty('display', 'block');
	} else {
		abriuMenuResponsivo = false;
		iconeMenuResponsivo.classList.remove('bi-x');
		iconeMenuResponsivo.classList.add('bi-list');
		menuResponsivo.style.setProperty('display', 'none');
	}
});

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

function limpaSacola() {
	if (produtosSacola.length > 0) {
		numeroProdutosSacola = 0;
		valorProdutosSacola.innerText = numeroProdutosSacola;
		produtosSacola = [];
		limpaTabelaSacola();
		sacolaModal.style.setProperty('display', 'none');
		exibeToast('A sacola foi limpa com sucesso.');
	} else {
		sacolaModal.style.setProperty('display', 'none');
		exibeToast('A sacola já está vazia. Que tal colocar alguma coisa nela?');
	}
	
}

function removeQuantidadesNulas(array) {
	novoArray = [];

	array.forEach(elemento => {
		if (parseInt(elemento.quantidade) > 0) {
			novoArray.push(elemento);
		}
	});

	return novoArray;
}

function finalizaCompra() {
	if (produtosSacola.length > 0) {
		let inputsTabela = [... document.querySelectorAll('td input')];

		objetosProdutosSacola.forEach( (objeto, index) => {
			objeto.quantidade = inputsTabela[index].value;
		});

		exibeToast('Compra finalizada com sucesso.');
	} else {
		exibeToast('A sacola está vazia.');
	}

	return removeQuantidadesNulas(objetosProdutosSacola);
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
	// buscar aqui os preços no banco de dados
	limpaTabelaSacola();
	for (let i = 0; i < produtos.length; i++) {
		let linha = document.createElement('tr');
		let nome = document.createElement('td');
		let celulaQuantidade = document.createElement('td');
		let inputQuantidade = document.createElement('input');
		let preco = document.createElement('td');
		let celulaAcao = document.createElement('td');
		let iconeExcluir = document.createElement('i');
		nome.innerText = produtos[i].nome;
		inputQuantidade.value = produtos[i].quantidade;
		inputQuantidade.setAttribute('type', 'number');
		celulaQuantidade.append(inputQuantidade);
		preco.innerText = produtos[i].preco;
		iconeExcluir.classList.add('bi', 'bi-trash', 'icone-excluir');
		celulaAcao.append(iconeExcluir);
		linha.append(nome, celulaQuantidade, preco, celulaAcao);

		tabelaSacola.append(linha);
	}

	function removeElementoArray(array, elemento) {
		let novoArray = [];
		let totalRemovido = 0;
		for (let i = 0; i < array.length; i++) {
			if (array[i] !== elemento) {
				novoArray.push(array[i]);
			} else {
				totalRemovido++;
			}
		}

		return [novoArray, totalRemovido];
	}

	const iconeExcluir = [... document.querySelectorAll('.icone-excluir')];
	iconeExcluir.forEach(icone => {
		icone.addEventListener('click', e => {
			let nomeElementoRemover = e.target.parentElement.parentElement.children[0].innerText;

			let resultado = removeElementoArray(produtosSacola, nomeElementoRemover);
			produtosSacola = resultado[0];
			e.target.parentElement.parentElement.remove();
			numeroProdutosSacola -= resultado[1];
			valorProdutosSacola.innerText = numeroProdutosSacola;
			objetosProdutosSacola = verificaProdutosSacola(produtosSacola);

			exibeToast('Item removido com sucesso.');
		});
	});

	const tdInput = [... document.querySelectorAll('td input')];
	tdInput.forEach(input => {
		input.addEventListener('change', () => {
			if (parseInt(input.value) < 1) {
				input.value = 1;
			}
		});
	});
}

function limpaTabelaSacola() {
	tabelaSacola.innerHTML = '';
	let cabecalho = document.createElement('tr');
	let nome = document.createElement('th');
	let quantidade = document.createElement('th');
	let preco = document.createElement('th');
	let acao = document.createElement('th');
	nome.innerText = 'Nome';
	quantidade.innerText = 'Quantidade';
	preco.innerText = 'Preço (R$)';
	acao.innerText = 'Ação';
	cabecalho.append(nome, quantidade, preco, acao);
	tabelaSacola.append(cabecalho);
}

btnLimparSacola.addEventListener('click', () => {
	limpaSacola();
});

btnFinalizarCompra.addEventListener('click', () => {
	finalizaCompra();
});

btnAdicionarSacola.forEach(btn => {
	btn.addEventListener('click', () => {
		valorProdutosSacola.innerText = ++numeroProdutosSacola;
		let infoProduto = btn.getAttribute('title');
		produtosSacola.push(infoProduto);
		exibeToast(`O produto "${infoProduto}" foi adicionado à sacola com sucesso.`);

		objetosProdutosSacola = verificaProdutosSacola(produtosSacola);
		insereProdutosTabelaSacola(objetosProdutosSacola);

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
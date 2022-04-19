const circuito = document.querySelector('#circuito');
const solucaoPerfeita = document.querySelector('#solucaoPerfeita');
const estadoInicial = document.querySelector('#estadoInicial');
const output = document.querySelector('#output');

const DIMENSAO_ELEMENTO = '35px';
const ELEMENTOS_POR_COLUNA = 10;
const QUANTIDADE_ELEMENTOS = 150;

document.documentElement.style.setProperty('--dimensaoElemento', DIMENSAO_ELEMENTO);
document.documentElement.style.setProperty('--elementosPorColuna', ELEMENTOS_POR_COLUNA);

// cria os espaços do circuito
for (let i = 0; i < QUANTIDADE_ELEMENTOS; i++) {
	const espacoElemento = document.createElement('div');
	espacoElemento.setAttribute('title', `${i}`);
	espacoElemento.classList.add('espacoElemento');
	circuito.appendChild(espacoElemento);
}
// coloca os inputs de solução
for (let i = 0; i < ELEMENTOS_POR_COLUNA; i++) {
	const div = document.createElement('div');
	div.classList.add('input-solucao-perfeita');
	div.innerText = 0;
	solucaoPerfeita.appendChild(div); // input é a div com flexbox
}
// coloca os inputs de estado inicial
for (let i = 0; i < ELEMENTOS_POR_COLUNA; i++) {
	const div = document.createElement('div');
	div.classList.add('input-estado-inicial');
	div.innerText = 0;
	estadoInicial.appendChild(div); // input é a div com flexbox
}

const elementos = [... document.querySelectorAll('.elemento')];
const espacosElementos = [... document.querySelectorAll('.espacoElemento')];
const codigo = document.querySelector('#codigo');

let elementoClicado = null;
let elementoCriado = null;
let listaElementos = [];

function arrayQuantidadeColunas() {
	return ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
}

let codigoFinal = {
	listaElementos: [],
	estadoInicial: arrayQuantidadeColunas(),
	solucaoPerfeita: arrayQuantidadeColunas()
};

function limpaElementos() {
	elementos.forEach(elemento => {
		elementoClicado = null;
		elementoCriado = null;
		elemento.style.border = 'none';
	});
}

function objetoElemento() {
	return {
		elemento: null,
		posicao: null,
		conexao: []
	};
}

elementos.forEach(elemento => {
	elemento.addEventListener('click', () => {
		limpaElementos();
		elementoClicado = elemento.getAttribute('title');
		elementoCriado = objetoElemento();
		elemento.style.border = '2px solid seagreen';
	})
});

for (let i = 0; i < espacosElementos.length; i++) {
	espacosElementos[i].addEventListener('click', () => {
		if (elementoClicado) {
			switch(elementoClicado) {
				case 'and':
					espacosElementos[i].style.backgroundImage = "url('elementos/primeiro-and.png')";
					espacosElementos[i+1].style.backgroundImage = "url('elementos/segundo-and.png')";
					break;
				case 'or':
					espacosElementos[i].style.backgroundImage = "url('elementos/primeiro-or.png')";
					espacosElementos[i+1].style.backgroundImage = "url('elementos/segundo-or.png')";
					break;
				case 'not':
					espacosElementos[i].style.backgroundImage = "url('elementos/not.png')";
					break;
				case 'linha-central-vertical':
					espacosElementos[i].style.backgroundImage = "url('elementos/linha-central-vertical.png')";
					break;
				case 'linha-lateral-esquerda':
					espacosElementos[i].style.backgroundImage = "url('elementos/linha-lateral-esquerda.png')";
					break;
				case 'linha-lateral-direita':
					espacosElementos[i].style.backgroundImage = "url('elementos/linha-lateral-direita.png')";
					break;
				case 'linha-recentralizadora-esquerda':
					espacosElementos[i].style.backgroundImage = "url('elementos/linha-recentralizadora-esquerda.png')";
					break;
				case 'linha-recentralizadora-direita':
					espacosElementos[i].style.backgroundImage = "url('elementos/linha-recentralizadora-direita.png')";
					break;
				case 'primeiro-canto':
					espacosElementos[i].style.backgroundImage = "url('elementos/primeiro-canto.png')";
					break;
				case 'segundo-canto':
					espacosElementos[i].style.backgroundImage = "url('elementos/segundo-canto.png')";
					break;	
				case 'terceiro-canto':
					espacosElementos[i].style.backgroundImage = "url('elementos/terceiro-canto.png')";
					break;	
				case 'quarto-canto':
					espacosElementos[i].style.backgroundImage = "url('elementos/quarto-canto.png')";
					break;	
				case 'linha-central-horizontal':
					espacosElementos[i].style.backgroundImage = "url('elementos/linha-central-horizontal.png')";
					break;
				case 'cruz':
					espacosElementos[i].style.backgroundImage = "url('elementos/cruz.png')";
					break;
				case 'cruz-quebrada-esquerda':
					espacosElementos[i].style.backgroundImage = "url('elementos/cruz-quebrada-esquerda.png')";
					break;
				case 'cruz-quebrada-direita':
					espacosElementos[i].style.backgroundImage = "url('elementos/cruz-quebrada-direita.png')";
					break;
				case 't':
					espacosElementos[i].style.backgroundImage = "url('elementos/t.png')";
					break;
				case 'remove':
					espacosElementos[i].style.backgroundImage = "none";
					for (let j = 0; j < listaElementos.length; j++) {
						if (listaElementos[j].posicao === i) {
							listaElementos.splice(j, 1);
						}
					}
					break;
			}

			elementoCriado['elemento'] = elementoClicado;
			elementoCriado['posicao'] = i;
			if (elementoClicado !== 'remove') {
				listaElementos.push(elementoCriado);
			}
			limpaElementos();
		} else {
			listaElementos[listaElementos.length - 1]['conexao'].push(i);
			alert(`Conexão informada para ${listaElementos[listaElementos.length - 1]['elemento']}.`);	
		}
		codigoFinal.listaElementos = listaElementos;
		codigo.value = JSON.stringify(codigoFinal);
	})
}

// event listeners nos inputs de solução perfeita
const inputsSolucaoPerfeita = document.querySelectorAll('.input-solucao-perfeita');
for (let i = 0; i < inputsSolucaoPerfeita.length; i++) {
	inputsSolucaoPerfeita[i].addEventListener('click', () => {
		if (inputsSolucaoPerfeita[i].innerText === '0') {
			inputsSolucaoPerfeita[i].innerText = '1';
			codigoFinal.solucaoPerfeita[i] = '1';
		} else {
			inputsSolucaoPerfeita[i].innerText = '0';
			codigoFinal.solucaoPerfeita[i] = '0';
		}
		codigo.value = JSON.stringify(codigoFinal);
	});
}
// event listeners nos inputs de estado inicial
const inputsEstadoInicial = document.querySelectorAll('.input-estado-inicial');
for (let i = 0; i < inputsEstadoInicial.length; i++) {
	inputsEstadoInicial[i].addEventListener('click', () => {
		if (inputsEstadoInicial[i].innerText === '0') {
			inputsEstadoInicial[i].innerText = '1';
			codigoFinal.estadoInicial[i] = '1';
		} else {
			inputsEstadoInicial[i].innerText = '0';
			codigoFinal.estadoInicial[i] = '0';
		}
		codigo.value = JSON.stringify(codigoFinal);
	});
}
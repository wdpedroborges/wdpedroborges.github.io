let circuitosFeitos = ['{"listaElementos":[{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"terceiro-canto","posicao":115,"conexao":[125]},{"elemento":"linha-central-horizontal","posicao":116,"conexao":[115]},{"elemento":"linha-central-horizontal","posicao":117,"conexao":[116]},{"elemento":"primeiro-canto","posicao":118,"conexao":[117]},{"elemento":"not","posicao":108,"conexao":[118]},{"elemento":"linha-central-vertical","posicao":98,"conexao":[108]},{"elemento":"linha-central-vertical","posicao":88,"conexao":[98]},{"elemento":"linha-central-vertical","posicao":78,"conexao":[88]},{"elemento":"linha-central-vertical","posicao":68,"conexao":[78]},{"elemento":"linha-central-vertical","posicao":58,"conexao":[68]},{"elemento":"linha-central-vertical","posicao":48,"conexao":[58]},{"elemento":"linha-central-vertical","posicao":38,"conexao":[48]},{"elemento":"linha-central-vertical","posicao":28,"conexao":[38]},{"elemento":"linha-central-vertical","posicao":18,"conexao":[28]},{"elemento":"linha-central-vertical","posicao":8,"conexao":[18]}],"estadoInicial":["0","0","0","0","0","1","0","0","0","0"],"solucaoPerfeita":["0","0","0","0","0","0","0","0","0","0"]}', '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"or","posicao":134,"conexao":[144,145]},{"elemento":"linha-lateral-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-recentralizadora-esquerda","posicao":114,"conexao":[124]},{"elemento":"terceiro-canto","posicao":104,"conexao":[114]},{"elemento":"primeiro-canto","posicao":105,"conexao":[104]},{"elemento":"not","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"linha-central-vertical","posicao":136,"conexao":[146]},{"elemento":"linha-central-vertical","posicao":126,"conexao":[136]},{"elemento":"linha-central-vertical","posicao":116,"conexao":[126]},{"elemento":"linha-central-vertical","posicao":106,"conexao":[116]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"and","posicao":75,"conexao":[85,86]},{"elemento":"linha-lateral-esquerda","posicao":65,"conexao":[75]},{"elemento":"linha-recentralizadora-esquerda","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"estadoInicial":["0","0","0","0","1","1","0","0","0","0"],"solucaoPerfeita":["0","0","0","0","0","0","1","0","0","0"]}'];

let circuitoAtual = 0;

const body = document.querySelector('body');
const jogo = document.querySelector('#jogo');
const circuito = document.querySelector('#circuito');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const lampada = document.querySelector('#lampada');
const btnProximo = document.querySelector('#btnProximo');
const estrelas = document.querySelector('#estrelas');
const comentarioEstrelas = document.querySelector('#comentarioEstrelas');
const btnJogar = document.querySelector('#btnJogar');
const modalInicial = document.querySelector('#modalInicial');
const motivoDerrota = document.querySelector('#motivoDerrota');
const bateria = document.querySelector('#bateria');
const tempo = document.querySelector('#tempo');
const infoMusica = document.querySelector('#infoMusica');

let tempoInicial = 30; // segundos
let tempoCorrente;
let qtdeInicialBateria = 0;
let qtdeBateria = 0;
let vitoria = false;
let derrota = false;
let estadoInicial, solucaoPerfeita;

let intervaloTemporizador;
function temporizador() {
	intervaloTemporizador = setInterval(() => {
		if (tempoCorrente > 0) {
			if (tempoCorrente < 10) {
				tempo.innerText = `00:0${--tempoCorrente}`;
			} else {
				tempo.innerText = `00:${--tempoCorrente}`;
			}
		} else {
			clearInterval(intervaloTemporizador);
			motivoDerrota.innerText = 'O seu tempo acabou :(';
			motivoDerrota.style.setProperty('display', 'block');
			derrota = true;
		}
	}, 1000);
}

btnJogar.addEventListener('click', () => {
	modalInicial.style.setProperty('display', 'none');
	const music = new Audio('efeitos-sonoros/Born a Rockstar (Instrumental) - NEFFEX.mp3'); music.play(); music.loop =true;

	infoMusica.style.setProperty('display', 'block');
	setTimeout(() => {
		infoMusica.style.setProperty('display', 'none');
	}, 3000);

	leCircuito(JSON.parse(circuitosFeitos[circuitoAtual]));
	temporizador();
});

btnProximo.addEventListener('click', () => {
	if (circuitoAtual < circuitosFeitos.length - 1) {
		circuitoAtual++;
	} else {
		circuitoAtual = 0;
	}
	vitoria = false;
	derrota = false;
	motivoDerrota.style.setProperty('display', 'none');
	estrelas.style.setProperty('display', 'none');
	limpaEstrelas();
	leCircuito(JSON.parse(circuitosFeitos[circuitoAtual]));
	temporizador();	
});

const DIMENSAO_ELEMENTO = '35px';
const ELEMENTOS_POR_COLUNA = 10;
const QUANTIDADE_ELEMENTOS = 150;

document.documentElement.style.setProperty('--dimensaoElemento', DIMENSAO_ELEMENTO);
document.documentElement.style.setProperty('--elementosPorColuna', ELEMENTOS_POR_COLUNA);

function exibeBtnProximo() {
	btnProximo.style.setProperty('animation', 'pulso infinite 1s');
	btnProximo.style.setProperty('display', 'block');
}

function limpaEstrelas() {
	const listaEstrelas = document.querySelectorAll('.estrela');
	for (let i = 0; i < listaEstrelas.length; i++) {
		listaEstrelas[i].remove();
	}
}

function colocaEstrelas(qtde, vazias = false) {
	if (!vazias) {
		for (let i = 0; i < qtde; i++) {
			let icone = document.createElement('i');
			icone.classList.add('estrela', 'bi', 'bi-star-fill');
			estrelas.appendChild(icone);
		}
	} else {
		for (let i = 0; i < qtde; i++) {
			let icone = document.createElement('i');
			icone.classList.add('estrela', 'bi', 'bi-star');
			estrelas.appendChild(icone);
		}
	}
}

function exibeEstrelas() {

	let qtdeCliques = qtdeInicialBateria - qtdeBateria;
	let qtdeSolucaoPerfeita = qtdeInicialBateria - 2;
	let totalEstrelas = 0;

	if (qtdeCliques === qtdeSolucaoPerfeita) {
		totalEstrelas += 3;
	} else if (qtdeCliques === qtdeSolucaoPerfeita + 1) {
		totalEstrelas += 2;
	}  else if (qtdeCliques === qtdeSolucaoPerfeita + 2) {
		totalEstrelas += 1;
	}

	if (tempoCorrente >= tempoInicial/2) {
		totalEstrelas += 1;
	}

	if (tempoCorrente >= (tempoInicial - tempoInicial/4)) {
		totalEstrelas += 1;
	}

	if (totalEstrelas === 5) {
		comentarioEstrelas.innerText = 'Perfeito!';
		colocaEstrelas(5);
	} else if (totalEstrelas === 4) {
		colocaEstrelas(4);
		colocaEstrelas(1, true);
		comentarioEstrelas.innerText = 'Impressionante!';
	} else if (totalEstrelas === 3) {
		colocaEstrelas(3);
		colocaEstrelas(2, true);
		comentarioEstrelas.innerText = 'Muito bom!';
	} else if (totalEstrelas === 2) {
		colocaEstrelas(2);
		colocaEstrelas(3, true);
		comentarioEstrelas.innerText = 'Bom!';
	} else if (totalEstrelas === 1) {
		colocaEstrelas(1);
		colocaEstrelas(4, true);
		comentarioEstrelas.innerText = 'Ufa!';
	}

	estrelas.style.setProperty('display', 'block');
}

function atualizaBateria() {
	if (qtdeBateria >= 0 && !vitoria && !derrota) {
		bateria.innerText = --qtdeBateria;
	}
}

function defineBateria(estadoInicial, solucaoPerfeita) {
	// ao notar cada diferença entre o estadoInicial e a solucaoPerfeita é que se encontra a quantidade de cliques necessária para finalizar o circuito em questão
	let total = 0;
	for (let i = 0; i < estadoInicial.length; i++) {
		if (estadoInicial[i] !== solucaoPerfeita[i]) {
			total++;
		}
	}

	// entretanto, a quantia de bateria sempre será o ideal + 2
 	// solução perfeita = 3 estrelas
 	// solução perfeita - 1 = 2 estrelas
 	// solução perfeita - 2 = 1 estrela
 	// se for em metade do tempo, ganha 1 estrela a mais
 	// se for em metade da metade, 2 estrelas 
	return total + 2;
}

// cria os espaços do circuito
function criaEspacosCircuito() {
	for (let i = 0; i < QUANTIDADE_ELEMENTOS; i++) {
		const espacoElemento = document.createElement('div');
		espacoElemento.setAttribute('title', `${i}`);
		espacoElemento.classList.add('espacoElemento');
		circuito.appendChild(espacoElemento);
	}
}
// coloca os inputs
function criaInputsCircuito() {
	for (let i = 0; i < ELEMENTOS_POR_COLUNA; i++) {
		const div = document.createElement('div');
		div.classList.add('input');
		div.innerText = 0;
		input.appendChild(div); // input é a div com flexbox
	}
}

function defineInputsCircuito(estadoInicial = '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]') {
	// também serve para resetá-los
	estadoInicial = JSON.parse(estadoInicial);
	const inputs = [... document.querySelectorAll('.input')];
	inputs.forEach((input, index) => {
		if (estadoInicial[index] === '0') {
			input.style.setProperty('color', 'tomato');
		} else {
			input.style.setProperty('color', 'seagreen');
			if (espacosElementos[index + 140].classList.contains('elementoPresente')) {
				espacosElementos[index + 140].classList.add('on');
				espacosElementos[index + 140].style.backgroundImage = 'url("elementos/linha-central-vertical-on.png")';
			}
		}
		input.innerText = estadoInicial[index];
	});
}

criaEspacosCircuito();
criaInputsCircuito();

const espacosElementos = [... document.querySelectorAll('.espacoElemento')];

function limpaCircuito() {
	for (let i = 0; i < espacosElementos.length; i++) {
		espacosElementos[i].style.backgroundImage = "none";
		espacosElementos[i].classList.remove('elementoPresente');
		espacosElementos[i].classList.remove('on');
	}
}

// apenas lê o array com os objetos do circuito e insere os backgrounds nas devidas posições
function leCircuito(circuitoJSON) {
	limpaCircuito();
	tempoCorrente = tempoInicial;
	qtdeBateria = defineBateria(circuitoJSON.estadoInicial, circuitoJSON.solucaoPerfeita);
	defineInputsCircuito(JSON.stringify(circuitoJSON.estadoInicial));
	qtdeInicialBateria = qtdeBateria;
	bateria.innerText = qtdeBateria;
	body.style.setProperty('background-image', `url('bg-${(Math.random() * 4).toFixed(0)}.jpg')`);
	circuitoJSON = circuitoJSON.listaElementos;

	for (let i = 0; i < circuitoJSON.length; i++) {
		let simples = false;
		if (circuitoJSON[i].elemento === 'and') {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-and.png')";
			espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-and.png')";
		} else if (circuitoJSON[i].elemento === 'or') {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-or.png')";
			espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-or.png')";
		} else {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url('elementos/${circuitoJSON[i].elemento}.png')`;
			simples = true;
		}

		if (simples) {
			espacosElementos[circuitoJSON[i].posicao].classList.add('elementoPresente');
		} else {
			espacosElementos[circuitoJSON[i].posicao].classList.add('elementoPresente');
			espacosElementos[circuitoJSON[i].posicao + 1].classList.add('elementoPresente');
		}
	}
	propaga(circuitoJSON);
	alteraOutput();
}

function propaga(circuitoJSON) {
	const inputs = document.querySelectorAll('.input');
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].innerText === '1' && espacosElementos[i + 140].classList.contains('elementoPresente')) {
			espacosElementos[i + 140].classList.add('on');
			espacosElementos[i + 140].style.backgroundImage = 'url("elementos/linha-central-vertical-on.png")';
		}		
	}

	for (let i = 0; i < circuitoJSON.length; i++) {
		let nomeElemento = circuitoJSON[i].elemento.split('-');
		// linhas normais
		if (nomeElemento.includes('linha') || nomeElemento.includes('canto')) {
			// se tem conexão 0, é porque é um dos primeiros elementos
			if (circuitoJSON[i].conexao.length !== 0) {
				if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
					espacosElementos[circuitoJSON[i].posicao].classList.add('on');
					espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(elementos/${circuitoJSON[i].elemento}-on.png)`;
				} else {
					espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
					espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(elementos/${circuitoJSON[i].elemento}.png)`;
				}
			}
		}
		// not
		if (circuitoJSON[i].elemento === 'not') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			}
		}
		// and
		if (circuitoJSON[i].elemento === 'and') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
				espacosElementos[circuitoJSON[i].posicao + 1].classList.add('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
				espacosElementos[circuitoJSON[i].posicao + 1].classList.remove('on');
			}
		}
		// or
		if (circuitoJSON[i].elemento === 'or') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') || espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
				espacosElementos[circuitoJSON[i].posicao + 1].classList.add('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
				espacosElementos[circuitoJSON[i].posicao + 1].classList.remove('on');
			}
		}
	}
}

function alteraOutput() {
	let verdadeiro = true;
	for (let i = 0; i < 10; i++) {
		if (espacosElementos[i].classList.contains('elementoPresente')) {
			if (!espacosElementos[i].classList.contains('on')) {
				verdadeiro = false;
			}
		}
	}

	if (verdadeiro) {
		output.innerText = 'Verdadeiro';
		output.style.backgroundColor = 'seagreen';
		lampada.setAttribute('src', 'lampada-ligada.png');
		lampada.style.setProperty('animation', 'moveLampada 1s ease-out forwards');
		jogo.style.setProperty('box-shadow', '2px 2px 100px seagreen');
		btnProximo.style.setProperty('background-color', 'seagreen');
		vitoria = true;
		clearInterval(intervaloTemporizador);
		exibeBtnProximo();
		exibeEstrelas();
		const music = new Audio('efeitos-sonoros/completou.wav'); music.play(); music.loop =false;
		// music.playbackRate = 1;
		// music.pause();

	} else {
		output.innerText = 'Falso';
		output.style.backgroundColor = 'tomato';
		lampada.setAttribute('src', 'lampada-desligada.png');
		lampada.style.setProperty('transform', 'rotateZ(100deg)');
		lampada.style.setProperty('animation', 'none');
		jogo.style.setProperty('box-shadow', '2px 2px 100px tomato');
		btnProximo.style.setProperty('background-color', 'tomato');
	}
}

// event listeners nos inputs, bem como ativação do elemento imediatamente superior a cada um
const inputs = document.querySelectorAll('.input');
for (let i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', () => {
		if (qtdeBateria > 0 && !vitoria && !derrota) {
			if (inputs[i].innerText === '0') {
				const music = new Audio('efeitos-sonoros/1.wav'); music.play(); music.loop =false;
				inputs[i].innerText = '1';
				inputs[i].style.setProperty('color', 'seagreen');
				if (espacosElementos[i + 140].classList.contains('elementoPresente')) {
					espacosElementos[i + 140].classList.add('on');
					espacosElementos[i + 140].style.backgroundImage = 'url("elementos/linha-central-vertical-on.png")';
				}
			} else if (inputs[i].innerText === '1') {
				const music = new Audio('efeitos-sonoros/0.wav'); music.play(); music.loop =false;
				inputs[i].style.setProperty('color', 'tomato');
				inputs[i].innerText = '0';
				if (espacosElementos[i + 140].classList.contains('elementoPresente')) {
					espacosElementos[i + 140].classList.remove('on');
					espacosElementos[i + 140].style.backgroundImage = 'url("elementos/linha-central-vertical.png")';
				}
			}
			atualizaBateria();
			propaga(JSON.parse(circuitosFeitos[circuitoAtual]).listaElementos);
			alteraOutput();
		} else if (qtdeBateria === 0) {
			exibeBtnProximo()
			const music = new Audio('efeitos-sonoros/bateria.mp3'); music.play(); music.loop = false;
			motivoDerrota.innerText = 'A sua bateria acabou :(';
			motivoDerrota.style.setProperty('display', 'block');
			clearInterval(intervaloTemporizador);
			derrota = true;
		}
	});
}
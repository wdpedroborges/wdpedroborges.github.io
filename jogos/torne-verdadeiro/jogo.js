const circuito = document.querySelector('#circuito');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const lampada = document.querySelector('#lampada');

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
// coloca os inputs
for (let i = 0; i < ELEMENTOS_POR_COLUNA; i++) {
	const div = document.createElement('div');
	div.classList.add('input');
	div.innerText = 0;
	input.appendChild(div); // input é a div com flexbox
}

const espacosElementos = [... document.querySelectorAll('.espacoElemento')];

// apenas lê o array com os objetos do circuito e insere os backgrounds nas devidas posições
function leCircuito(circuitoJSON) {
	circuitoJSON = JSON.parse(circuitoJSON);
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
}

function propaga(circuitoJSON) {
	circuitoJSON = JSON.parse(circuitoJSON);
	for (let i = 0; i < circuitoJSON.length; i++) {
		let nomeElemento = circuitoJSON[i].elemento.split('-');
		// linhas normais
		if (nomeElemento.includes('linha') || nomeElemento.includes('canto')) {
			// se tem conexão 0, é porque é um dos primeiros elementos
			if (circuitoJSON[i].conexao.length !== 0) {
				if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
					espacosElementos[circuitoJSON[i].posicao].classList.add('on');
				} else {
					espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
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

	} else {
		output.innerText = 'Falso';
		output.style.backgroundColor = 'tomato';
		lampada.setAttribute('src', 'lampada-desligada.png');
	}
}

// event listeners nos inputs, bem como ativação do elemento imediatamente superior a cada um
const inputs = document.querySelectorAll('.input');
for (let i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', () => {
		if (inputs[i].innerText === '0') {
			inputs[i].innerText = '1';
			espacosElementos[i + 140].classList.add('on');
		} else {
			inputs[i].innerText = '0';
			espacosElementos[i + 140].classList.remove('on');
		}

		propaga(circuitoAtual);
		alteraOutput();
	});
}

let circuitoAtual = '[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"and","posicao":134,"conexao":[144,145]},{"elemento":"linha-lateral-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-recentralizadora-esquerda","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"linha-central-vertical","posicao":136,"conexao":[146]},{"elemento":"quarto-canto","posicao":126,"conexao":[136]},{"elemento":"segundo-canto","posicao":125,"conexao":[126]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"or","posicao":94,"conexao":[104,105]},{"elemento":"linha-lateral-direita","posicao":85,"conexao":[94]},{"elemento":"linha-recentralizadora-direita","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}]';
leCircuito(circuitoAtual);
propaga(circuitoAtual);
alteraOutput();
let circuitosFeitos;

const body = document.querySelector('body');
const jogo = document.querySelector('#jogo');
const circuito = document.querySelector('#circuito');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const btnProximo = document.querySelector('#btnProximo');
const estrelas = document.querySelector('#estrelas');
const comentarioEstrelas = document.querySelector('#comentarioEstrelas');
const btnJogar = document.querySelector('#btnJogar');
const modalInicial = document.querySelector('#modalInicial');
const mensagem = document.querySelector('#mensagem');
const bateria = document.querySelector('#bateria');
const tempo = document.querySelector('#tempo');
const fase = document.querySelector('#fase');
const desempenho = document.querySelector('#desempenho');
const pontuacao = document.querySelector('#pontuacao');
const infoMusica = document.querySelector('#infoMusica');
const play = document.querySelector('#play');
const modalAjuda = document.querySelector('#modalAjuda');
const opcaoAjuda = document.querySelector('#opcaoAjuda');
const btnEntendi = document.querySelector('#btnEntendi');

let elementosLinhasPagina = ['linha-central-vertical', 'linha-central-horizontal', 'linha-lateral-direita', 'linha-lateral-esquerda', 'linha-recentralizadora-direita', 'linha-recentralizadora-esquerda', 'primeiro-canto', 'segundo-canto', 'terceiro-canto', 'quarto-canto', 'cruz', 'cruz-quebrada-direita', 'cruz-quebrada-esquerda', 't'];

let elementosPortoesPagina = ['primeiro-and', 'segundo-and', 'primeiro-or', 'segundo-or', 'primeiro-nand', 'segundo-nand', 'primeiro-nor', 'segundo-nor', 'primeiro-xor', 'segundo-xor', 'primeiro-xnor', 'segundo-xnor'];

const elementosPagina = document.querySelector('#elementosPagina');

function uneArrays(lista1, lista2) {
    let uniao = [];

    for (let i = 0; i < lista1.length; i++) {
        uniao.push(lista1[i]);
    }

    for (let i = 0; i < lista2.length; i++) {
        uniao.push(lista2[i]);
    }

    return uniao; 
}

function complementaNomes(lista, complemento) {
    for (let i = 0; i < lista.length; i++) {
        lista[i] = `${lista[i]}${complemento}`;
    }

    return lista;
}

function duplicaNomesComplemento(lista, complemento) {
    let listaComplementada = [];

    for (let i = 0; i < lista.length; i++) {
        listaComplementada.push(`${lista[i]}`);
    }

    for (let i = 0; i < lista.length; i++) {
        listaComplementada.push(`${lista[i]}${complemento}`);
    }

    return listaComplementada;
}

elementosLinhasPagina = duplicaNomesComplemento(elementosLinhasPagina, '-on');
elementosLinhasPagina = complementaNomes(elementosLinhasPagina, '.png');
elementosPortoesPagina = complementaNomes(elementosPortoesPagina, '.png');

let listaElementosPagina = uneArrays(elementosLinhasPagina, elementosPortoesPagina);

for (let i = 0; i < listaElementosPagina.length; i++) {
    const img = document.createElement('img');
    img.setAttribute('src', `elementos/${listaElementosPagina[i]}`);
    elementosPagina.append(img);
}

let circuitoAtual = 0;
let circuitosPassados = 0;
let tempoInicial = 31; // segundos
let tempoCorrente;
let qtdeInicialBateria = 0;
let qtdeBateria = 0;
let vitoria = false;
let derrota = false;
let estadoInicial, solucaoPerfeita;
let valorPontuacao = 0;
let totalPerfeitos = 0;
let maximoPerfeitos = 0;
let nomeMusica = 'Cosmic Drift';
let nomeAutor = 'DivKid';
let elementosPorColuna = 10;
let quantidadeElementos = 150;
let dificuldade, modoJogo;
let intervaloTemporizador;
let fimJogo = false;

const musicaFundo = new Audio(`efeitos-sonoros/${nomeMusica} - ${nomeAutor}.mp3`);
infoMusica.textContent = `Voc?? est?? ouvindo "${nomeMusica}" por ${nomeAutor}`;

function temporizador() {
	intervaloTemporizador = setInterval(() => {
		if (tempoCorrente > 0) {
			if (tempoCorrente >= 10) {
				tempo.innerText = `${--tempoCorrente}`;
			} else {
				tempo.innerText = `${--tempoCorrente}`;
			}
		} else {
			clearInterval(intervaloTemporizador);
			exibeBtnProximo();
			mensagem.innerText = 'O seu tempo acabou :(';
			mensagem.style.setProperty('display', 'block');
			derrota = true;
			lidaTotalPerfeitos();
			const music = new Audio('efeitos-sonoros/fracasso.wav'); music.play(); music.loop = false;
			calculaDesempenho();
		}
	}, 1000);
}

btnJogar.addEventListener('click', () => {
	modalInicial.style.setProperty('display', 'none');

    dificuldade = document.querySelector('input[name="radioDificuldade"]:checked').value;
    modoJogo = document.querySelector('input[name="radioModoJogo"]:checked').value

    if (dificuldade === 'dificil') {
        tempoInicial = 20;
    } else if (dificuldade === 'muito-dificil') {
        tempoInicial = 10;
    }

 	if (modoJogo === 'treino') {
 		tempoInicial = 60;
 	}

    if (modoJogo === 'infinito' || modoJogo === 'treino') {
        const pFase = document.querySelector('#pFase');
        pFase.style.setProperty('display', 'none');
    }

    if (modoJogo === 'progressivo' || modoJogo === 'infinito') {
        circuitosFeitos = [
        	// Fase 1
        	'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[145],"solucoesPossiveis":[["0","0","0","0","0","1","0","0","0","0"]]}',
        	// Fase 2

        	// Fase 3
        	'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"not","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[145],"solucoesPossiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
        	// Fase 4
        	'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"and","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","1","1","0","0","0","0"]]}',
        	// Fase 5
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"or","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"],["0","0","0","0","1","1","0","0","0","0"]]}',
            // Fase 6
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"linha-central-vertical","posicao":133,"conexao":[143]},{"elemento":"linha-central-vertical","posicao":123,"conexao":[133]},{"elemento":"not","posicao":113,"conexao":[123]},{"elemento":"linha-central-vertical","posicao":103,"conexao":[113]},{"elemento":"linha-central-vertical","posicao":93,"conexao":[103]},{"elemento":"linha-central-vertical","posicao":83,"conexao":[93]},{"elemento":"linha-central-vertical","posicao":73,"conexao":[83]},{"elemento":"linha-central-vertical","posicao":63,"conexao":[73]},{"elemento":"linha-central-vertical","posicao":53,"conexao":[63]},{"elemento":"linha-central-vertical","posicao":43,"conexao":[53]},{"elemento":"linha-central-vertical","posicao":33,"conexao":[43]},{"elemento":"linha-central-vertical","posicao":23,"conexao":[33]},{"elemento":"linha-central-vertical","posicao":13,"conexao":[23]},{"elemento":"linha-central-vertical","posicao":3,"conexao":[13]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"not","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[143,145],"solucoesPossiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
            // Fase 7
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":142,"conexao":[]},{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"and","posicao":132,"conexao":[142,143]},{"elemento":"linha-recentralizadora-esquerda","posicao":122,"conexao":[132]},{"elemento":"linha-central-vertical","posicao":112,"conexao":[122]},{"elemento":"linha-central-vertical","posicao":102,"conexao":[112]},{"elemento":"linha-central-vertical","posicao":92,"conexao":[102]},{"elemento":"linha-central-vertical","posicao":82,"conexao":[92]},{"elemento":"linha-central-vertical","posicao":72,"conexao":[82]},{"elemento":"linha-central-vertical","posicao":62,"conexao":[72]},{"elemento":"linha-central-vertical","posicao":52,"conexao":[62]},{"elemento":"linha-central-vertical","posicao":42,"conexao":[52]},{"elemento":"linha-central-vertical","posicao":32,"conexao":[42]},{"elemento":"linha-central-vertical","posicao":22,"conexao":[32]},{"elemento":"linha-central-vertical","posicao":12,"conexao":[22]},{"elemento":"linha-central-vertical","posicao":2,"conexao":[12]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"and","posicao":135,"conexao":[145,146]},{"elemento":"linha-recentralizadora-esquerda","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[142,143,145,146],"solucoesPossiveis":[["0","0","1","1","0","1","1","0","0","0"]]}',
            // Fase 8
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"or","posicao":133,"conexao":[143,144]},{"elemento":"linha-recentralizadora-direita","posicao":124,"conexao":[133]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"linha-central-vertical","posicao":147,"conexao":[]},{"elemento":"or","posicao":136,"conexao":[146,147]},{"elemento":"linha-recentralizadora-esquerda","posicao":126,"conexao":[136]},{"elemento":"linha-central-vertical","posicao":116,"conexao":[126]},{"elemento":"linha-central-vertical","posicao":106,"conexao":[116]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"linha-central-vertical","posicao":76,"conexao":[86]},{"elemento":"linha-central-vertical","posicao":66,"conexao":[76]},{"elemento":"linha-central-vertical","posicao":56,"conexao":[66]},{"elemento":"linha-central-vertical","posicao":46,"conexao":[56]},{"elemento":"linha-central-vertical","posicao":36,"conexao":[46]},{"elemento":"linha-central-vertical","posicao":26,"conexao":[36]},{"elemento":"linha-central-vertical","posicao":16,"conexao":[26]},{"elemento":"linha-central-vertical","posicao":6,"conexao":[16]}],"posicaoElementosIniciais":[143,144,146,147],"solucoesPossiveis":[["0","0","0","0","1","0","0","1","0","0"],["0","0","0","0","1","0","1","1","0","0"],["0","0","0","1","1","0","1","1","0","0"],["0","0","0","1","0","0","0","1","0","0"],["0","0","0","0","1","0","1","0","0","0"],["0","0","0","1","0","0","1","0","0","0"],["0","0","0","1","1","0","1","0","0","0"],["0","0","0","1","0","0","1","1","0","0"],["0","0","0","1","1","0","0","1","0","0"]]}',
            // Fase 9
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"linha-central-vertical","posicao":133,"conexao":[143]},{"elemento":"linha-central-vertical","posicao":123,"conexao":[133]},{"elemento":"linha-central-vertical","posicao":113,"conexao":[123]},{"elemento":"not","posicao":103,"conexao":[113]},{"elemento":"linha-central-vertical","posicao":93,"conexao":[103]},{"elemento":"linha-central-vertical","posicao":83,"conexao":[93]},{"elemento":"linha-central-vertical","posicao":73,"conexao":[83]},{"elemento":"linha-central-vertical","posicao":63,"conexao":[73]},{"elemento":"linha-central-vertical","posicao":53,"conexao":[63]},{"elemento":"linha-central-vertical","posicao":43,"conexao":[53]},{"elemento":"linha-central-vertical","posicao":33,"conexao":[43]},{"elemento":"linha-central-vertical","posicao":23,"conexao":[33]},{"elemento":"linha-central-vertical","posicao":13,"conexao":[23]},{"elemento":"linha-central-vertical","posicao":3,"conexao":[13]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"and","posicao":135,"conexao":[145,146]},{"elemento":"linha-recentralizadora-direita","posicao":126,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":116,"conexao":[126]},{"elemento":"linha-central-vertical","posicao":106,"conexao":[116]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"linha-central-vertical","posicao":76,"conexao":[86]},{"elemento":"linha-central-vertical","posicao":66,"conexao":[76]},{"elemento":"linha-central-vertical","posicao":56,"conexao":[66]},{"elemento":"linha-central-vertical","posicao":46,"conexao":[56]},{"elemento":"linha-central-vertical","posicao":36,"conexao":[46]},{"elemento":"linha-central-vertical","posicao":26,"conexao":[36]},{"elemento":"linha-central-vertical","posicao":16,"conexao":[26]},{"elemento":"linha-central-vertical","posicao":6,"conexao":[16]}],"posicaoElementosIniciais":[143,145,146],"solucoesPossiveis":[["0","0","0","0","0","1","1","0","0","0"]]}',
            // Fase 10
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":133,"conexao":[143]},{"elemento":"linha-central-vertical","posicao":134,"conexao":[144]},{"elemento":"or","posicao":123,"conexao":[133,134]},{"elemento":"linha-recentralizadora-direita","posicao":114,"conexao":[123]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"linha-central-vertical","posicao":136,"conexao":[146]},{"elemento":"linha-central-vertical","posicao":126,"conexao":[136]},{"elemento":"linha-central-vertical","posicao":116,"conexao":[126]},{"elemento":"not","posicao":106,"conexao":[116]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"linha-central-vertical","posicao":76,"conexao":[86]},{"elemento":"linha-central-vertical","posicao":66,"conexao":[76]},{"elemento":"linha-central-vertical","posicao":56,"conexao":[66]},{"elemento":"linha-central-vertical","posicao":46,"conexao":[56]},{"elemento":"linha-central-vertical","posicao":36,"conexao":[46]},{"elemento":"linha-central-vertical","posicao":26,"conexao":[36]},{"elemento":"linha-central-vertical","posicao":16,"conexao":[26]},{"elemento":"linha-central-vertical","posicao":6,"conexao":[16]}],"posicaoElementosIniciais":[143,144,146],"solucoesPossiveis":[["0","0","0","1","1","0","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"],["0","0","0","1","0","0","0","0","0","0"]]}',
            // Fase 11
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"and","posicao":133,"conexao":[143,144]},{"elemento":"linha-recentralizadora-direita","posicao":124,"conexao":[133]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"linha-central-vertical","posicao":147,"conexao":[]},{"elemento":"or","posicao":136,"conexao":[146,147]},{"elemento":"linha-recentralizadora-esquerda","posicao":126,"conexao":[136]},{"elemento":"linha-central-vertical","posicao":116,"conexao":[126]},{"elemento":"linha-central-vertical","posicao":106,"conexao":[116]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"linha-central-vertical","posicao":76,"conexao":[86]},{"elemento":"linha-central-vertical","posicao":66,"conexao":[76]},{"elemento":"linha-central-vertical","posicao":56,"conexao":[66]},{"elemento":"linha-central-vertical","posicao":46,"conexao":[56]},{"elemento":"linha-central-vertical","posicao":36,"conexao":[46]},{"elemento":"linha-central-vertical","posicao":26,"conexao":[36]},{"elemento":"linha-central-vertical","posicao":16,"conexao":[26]},{"elemento":"linha-central-vertical","posicao":6,"conexao":[16]}],"posicaoElementosIniciais":[143,144,146,147],"solucoesPossiveis":[["0","0","0","1","1","0","1","1","0","0"],["0","0","0","1","1","0","0","1","0","0"],["0","0","0","1","1","0","1","0","0","0"]]}',
            // Fase 12
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":141,"conexao":[]},{"elemento":"linha-central-vertical","posicao":142,"conexao":[]},{"elemento":"and","posicao":131,"conexao":[141,142]},{"elemento":"linha-recentralizadora-direita","posicao":122,"conexao":[131]},{"elemento":"linha-central-vertical","posicao":112,"conexao":[122]},{"elemento":"linha-central-vertical","posicao":102,"conexao":[112]},{"elemento":"linha-central-vertical","posicao":92,"conexao":[102]},{"elemento":"linha-central-vertical","posicao":82,"conexao":[92]},{"elemento":"linha-central-vertical","posicao":72,"conexao":[82]},{"elemento":"linha-central-vertical","posicao":62,"conexao":[72]},{"elemento":"linha-central-vertical","posicao":52,"conexao":[62]},{"elemento":"linha-central-vertical","posicao":42,"conexao":[52]},{"elemento":"linha-central-vertical","posicao":32,"conexao":[42]},{"elemento":"linha-central-vertical","posicao":22,"conexao":[32]},{"elemento":"linha-central-vertical","posicao":12,"conexao":[22]},{"elemento":"linha-central-vertical","posicao":2,"conexao":[12]},{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":134,"conexao":[144]},{"elemento":"linha-central-vertical","posicao":124,"conexao":[134]},{"elemento":"not","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"linha-central-vertical","posicao":147,"conexao":[]},{"elemento":"or","posicao":136,"conexao":[146,147]},{"elemento":"linha-recentralizadora-esquerda","posicao":126,"conexao":[136]},{"elemento":"linha-central-vertical","posicao":116,"conexao":[126]},{"elemento":"linha-central-vertical","posicao":106,"conexao":[116]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"linha-central-vertical","posicao":76,"conexao":[86]},{"elemento":"linha-central-vertical","posicao":66,"conexao":[76]},{"elemento":"linha-central-vertical","posicao":56,"conexao":[66]},{"elemento":"linha-central-vertical","posicao":46,"conexao":[56]},{"elemento":"linha-central-vertical","posicao":36,"conexao":[46]},{"elemento":"linha-central-vertical","posicao":26,"conexao":[36]},{"elemento":"linha-central-vertical","posicao":16,"conexao":[26]},{"elemento":"linha-central-vertical","posicao":6,"conexao":[16]}],"posicaoElementosIniciais":[141,142,144,146,147],"solucoesPossiveis":[["0","1","1","0","0","0","1","0","0","0"],["0","1","1","0","0","0","1","1","0","0"],["0","1","1","0","0","0","0","1","0","0"]]}',
            // Fase 13
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":134,"conexao":[144]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"not","posicao":124,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"and","posicao":104,"conexao":[114,115]},{"elemento":"linha-recentralizadora-direita","posicao":95,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","1","0","0","0","0"]]}',
            // Fase 14
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"not","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":134,"conexao":[144]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":124,"conexao":[134]},{"elemento":"or","posicao":114,"conexao":[124,125]},{"elemento":"linha-recentralizadora-direita","posicao":105,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","1","1","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"]]}',
            // Fase 15
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"and","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"not","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"]]}',
            // Fase 16
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":134,"conexao":[144]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"or","posicao":124,"conexao":[134,135]},{"elemento":"linha-recentralizadora-direita","posicao":115,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"not","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
            // Fase 17
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":142,"conexao":[]},{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"not","posicao":132,"conexao":[142]},{"elemento":"linha-central-vertical","posicao":133,"conexao":[143]},{"elemento":"linha-central-vertical","posicao":122,"conexao":[132]},{"elemento":"linha-central-vertical","posicao":123,"conexao":[133]},{"elemento":"and","posicao":112,"conexao":[122,123]},{"elemento":"linha-recentralizadora-esquerda","posicao":102,"conexao":[112]},{"elemento":"linha-central-vertical","posicao":92,"conexao":[102]},{"elemento":"linha-central-vertical","posicao":82,"conexao":[92]},{"elemento":"linha-central-vertical","posicao":72,"conexao":[82]},{"elemento":"linha-central-vertical","posicao":62,"conexao":[72]},{"elemento":"linha-central-vertical","posicao":52,"conexao":[62]},{"elemento":"linha-central-vertical","posicao":42,"conexao":[52]},{"elemento":"linha-central-vertical","posicao":32,"conexao":[42]},{"elemento":"linha-central-vertical","posicao":22,"conexao":[32]},{"elemento":"linha-central-vertical","posicao":12,"conexao":[22]},{"elemento":"linha-central-vertical","posicao":2,"conexao":[12]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"and","posicao":135,"conexao":[145,146]},{"elemento":"linha-recentralizadora-esquerda","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[142,143,145,146],"solucoesPossiveis":[["0","0","0","1","0","1","1","0","0","0"]]}',
            // Fase 18
            '{"listaElementos":[{"elemento":"linha-central-vertical","posicao":142,"conexao":[]},{"elemento":"linha-central-vertical","posicao":143,"conexao":[]},{"elemento":"or","posicao":132,"conexao":[142,143]},{"elemento":"linha-recentralizadora-direita","posicao":123,"conexao":[132]},{"elemento":"linha-central-vertical","posicao":113,"conexao":[123]},{"elemento":"linha-central-vertical","posicao":103,"conexao":[113]},{"elemento":"linha-central-vertical","posicao":93,"conexao":[103]},{"elemento":"linha-central-vertical","posicao":83,"conexao":[93]},{"elemento":"linha-central-vertical","posicao":73,"conexao":[83]},{"elemento":"linha-central-vertical","posicao":63,"conexao":[73]},{"elemento":"linha-central-vertical","posicao":53,"conexao":[63]},{"elemento":"linha-central-vertical","posicao":43,"conexao":[53]},{"elemento":"linha-central-vertical","posicao":33,"conexao":[43]},{"elemento":"linha-central-vertical","posicao":23,"conexao":[33]},{"elemento":"linha-central-vertical","posicao":13,"conexao":[23]},{"elemento":"linha-central-vertical","posicao":3,"conexao":[13]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":146,"conexao":[]},{"elemento":"not","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":136,"conexao":[146]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":126,"conexao":[136]},{"elemento":"and","posicao":115,"conexao":[125,126]},{"elemento":"linha-recentralizadora-direita","posicao":106,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":96,"conexao":[106]},{"elemento":"linha-central-vertical","posicao":86,"conexao":[96]},{"elemento":"linha-central-vertical","posicao":76,"conexao":[86]},{"elemento":"linha-central-vertical","posicao":66,"conexao":[76]},{"elemento":"linha-central-vertical","posicao":56,"conexao":[66]},{"elemento":"linha-central-vertical","posicao":46,"conexao":[56]},{"elemento":"linha-central-vertical","posicao":36,"conexao":[46]},{"elemento":"linha-central-vertical","posicao":26,"conexao":[36]},{"elemento":"linha-central-vertical","posicao":16,"conexao":[26]},{"elemento":"linha-central-vertical","posicao":6,"conexao":[16]}],"posicaoElementosIniciais":[142,143,145,146],"solucoesPossiveis":[["0","0","0","1","0","0","1","0","0","0"],["0","0","1","0","0","0","1","0","0","0"],["0","0","1","1","0","0","1","0","0","0"]]}'
        ];
    } else if (modoJogo === 'treino') {
    	circuitosFeitos = [
    	'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"linha-central-vertical","posicao":135,"conexao":[145]},{"elemento":"linha-central-vertical","posicao":125,"conexao":[135]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"not","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[145],"solucoesPossiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
		'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"and","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","1","1","0","0","0","0"]]}',
		'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"or","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"],["0","0","0","0","1","1","0","0","0","0"]]}',
		'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"nand","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","1","0","0","0","0","0"],["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0"]]}',
		'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"xor","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","1","0","0","0","0"],["0","0","0","0","1","0","0","0","0","0"]]}',
		'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"nor","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-direita","posicao":125,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":115,"conexao":[125]},{"elemento":"linha-central-vertical","posicao":105,"conexao":[115]},{"elemento":"linha-central-vertical","posicao":95,"conexao":[105]},{"elemento":"linha-central-vertical","posicao":85,"conexao":[95]},{"elemento":"linha-central-vertical","posicao":75,"conexao":[85]},{"elemento":"linha-central-vertical","posicao":65,"conexao":[75]},{"elemento":"linha-central-vertical","posicao":55,"conexao":[65]},{"elemento":"linha-central-vertical","posicao":45,"conexao":[55]},{"elemento":"linha-central-vertical","posicao":35,"conexao":[45]},{"elemento":"linha-central-vertical","posicao":25,"conexao":[35]},{"elemento":"linha-central-vertical","posicao":15,"conexao":[25]},{"elemento":"linha-central-vertical","posicao":5,"conexao":[15]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","0","0","0","0","0"]]}',
		'{"listaElementos":[{"elemento":"linha-central-vertical","posicao":144,"conexao":[]},{"elemento":"linha-central-vertical","posicao":145,"conexao":[]},{"elemento":"xnor","posicao":134,"conexao":[144,145]},{"elemento":"linha-recentralizadora-esquerda","posicao":124,"conexao":[134]},{"elemento":"linha-central-vertical","posicao":114,"conexao":[124]},{"elemento":"linha-central-vertical","posicao":104,"conexao":[114]},{"elemento":"linha-central-vertical","posicao":94,"conexao":[104]},{"elemento":"linha-central-vertical","posicao":84,"conexao":[94]},{"elemento":"linha-central-vertical","posicao":74,"conexao":[84]},{"elemento":"linha-central-vertical","posicao":64,"conexao":[74]},{"elemento":"linha-central-vertical","posicao":54,"conexao":[64]},{"elemento":"linha-central-vertical","posicao":44,"conexao":[54]},{"elemento":"linha-central-vertical","posicao":34,"conexao":[44]},{"elemento":"linha-central-vertical","posicao":24,"conexao":[34]},{"elemento":"linha-central-vertical","posicao":14,"conexao":[24]},{"elemento":"linha-central-vertical","posicao":4,"conexao":[14]}],"posicaoElementosIniciais":[144,145],"solucoesPossiveis":[["0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","1","1","0","0","0","0"]]}'
	];
    } else {

    }

	musicaFundo.play(); musicaFundo.loop = true;

	infoMusica.style.setProperty('display', 'block');
	setTimeout(() => {
		infoMusica.style.setProperty('display', 'none');
	}, 3000);

	leCircuito(JSON.parse(circuitosFeitos[circuitoAtual]));
	fase.innerText = circuitoAtual + 1;
	temporizador();
});

play.addEventListener('click', () => {
	if (play.classList.contains('bi-pause')) {
		play.classList.remove('bi-pause');
		play.classList.add('bi-play');
		musicaFundo.pause();
	} else {
		play.classList.remove('bi-play');
		play.classList.add('bi-pause');
		musicaFundo.play();
	}
});

btnProximo.addEventListener('click', () => {
    if (modoJogo === 'progressivo') {
        if (circuitoAtual < circuitosFeitos.length - 1) {
            circuitoAtual++;
            fase.innerText = circuitoAtual + 1;
        } else {
            if (!fimJogo) {
                lidaTotalPerfeitos(false);
                let valorDesempenho = parseFloat((desempenho.innerText).split('%')[0]);
                console.log(valorDesempenho);
                let textoFinal;

                if (valorDesempenho <= 33.33) {
                    mensagem.style.setProperty('background-color', 'teal');
                    textoFinal = `Voc?? chegou ao fim com certa dificuldade, mas n??o desanime. Seu desempenho foi de ${desempenho.innerText}, com o m??ximo obtido de ${maximoPerfeitos} perfeito(s) seguidos.`;
                    const music = new Audio('efeitos-sonoros/fracasso.wav'); music.play(); music.loop = false;
                } else if (valorDesempenho > 33.33 && valorDesempenho <= 66.66) {
                    mensagem.style.setProperty('background-color', 'teal');
                    textoFinal = `Olha, voc?? n??o foi mal! Continue praticando! Seu desempenho foi de ${desempenho.innerText}, com o m??ximo obtido de ${maximoPerfeitos} perfeitos seguidos.`;
                    const music = new Audio('efeitos-sonoros/fogo-0.wav'); music.play(); music.loop = false;
                } else if (valorDesempenho > 66.66 && valorDesempenho < 99.99) {
                    mensagem.style.setProperty('background-color', 'seagreen');
                    textoFinal = `Impressionante! Seu desempenho foi de ${desempenho.innerText}, com o m??ximo obtido de ${maximoPerfeitos} perfeitos seguidos.`;
                    const music = new Audio('efeitos-sonoros/super-sucesso.wav'); music.play(); music.loop = false;
                } else {
                    mensagem.style.setProperty('background-color', 'darkgreen');
                    mensagem.style.setProperty('box-shadow', '0 0 100px green');
                    textoFinal = `Voc?? ?? mesmo humano? Seu desempenho foi de ${desempenho.innerText}, com o m??ximo obtido de ${maximoPerfeitos} perfeitos seguidos.`;
                    const music = new Audio('efeitos-sonoros/fogo-2.wav'); music.play(); music.loop = false;
                }

                mensagem.innerText = textoFinal;
                mensagem.style.setProperty('display', 'block');
                fimJogo = true;
            }
        }
    } else {
        circuitoAtual = getRandomIntInclusive(0, circuitosFeitos.length - 1);
    }

    if (!fimJogo) {
        vitoria = false;
        derrota = false;
        mensagem.style.setProperty('display', 'none');
        estrelas.style.setProperty('display', 'none');
        btnProximo.style.setProperty('display', 'none');
        limpaEstrelas();
        leCircuito(JSON.parse(circuitosFeitos[circuitoAtual]));
        temporizador(); 
    }

});

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
	let totalEstrelas = 0;

	let percentual = (tempoCorrente / tempoInicial) * 100;

	if (percentual >= 30) {
		totalEstrelas += 1;
	} if (percentual >= 40) {
		totalEstrelas += 1;
	} if (percentual >= 50) {
		totalEstrelas += 1;
	} if (percentual >= 75) {
		totalEstrelas += 1;
	} if (percentual >= 90) {
		totalEstrelas += 1;
	}

	if (dificuldade == 'normal') {
		if (qtdeCliques >= qtdeInicialBateria) {
			totalEstrelas--;
		}
	} else {
		if (qtdeCliques > qtdeInicialBateria) {
			totalEstrelas--;
		}
	}

	if (totalEstrelas === 5) {
		comentarioEstrelas.innerText = 'Perfeito!';
		colocaEstrelas(5);
	} else if (totalEstrelas === 4) {
		colocaEstrelas(4);
		colocaEstrelas(1, true);
		comentarioEstrelas.innerText = 'Bom!';
	} else if (totalEstrelas === 3) {
		colocaEstrelas(3);
		colocaEstrelas(2, true);
		comentarioEstrelas.innerText = 'Razo??vel';
	} else if (totalEstrelas === 2) {
		colocaEstrelas(2);
		colocaEstrelas(3, true);
		comentarioEstrelas.innerText = 'Ruim';
	} else if (totalEstrelas === 1) {
		colocaEstrelas(1);
		colocaEstrelas(4, true);
		comentarioEstrelas.innerText = 'Muito ruim!';
	}

	if (totalEstrelas < 5) {
		lidaTotalPerfeitos();
	}

	if (totalEstrelas >= 3) {
		const music = new Audio(`efeitos-sonoros/completou-${getRandomIntInclusive(0, 0)}.wav`); music.play(); music.loop = false;

	} else {
		const music = new Audio('efeitos-sonoros/gelo.mp3'); music.play(); music.loop = false;
	}

	valorPontuacao += totalEstrelas;
	pontuacao.innerText = valorPontuacao;
	estrelas.style.setProperty('display', 'block');
}

function lidaTotalPerfeitos(reseta = true) {
	if (totalPerfeitos > maximoPerfeitos) {
		maximoPerfeitos = totalPerfeitos;
	}

	if (reseta) {
		totalPerfeitos = 0;
	} else {
		totalPerfeitos++;
	}
}

function atualizaBateria() {
	if (qtdeBateria >= 0 && !vitoria && !derrota) {
		bateria.innerText = --qtdeBateria;
	}
}

function defineBateria(estadoInicial, solucaoPerfeita) {
	// ao notar cada diferen??a entre o estadoInicial e a solucaoPerfeita ?? que se encontra a quantidade de cliques necess??ria para finalizar o circuito em quest??o
	let total = 0;
	for (let i = 0; i < estadoInicial.length; i++) {
		if (estadoInicial[i] !== solucaoPerfeita[i]) {
			total++;
		}
	}

    let bonus;
    if (dificuldade === 'normal') {
        bonus = 1;
    } else if (dificuldade === 'dificil' || dificuldade === 'muito-dificil') {
        bonus = 0;
    }

    if (modoJogo === 'treino') {
    	bonus += 100;
    }

	return total + bonus;
}

// cria os espa??os do circuito
function criaEspacosCircuito() {
	for (let i = 0; i < quantidadeElementos; i++) {
		const espacoElemento = document.createElement('div');
		espacoElemento.setAttribute('title', `${i}`);
		espacoElemento.classList.add('espacoElemento');
		circuito.appendChild(espacoElemento);
	}
}
// coloca os inputs
function criaInputsCircuito() {
	for (let i = 0; i < elementosPorColuna; i++) {
		const div = document.createElement('div');
		div.classList.add('input');
		div.innerText = 0;
		input.appendChild(div); // input ?? a div com flexbox
	}
}

function defineInputsCircuito(estadoInicial = '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]') {
	// tamb??m serve para reset??-los
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function estadosIguais(estadoInicial, solucaoPerfeita) {
    let iguais = true;
    for (let i = 0; i < estadoInicial.length; i++) {
        if (estadoInicial[i] !== solucaoPerfeita[i]) {
            iguais = false;
            break;
        }
    }
    return iguais;
}

function pegaMenorValor(lista) {
	let menor = Number.POSITIVE_INFINITY;

	console.log(lista);

	for (let i = 0; i < lista.length; i++) {
		if (lista[i] < menor) {
			menor = lista[i];
		}
	}

	return menor;
}

function criaEstadoInicial(solucoesPossiveis, posicaoElementosIniciais) {
    let estadoInicial = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

    let fim = false;
    while (!fim) {
        for (let i = 0; i < posicaoElementosIniciais.length; i++) {
            estadoInicial[posicaoElementosIniciais[i] - 140] = getRandomIntInclusive(0, 1).toString();
        }

        let igual = false;
        for (let i = 0; i < solucoesPossiveis.length; i++) {
            if (estadosIguais(estadoInicial, solucoesPossiveis[i])) {
                igual = true;
            }
        }

        if (!igual) {
            fim = true;
        }
    }


    let quantidadesBaterias = [];
    for (let i = 0; i < solucoesPossiveis.length; i++) {
    	quantidadesBaterias.push(defineBateria(estadoInicial, solucoesPossiveis[i]));
    }

    let quantidadeBateria = pegaMenorValor(quantidadesBaterias);

    return [estadoInicial, quantidadeBateria];
}

function limpaCircuito() {
	for (let i = 0; i < espacosElementos.length; i++) {
		espacosElementos[i].style.backgroundImage = "none";
		espacosElementos[i].classList.remove('elementoPresente');
		espacosElementos[i].classList.remove('on');
	}
}

// apenas l?? o array com os objetos do circuito e insere os backgrounds nas devidas posi????es
function leCircuito(circuitoJSON) {
	circuitosPassados++;
	limpaCircuito();
	tempoCorrente = tempoInicial;
	let resultadoCriacaoEstadoInicial = criaEstadoInicial(circuitoJSON.solucoesPossiveis, circuitoJSON.posicaoElementosIniciais);
    let estadoInicial = resultadoCriacaoEstadoInicial[0];
    qtdeBateria = resultadoCriacaoEstadoInicial[1]
    defineInputsCircuito(JSON.stringify(estadoInicial));
	qtdeInicialBateria = qtdeBateria;
	bateria.innerText = qtdeBateria;
	circuitoJSON = circuitoJSON.listaElementos;

	for (let i = 0; i < circuitoJSON.length; i++) {
		let simples = false;
		if (circuitoJSON[i].elemento === 'and') {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-and.png')";
			espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-and.png')";
		} else if (circuitoJSON[i].elemento === 'or') {
			espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-or.png')";
			espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-or.png')";
		} else if (circuitoJSON[i].elemento === 'nand') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-nand.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-nand.png')";
        } else if (circuitoJSON[i].elemento === 'nor') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-nor.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-nor.png')";
        } else if (circuitoJSON[i].elemento === 'xor') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-xor.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-xor.png')";
        } else if (circuitoJSON[i].elemento === 'xnor') {
            espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = "url('elementos/primeiro-xnor.png')";
            espacosElementos[circuitoJSON[i].posicao + 1].style.backgroundImage = "url('elementos/segundo-xnor.png')";
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
			if (dificuldade !== 'muito-dificil') {
                espacosElementos[i + 140].style.backgroundImage = 'url("elementos/linha-central-vertical-on.png")';
            }
		} else if (espacosElementos[i + 140].classList.contains('elementoPresente')) {
			espacosElementos[i + 140].classList.remove('on');
			espacosElementos[i + 140].style.backgroundImage = 'url("elementos/linha-central-vertical.png")';
		}		
	}

	for (let i = 0; i < circuitoJSON.length; i++) {
		let nomeElemento = circuitoJSON[i].elemento.split('-');
		// linhas normais
		if (nomeElemento.includes('linha') || nomeElemento.includes('canto') || nomeElemento.includes('cruz') || nomeElemento.includes('t')) {
			// se tem conex??o 0, ?? porque ?? um dos primeiros elementos
			if (circuitoJSON[i].conexao.length !== 0) {
                if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
                    espacosElementos[circuitoJSON[i].posicao].classList.add('on');
                    if (dificuldade !== 'muito-dificil') {
                        espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(elementos/${circuitoJSON[i].elemento}-on.png)`;
                    }
                } else {
                    espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
                    espacosElementos[circuitoJSON[i].posicao].style.backgroundImage = `url(elementos/${circuitoJSON[i].elemento}.png)`;
                }
			}
		}
		// not: inverte
		if (circuitoJSON[i].elemento === 'not') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			}
		}
		// and: ambas devem ser verdadeiras
		if (circuitoJSON[i].elemento === 'and') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			}
		}
		// or: pelo menos uma deve ser verdadeira
		if (circuitoJSON[i].elemento === 'or') {
			if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') || espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
				espacosElementos[circuitoJSON[i].posicao].classList.add('on');
			} else {
				espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
			}
		}
        // nand: falsa se ambas verdadeiras
        if (circuitoJSON[i].elemento === 'nand') {
            if (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            }
        }
        // nor: nenhuma deve ser verdadeira
        if (circuitoJSON[i].elemento === 'nor') {
            if (!espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && !espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            }
        }
        // xor: s?? uma pode ser verdadeira
        if (circuitoJSON[i].elemento === 'xor') {
            if ((espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && !espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) || (!espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on'))) {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            }
        }
        // xnor: ou ambas falsas ou ambas verdadeiras
        if (circuitoJSON[i].elemento === 'xnor') {
            if ((!espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && !espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on')) || (espacosElementos[circuitoJSON[i].conexao[0]].classList.contains('on') && espacosElementos[circuitoJSON[i].conexao[1]].classList.contains('on'))) {
                espacosElementos[circuitoJSON[i].posicao].classList.add('on');
            } else {
                espacosElementos[circuitoJSON[i].posicao].classList.remove('on');
            }
        }
        // fim
	}
}

function calculaDesempenho() {
	desempenho.innerText = `${ (( valorPontuacao / (circuitosPassados * 5)) * 100).toFixed(2) }%`;
}

function alteraOutput() {
	let verdadeiro = true;
	for (let i = 0; i < 10; i++) {
		if (espacosElementos[i].classList.contains('elementoPresente') || espacosElementos[i].classList.contains('elemento-presente')) {
			if (!espacosElementos[i].classList.contains('on')) {
				verdadeiro = false;
			}
		}
	}

	if (verdadeiro) {
		output.innerText = 'Verdadeiro';
		output.style.backgroundColor = 'seagreen';
		jogo.style.setProperty('box-shadow', '2px 2px 100px seagreen');
		btnProximo.style.setProperty('background-color', 'seagreen');
		vitoria = true;
		clearInterval(intervaloTemporizador);
		exibeBtnProximo();
		exibeEstrelas();
		calculaDesempenho();
		lidaTotalPerfeitos(false);
		switch(totalPerfeitos) {
			case 3:
				exibeToast('Impressionante. 3 perfeitos seguidos!', 3);
				break;
			case 5:
				exibeToast('Uau! 5 perfeitos seguidos!', 5);
				break;
			case 10:
				exibeToast('Incr??vel! 10 perfeitos seguidos!', 10);
				break;
			case 15:
				exibeToast('Fabuloso! 15 perfeitos seguidos!', 15);
				break;
			case 25:
				exibeToast('Estou sem palavras. 25 perfeitos seguidos!', 25);
				break;
			case 50:
				exibeToast('Voc?? ?? mesmo humano? 50 perfeitos seguidos!', 50);
		}
	} else {
		output.innerText = 'Falso';
		output.style.backgroundColor = 'tomato';
		jogo.style.setProperty('box-shadow', '2px 2px 100px tomato');
		btnProximo.style.setProperty('background-color', 'tomato');
	}
}

// event listeners nos inputs, bem como ativa????o do elemento imediatamente superior a cada um
const inputs = document.querySelectorAll('.input');
for (let i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', () => {
		if (qtdeBateria > 0 && !vitoria && !derrota) {
			if (inputs[i].innerText === '0') {
				const music = new Audio('efeitos-sonoros/1.wav'); music.play(); music.loop =false;
				inputs[i].innerText = '1';
				inputs[i].style.setProperty('color', 'seagreen');
			} else if (inputs[i].innerText === '1') {
				const music = new Audio('efeitos-sonoros/0.wav'); music.play(); music.loop =false;
				inputs[i].style.setProperty('color', 'tomato');
				inputs[i].innerText = '0';
			}
			atualizaBateria();
			propaga(JSON.parse(circuitosFeitos[circuitoAtual]).listaElementos);
			alteraOutput();
		} else if (qtdeBateria === 0 && !derrota && !vitoria) {
			exibeBtnProximo()
			const music = new Audio('efeitos-sonoros/bateria.mp3'); music.play(); music.loop = false;
			mensagem.innerText = 'A sua bateria acabou :(';
			mensagem.style.setProperty('display', 'block');
			clearInterval(intervaloTemporizador);
			derrota = true;
			lidaTotalPerfeitos();
			calculaDesempenho();
		}
	});
}

function exibeToast(mensagem, valor) {
	const toast = document.getElementById('toast');
	toast.style.setProperty('display', 'block');
	toast.innerText = mensagem;

	let imagem = 'fogo.png';;

	if (valor <= 5) {
		const music = new Audio('efeitos-sonoros/fogo-0.wav'); music.play(); music.loop = false;
	} else if (valor > 5 && valor <= 10) {
		const music = new Audio('efeitos-sonoros/fogo-1.wav'); music.play(); music.loop = false;
	} else {
		const music = new Audio('efeitos-sonoros/fogo-2.wav'); music.play(); music.loop = false;
	}

	for (let i = 0; i < valor; i++) {
		let img = document.createElement('img');
		img.setAttribute('src', imagem);
		toast.append(img);
	}

	setTimeout(() => {
		toast.style.setProperty('display', 'none');
	}, 5000);
}

opcaoAjuda.addEventListener('click', () => {
    modalAjuda.style.setProperty('display', 'flex');
    clearInterval(intervaloTemporizador);
});

btnEntendi.addEventListener('click', () => {
    modalAjuda.style.setProperty('display', 'none');
    temporizador();
})
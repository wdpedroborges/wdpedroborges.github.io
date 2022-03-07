const afazeresSalvos = JSON.parse(localStorage.getItem('afazeresSalvos'));
const inicioAfazeres = JSON.parse(localStorage.getItem('inicioAfazeres'));
const infoEstrelas = JSON.parse(localStorage.getItem('infoEstrelas'));

let contador = 0;

if (infoEstrelas) {
	document.getElementById('quantidadeEstrelas').innerText = infoEstrelas.quantidade;
}

const data = new Date();
const hoje = `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;
let totalDiasTranscorridos;

if (inicioAfazeres) {
	totalDiasTranscorridos = passagemTempo(inicioAfazeres.data, hoje).length;

	if (totalDiasTranscorridos == 1) {
		document.querySelector('.msg').innerText = `Você começou no dia ${inicioAfazeres.data} e já se passou ${totalDiasTranscorridos} dia, contando com o dia em que você começou.`;
	} else {
		document.querySelector('.msg').innerText = `Você começou no dia ${inicioAfazeres.data} e já se passaram ${totalDiasTranscorridos} dias, contando com o dia em que você começou.`;
	}

}

let afazeres = [];
let quantidades = [];

if (afazeresSalvos) {
	for (let i = 0; i < afazeresSalvos.length; i++) {
		afazeres.push(afazeresSalvos[i].titulo);
		quantidades.push(afazeresSalvos[i].quantidade);
	}
}

const form = document.querySelector('form');
const inputAfazer = document.querySelector("input[name='afazer']");
const btnResetar = document.querySelector('#btnResetar');
const btnSalvar = document.querySelector('#btnSalvar');

let novosAfazeres = [];
let novoInfoEstrelas;

// modal
const bgModal = document.querySelector('.bg-modal');
const modal = document.querySelector('.modal');

bgModal.addEventListener('click', e => {
	if (e.target === bgModal && e.target !== modal) {
		bgModal.style.display = 'none';
		window.location.href = 'index.html';
	}
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	novosAfazeres.push({
		titulo: inputAfazer.value,
		quantidade: 0,
		feito: false,
		dataFeitura: null
	});
	novoInfoEstrelas = {
		quantidade: 0,
		dataUltimaEstrela: null
	};

	let li = document.createElement('li');
	li.innerText = inputAfazer.value;
	document.getElementById('afazeresAdicionados').appendChild(li);
	inputAfazer.value = '';
});

btnResetar.addEventListener('click', (e) => {
	localStorage.setItem('afazeresSalvos', null);
	localStorage.setItem('inicioAfazeres', null);
	window.location.href = 'index.html';
});

btnLimpar.addEventListener('click', (e) => {
	document.getElementById('afazeresAdicionados').innerHTML = '';
	novosAfazeres = [];
});

btnSalvar.addEventListener('click', (e) => {
	localStorage.setItem('afazeresSalvos', JSON.stringify(novosAfazeres));
	localStorage.setItem('inicioAfazeres', JSON.stringify({ data: hoje }));
	localStorage.setItem('infoEstrelas', JSON.stringify(novoInfoEstrelas));
	window.location.href = 'index.html';
});

// insere os afazeres obtidos do localStorage na página
function insereAfazeres() {
	// limpa a lista de afazeres, antes de inserir novamente; caso contrário, eles se acumulam
	document.getElementById('afazeres').innerHTML = '';
	if (afazeresSalvos) {
		afazeresSalvos.forEach(afazerSalvo => {
			let li = document.createElement('li');
			let icon = document.createElement('i');
			li.innerText = afazerSalvo.titulo;
			li.classList.add('afazer-listado');
			icon.classList.add('bi'); // classe para bootstrap icons
			if (afazerSalvo.feito && afazerSalvo.dataFeitura === hoje) {
				contador++;
				li.classList.add('feito');
				icon.classList.add('bi-check2-circle');
			} else {
				li.classList.add('nao-feito');
				icon.classList.remove('bi-check2-circle');
				afazerSalvo.feito = false;
				afazerSalvo.dataFeitura = null;
			}

			document.getElementById('afazeres').appendChild(li).prepend(icon);
		});
	}
}

insereAfazeres();

let afazeresListados = [... document.getElementsByClassName('afazer-listado')];

// adiciona os event listeners de clique nos afazeres, para que suas cores mudem
afazeresListados.forEach(afazer => {
	afazer.addEventListener('click', function(){
		if (afazer.classList.contains('feito')) {
			afazer.classList.remove('feito');
			afazer.classList.add('nao-feito');
			afazer.querySelector('i').classList.toggle('bi-check2-circle');

			for (let i = 0; i < afazeresSalvos.length; i++) {
				if (afazer.innerText == afazeresSalvos[i].titulo) {
					afazeresSalvos[i].quantidade--;
					afazeresSalvos[i].feito = false;
					afazeresSalvos[i].dataFeitura = null;
					if (contador > 0) {
						contador--;
					}
				}
			}
		} else {
			afazer.classList.remove('nao-feito');
			afazer.classList.add('feito');
			afazer.querySelector('i').classList.toggle('bi-check2-circle');

			for (let i = 0; i < afazeresSalvos.length; i++) {
				if (afazer.innerText == afazeresSalvos[i].titulo) {
					afazeresSalvos[i].quantidade++;
					afazeresSalvos[i].feito = true;
					afazeresSalvos[i].dataFeitura = hoje;
					contador++;
				}
			}
		}
		localStorage.setItem('afazeresSalvos', JSON.stringify(afazeresSalvos));

		if (contador === afazeres.length) {
			if (infoEstrelas.dataUltimaEstrela !== hoje) {
				bgModal.style.display = 'block';
				infoEstrelas.quantidade++;
				infoEstrelas.dataUltimaEstrela = hoje;
				localStorage.setItem('infoEstrelas', JSON.stringify(infoEstrelas));
				document.getElementById('quantidadeEstrelas').innerText = infoEstrelas.quantidade;
			}
		}
	})
});

document.getElementById('li_afazeres').addEventListener('click', (e) => {
	document.getElementById('div_afazeres').style.display = 'flex';
	document.getElementById('div_novos_afazeres').style.display = 'none';
})

document.getElementById('li_novos_afazeres').addEventListener('click', (e) => {
	document.getElementById('div_novos_afazeres').style.display = 'flex';
	document.getElementById('div_afazeres').style.display = 'none';
})

// calcula os percentuais
// let quantidadesPercentuais = [];
// for (let i = 0; i < quantidades.length; i++) {
// 	quantidadesPercentuais.push(parseFloat(((quantidades[i] / totalDiasTranscorridos) * 100).toFixed(2)));
// }

// Gráfico de barras
const primeiroCtx = document.getElementById('primeiroGrafico').getContext('2d');
const primeiroGrafico = new Chart(primeiroCtx, {
    type: 'polarArea',
    data: {
        labels: afazeres,
        datasets: [{
            label: 'Afazer',
            data: quantidades,
            backgroundColor: geraCores(afazeres.length),
            borderColor: '#000',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },

        plugins: {
        	title: {
        		display: true,
        		text: 'Cumprimento de cada tarefa ao longo dos dias'
        	}
        }
    }
});

// Gráfico de pizza
// const segundoCtx = document.getElementById('segundoGrafico').getContext('2d');
// const segundoGrafico = new Chart(segundoCtx, {
//     type: 'pie',
//     data: {
//         labels: ['Sim', 'Não'],
//         datasets: [{
//             label: 'Percentual de cumprimento',
//             data: muitosAleatoriosInteiros(2, 0, 20),
//             backgroundColor: geraCores(2),
//             borderColor: '#000',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         },

//         plugins: {
//         	title: {
//         		display: true,
//         		text: 'Percentuais de cumprimento'
//         	}
//         }
//     }
// });

function aleatorioInteiro(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function muitosAleatoriosInteiros(quantidade, min, max) {
	let aleatorios = [];
	for (let i = 0; i < quantidade; i++) {
		aleatorios.push(aleatorioInteiro(min, max));
	}

	return aleatorios;
} 

function geraCores(quantidade) {
	let cores = [];
	let valores = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	for (let i = 0; i < quantidade; i++) {
		cores.push(`#${valores[aleatorioInteiro(0, 16)]}${valores[aleatorioInteiro(0, 16)]}${valores[aleatorioInteiro(0, 16)]}${valores[aleatorioInteiro(0, 16)]}${valores[aleatorioInteiro(0, 16)]}${valores[aleatorioInteiro(0, 16)]}`);
	}

	return cores;
}

function passagemTempo(data_inicio, data_fim) {
	// esta função simula a passagem do tempo, informando todas as datas desde uma data inicial até uma data final
	let datas = [];
	// é preciso fazer isto com a data final, 
	data_fim = dataInt(data_fim);
	data_inicio = dataInt(data_inicio);
	datas.push(data_inicio); // já começa com a data de início, claro
	// a data atual precisa ser dividida de acordo com a '/' e depois é preciso transformar cada valor em inteiro, para fazer cálculos
	let data_atual = listaInt(data_inicio.split('/'));

	// faça, enquanto a data atual (data atual do loop) for diferente da data final, que é exatamente o que se quer aqui
	if (data_inicio !== data_fim) {
		do {
			// se o dia for menor do que o número de dias do mês, considerando se o ano é bissexto ou não (para o mês de fevereiro), então acrescente ao dia
			if (data_atual[0] < numeroDiasMes(data_atual[1], anoBissexto(data_atual[2]))) {
				data_atual[0]++;
			} else if (data_atual[1] < 12) {
				// se já for igual ao número de dias do mês, é preciso aumentar o mês então e voltar os dias para 1
				data_atual[1]++;
				data_atual[0] = 1;
			} else {
				// se o número de meses já for igual a 12, então volta os meses para 1 e também os dias para 1, mas não sem antes aumentar o ano
				data_atual[2]++;
				data_atual[1] = 1;
				data_atual[0] = 1;
			}
			// por fim, acrescenta-se a data ao array de datas, que será retornado ao final
			datas.push(data_atual.join('/'));
		} while(data_atual.join('/') != data_fim);
	}

	return datas;
}

function normalizaData(data) {
	data = data.split('-');
	let data_normal = ['dd', 'mm', 'aaaa'];
	data_normal[0] = parseInt(data[2]);
	data_normal[1] = parseInt(data[1]);
	data_normal[2] = parseInt(data[0]);

	return dataInt(data_normal.join('/'));
}

function dataInt(data) {
	// para que datas como 11/09/1998 fiquem como 11/9/1998, isto é, sem o 0 antes dos números; de outra forma, fica ruim de comparar no while() do loop
	return listaInt(data.split('/')).join('/');
}

function listaInt(lista) {
	// transforma todos os elementos de uma lista em inteiros
	for (let i = 0; i < lista.length; i++) {
		lista[i] = parseInt(lista[i]);
	}

	return lista;
}

function numeroDiasMes(mes, bissexto = false) {
	// informa a quantidade de dias de determinado mês, considerando se o ano é bissexto ou não, para aumentar 1 dia em fevereiro
	switch (mes) {
		case 1:
			return 31;
		case 2:
			if (bissexto) {
				return 29;
			} else {
				return 28;
			}
		case 3:
			return 31;
		case 4:
			return 30;
		case 5:
			return 31;
		case 6:
			return 30;
		case 7:
			return 31;
		case 8:
			return 31;
		case 9:
			return 30;
		case 10:
			return 31;
		case 11:
			return 30;
		case 12:
			return 31;
		default:
			return 0;
	}
}

function anoBissexto(ano) {
	// verifica se determinado ano é bissexto; anos bissextos são divisíveis por 4 e não por 100; mas, se um ano for divisível por 4 e por 100 ao mesmo tempo, ele também deve ser divisível por 400
	if (ano % 4 === 0 && ano % 100 !== 0) {
		return true;
	} else if (ano % 4 === 0 && ano % 100 === 0 && ano % 400 === 0) {
		return true;
	} else {
		return false;
	}
}

// UNIVERSO
const universo = document.getElementById('universo')
const ctxUniverso = universo.getContext('2d');

const CIRCLE_SIZE = 5;

function generateCircles(amount) {
	let circles = [];
	for (let i = 0; i < amount; i++) {
		circles.push({ 
			x: aleatorioInteiro(50, universo.width - 50), 
			y: aleatorioInteiro(50, universo.height - 50),
			dx: aleatorioInteiro(1, 7),
			dy: aleatorioInteiro(1, 5),
			color: geraCores(1)[0]
		});
	}
	return circles;
}

let circles;

if (infoEstrelas) {
	 circles = generateCircles(infoEstrelas.quantidade);
} else {
	circles = generateCircles(0);
}

function drawCircles(circles) {
	circles.forEach(circle => {
		ctxUniverso.beginPath();
		ctxUniverso.arc(circle.x, circle.y, CIRCLE_SIZE, 0, Math.PI * 2);
		ctxUniverso.fillStyle = circle.color;
		ctxUniverso.fill();
	});
}

function changePositions(circles) {
	circles.forEach(circle => {
		circle.x += circle.dx;
		circle.y += circle.dy;
	});
}

function detectSideWalls(circles) {
	circles.forEach(circle => {
		// detect side walls
		if(circle.x + CIRCLE_SIZE >= universo.width || circle.x - CIRCLE_SIZE <= 0) {
			circle.dx *= -1;
		}
		// detect top and bottom walls
		if(circle.y + CIRCLE_SIZE >= universo.height || circle.y - CIRCLE_SIZE <= 0) {
			circle.dy *= -1;
		}
	});	
}

function update() {
	ctxUniverso.clearRect(0, 0, universo.width, universo.height);

	drawCircles(circles);
	changePositions(circles);
	detectSideWalls(circles);

	requestAnimationFrame(() => {
		update();
	});
}

update();
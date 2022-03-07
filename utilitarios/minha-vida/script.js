const configuracao = JSON.parse(localStorage.getItem('configuracao'));

// canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
const info = document.querySelector('.info');
const form = document.querySelector('form');

// botões repetitivos
const btn_cadastrar_intervalo = document.querySelector('#btn_cadastrar_intervalo');
const btn_cadastrar_data_comemorativa = document.querySelector('#btn_cadastrar_data_comemorativa');
const btn_cadastrar_data_especifica = document.querySelector('#btn_cadastrar_data_especifica');
const btn_cadastrar_comentario_idade = document.querySelector('#btn_cadastrar_comentario_idade');

// botões de salvar e resetar
const btn_salvar = document.querySelector('#btn_salvar');
const btn_resetar = document.querySelector('#btn_resetar');

// valores arbitrários
let dimensao_elemento = 5;
let passo = dimensao_elemento * 2;

let intervalos = [];
let datas_comemorativas = [];
let datas_especificas = [];
let comentarios_idade = [];

btn_cadastrar_intervalo.addEventListener('click', (e) => {
	let titulo_intervalo = document.getElementById('titulo_intervalo');
	let cor_intervalo = document.getElementById('cor_intervalo');
	let data_inicio_intervalo = document.getElementById('data_inicio_intervalo');
	let data_fim_intervalo = document.getElementById('data_fim_intervalo');
	
	intervalos.push({
		primeira_data: data_inicio_intervalo.value !== '' ? normalizaData(data_inicio_intervalo.value) : '1/1/2000',
		segunda_data: data_fim_intervalo.value !== '' ? normalizaData(data_fim_intervalo.value) : '1/1/2005',
		cor: cor_intervalo.value,
		titulo: titulo_intervalo.value || 'Intervalo sem título'	
	});

	titulo_intervalo.value = '';
	cor_intervalo.value = '';
	data_inicio_intervalo.value = '';
	data_fim_intervalo.value = '';

	alert('Intervalo adicionado com sucesso. Adicione mais um, se quiser.');
});

btn_cadastrar_data_comemorativa.addEventListener('click', (e) => {
	let titulo_data_comemorativa = document.getElementById('titulo_data_comemorativa');
	let data_comemorativa = document.getElementById('data_comemorativa');

	datas_comemorativas.push({
		data: data_comemorativa.value !== '' ? normalizaData(data_comemorativa.value) : '25/12',
		cor: 'blue',
		titulo: titulo_data_comemorativa.value || 'Natal'		
	});

	alert('Data comemorativa adicionada com sucesso. Adicione mais uma, se quiser.');

	titulo_data_comemorativa.value = '';
	data_comemorativa.value = '';
});

btn_cadastrar_data_especifica.addEventListener('click', (e) => {
	let titulo_data_especifica = document.getElementById('titulo_data_especifica');
	let data_especifica = document.getElementById('data_especifica');

	datas_especificas.push({
		data: data_especifica.value !== '' ? normalizaData(data_especifica.value) : '5/5/2005',
		cor: 'orange',
		titulo: titulo_data_especifica.value || 'Dia 05, do mês 05 de 2005!'		
	});

	alert('Data especifica adicionada com sucesso. Adicione mais uma, se quiser.');

	titulo_data_especifica.value = '';
	data_especifica.value = '';
});

btn_cadastrar_comentario_idade.addEventListener('click', (e) => {
	let comentario_idade = document.getElementById('comentario_idade');
	let idade = document.getElementById('idade');

	comentarios_idade.push({
		idade: parseInt(idade.value) || 18,
		comentario: comentario_idade.value || 'Já pode ser preso!',
		cor: 'brown'
	});

	alert('Comentário adicionado com sucesso. Adicione mais um, se quiser.');

	comentario_idade.value = ''
	idade.value = ''
});

let datas, quantidade, data, hoje, qtde_linhas, qtde_por_linha;
form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (document.getElementById('data_nascimento').value !== '' && document.getElementById('data_morte').value !== '') {
		const data_nascimento = normalizaData(document.getElementById('data_nascimento').value);
		const data_morte = normalizaData(document.getElementById('data_morte').value);

		datas = passagemTempo(data_nascimento, data_morte);
		quantidade = datas.length;
		data = new Date();
		hoje = `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;

		intervalos.unshift({
			primeira_data: datas[0],
			segunda_data: hoje,
			cor: 'lightgreen',
			titulo: 'Dias vividos'	
		});

		// inserindo largura e altura no canvas
		canvas.width = window.innerWidth - 100;
		qtde_por_linha = (canvas.width) / (dimensao_elemento + passo);
		qtde_linhas = quantidade / qtde_por_linha;
	} else {
		alert('Informe as datas.');
	}

	if (quantidade > 0) {
		canvas.height = qtde_linhas * (dimensao_elemento + (passo / 6));
		canvas.style.display = 'block';
		btn_salvar.style.display = 'block';
		btn_resetar.style.display = 'block';
		form.style.display = 'none';
		// primeiro cria todos os quadrados cinzas sem significado
		criaQuadradosSubsequentes(quantidade);

		if (intervalos.length > 0) {
			insereIntervalos(intervalos);
		}
		insereAniversarios({data: dataInt(datas[0]), cor: 'brown'});
		if (comentarios_idade.length > 0) {
			insereComentariosIdade(comentarios_idade);
		}
		if (datas_especificas.length > 0) {
			insereElementosUnicos(datas_especificas);
		}
		if (datas_comemorativas.length > 0) {
			insereDatasComemorativas(datas_comemorativas);
		}
	}

	// insere background no canvas
	// coloca atrás dos elementos
	ctx.globalCompositeOperation = 'destination-over'
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
})

// esta função retorna a posição real do mouse no canvas
function getMousePos(canvas, event) {
	// retorna o tamanho de um elemento e sua posição relativa ao viewport
    let rect = canvas.getBoundingClientRect();
    return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
    };
}

// este array armazena a posição de cada elemento no canvas, para que seja possível rastrear cada um deles depois
let elementos_criados = [];

function normalizaData(data) {
	data = data.split('-');
	let data_normal = ['dd', 'mm', 'aaaa'];
	data_normal[0] = parseInt(data[2]);
	data_normal[1] = parseInt(data[1]);
	data_normal[2] = parseInt(data[0]);

	return dataInt(data_normal.join('/'));
}

function comparaDatas(primeira_data, segunda_data) {
	// verifica se a primeira data é anterior à segunda data; se for, retorna 1; se for maior, retorna -1; se forem iguais, retorna 0.
	primeira_data = listaInt(primeira_data.split('/'));
	segunda_data = listaInt(segunda_data.split('/'));

	if (primeira_data[2] < segunda_data[2]) {
		return 1;
	} else if (primeira_data[2] > segunda_data[2]) {
		return -1;
	} else {
		if (primeira_data[1] < segunda_data[1]) {
			return 1;
		} else if (primeira_data[1] > segunda_data[1]) {
			return -1;
		} else {
			if (primeira_data[0] < segunda_data[0]) {
				return 1;
			} else if (primeira_data[0] > segunda_data[0]) {
				return -1;
			} else {
				return 0;
			}			
		}		
	}
}

function verificaDataComemorativa(data, data_comemorativa) {
	data = listaInt(data.split('/'));
	data_comemorativa = listaInt(data_comemorativa.split('/'));

	if (data[0] === data_comemorativa[0] && data[1] === data_comemorativa[1]) {
		return true;
	} else {
		return false;
	}
}

function criaQuadradosSubsequentes(quantidade, intervalo = null, elemento_unico = null, data_comemorativa = null, aniversario = null, comentario_idade = null) {
	// o primeiro elemento é inserido na posição (0, 0) do canvas
	let posicao_x = 0;
	let posicao_y = 0;
	let idade = 0;
	
	for (let i = 0; i < quantidade; i++) {
		if (!intervalo && !elemento_unico && !data_comemorativa && !aniversario && !comentario_idade) {
			ctx.fillStyle = '#bbb';
			ctx.fillRect(posicao_x, posicao_y, dimensao_elemento, dimensao_elemento);
			elementos_criados.push({x: posicao_x, y: posicao_y, info: `${datas[i]}: Dias ainda não vividos`, cor: '#bbb'});	
		}

		if (aniversario) {
			if (verificaDataComemorativa(datas[i], aniversario.data)) {
				ctx.fillStyle = aniversario.cor;
				ctx.fillRect(posicao_x, posicao_y, dimensao_elemento, dimensao_elemento);
				if (idade == 0) {
					elementos_criados.push({x: posicao_x, y: posicao_y, info: `Seu nascimento! ${datas[i]}`, cor: aniversario.cor});
				} else if (idade == 1) {
					elementos_criados.push({x: posicao_x, y: posicao_y, info: `Seu aniversário de ${idade} ano. ${datas[i]}`, cor: aniversario.cor});
				} else {
					elementos_criados.push({x: posicao_x, y: posicao_y, info: `${datas[i]}: Seu aniversário de ${idade} anos.`, cor: aniversario.cor});
				}
			}
		}

		if (comentario_idade) {
			if (verificaDataComemorativa(datas[i], datas[0]) && comentario_idade.idade === idade) {
				ctx.fillStyle = comentario_idade.cor;
				ctx.fillRect(posicao_x, posicao_y, dimensao_elemento, dimensao_elemento);
				elementos_criados.push({x: posicao_x, y: posicao_y, info: `${datas[i]}: Seu aniversário de ${idade} anos. ${comentario_idade.comentario}`, cor: comentario_idade.cor});
			}
		}

		if (intervalo) {
			if (comparaDatas(datas[i], intervalo.primeira_data) === -1 || comparaDatas(datas[i], intervalo.primeira_data) === 0) {
				if (comparaDatas(datas[i], intervalo.segunda_data) === 1 || comparaDatas(datas[i], intervalo.segunda_data) === 0) {
					ctx.fillStyle = intervalo.cor;
					ctx.fillRect(posicao_x, posicao_y, dimensao_elemento, dimensao_elemento);
					elementos_criados.push({x: posicao_x, y: posicao_y, info: `${datas[i]}: ${intervalo.titulo}`, cor: intervalo.cor});					
				}

			}
		}

		if (elemento_unico) {
			if (comparaDatas(datas[i], elemento_unico.data) === 0) {
				ctx.fillStyle = elemento_unico.cor;
				ctx.fillRect(posicao_x, posicao_y, dimensao_elemento, dimensao_elemento);
				elementos_criados.push({x: posicao_x, y: posicao_y, info: `${datas[i]}: ${elemento_unico.titulo}`, cor: elemento_unico.cor});
			}
		}

		if (data_comemorativa) {
			if (verificaDataComemorativa(datas[i], data_comemorativa.data)) {
				ctx.fillStyle = data_comemorativa.cor;
				ctx.fillRect(posicao_x, posicao_y, dimensao_elemento, dimensao_elemento);
				elementos_criados.push({x: posicao_x, y: posicao_y, info: `${datas[i]}: ${data_comemorativa.titulo}`, cor: data_comemorativa.cor});				
			}
		}

		if (verificaDataComemorativa(datas[i], datas[0])) {
			idade++;
		}

		// se a posição x do elemento for maior ou igual à largura do canvas, isso significa que uma linha já foi formada e devemos descer para a próxima, ou seja, incrementar a posição y com o passo; se não, então apenas incrementamos o passo à posição x
		if (posicao_x >= (canvas.width - dimensao_elemento*3)) {
			posicao_y += passo;
			posicao_x = 0;
		} else {
			posicao_x += passo;
		}
	}
}

function insereIntervalos(intervalos) {
	for (let i = 0; i < intervalos.length; i++) {
		criaQuadradosSubsequentes(quantidade, intervalos[i]);
	}
}

function insereElementosUnicos(elementos_unicos) {
	for (let i = 0; i < elementos_unicos.length; i++) {
		criaQuadradosSubsequentes(quantidade, null, elementos_unicos[i]);
	}	
}

function insereDatasComemorativas(datas_comemorativas) {
	for (let i = 0; i < datas_comemorativas.length; i++) {
		criaQuadradosSubsequentes(quantidade, null, null, datas_comemorativas[i]);
	}	
}

function insereComentariosIdade(comentarios_idade) {
	for (let i = 0; i < comentarios_idade.length; i++) {
		criaQuadradosSubsequentes(quantidade, null, null, null, null, comentarios_idade[i]);
	}	
}

function insereAniversarios(aniversario) {
	criaQuadradosSubsequentes(quantidade, null, null, null, aniversario, null);
}

function proximo(a, b, parametro_proximidade = dimensao_elemento) {
	// verifica se um número é próximo ou não, dado um determinado parâmetro de proximidade; neste caso, foi aplicada a dimensão dos elementos
	let x = 0; let y = 0;

	if (a > b) {
		x = a;
		y = b;
	} else if (b > a) {
		x = b;
		y = a;
	} else {
		x = a;
		x = b;
	}

	return x - y < parametro_proximidade ? true : false;
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

function listaInt(lista) {
	// transforma todos os elementos de uma lista em inteiros
	for (let i = 0; i < lista.length; i++) {
		lista[i] = parseInt(lista[i]);
	}

	return lista;
}

function dataInt(data) {
	// para que datas como 11/09/1998 fiquem como 11/9/1998, isto é, sem o 0 antes dos números; de outra forma, fica ruim de comparar no while() do loop
	return listaInt(data.split('/')).join('/');
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

	return datas;
}

canvas.addEventListener('mousemove', function(e){
	let mousePos = getMousePos(canvas, e);

	for (let i = 0; i < elementos_criados.length; i++) {
		if (proximo(elementos_criados[i].x, mousePos.x) && proximo(elementos_criados[i].y, mousePos.y)) {
			info.innerText = elementos_criados[i].info;
			info.style.background = elementos_criados[i].cor;

			if (mousePos.y < (0.1 * canvas.height)) {
				info.style.top = '90%';
			} else {
				info.style.top = '1%';
			}

			if (elementos_criados[i].info !== '') {
				info.style.display = 'block';
			} else{
				info.style.display = 'none';
			}
		} 
	}
});

document.addEventListener('mousemove', function(e){
	if (e.target !== canvas && e.target !== info) {
		info.style.display = 'none';
	}
});

btn_salvar.addEventListener('click', () => {
	let configuracao = {
		data_inicial: normalizaData(document.getElementById('data_nascimento').value),
		data_final: normalizaData(document.getElementById('data_morte').value),
		intervalos,
		datas_comemorativas,
		datas_especificas,
		comentarios_idade
	};

	localStorage.setItem('configuracao', JSON.stringify(configuracao));

	alert('Salvo com sucesso.');
});

btn_resetar.addEventListener('click', () => {
	localStorage.setItem('configuracao', null);

	alert('Resetado com sucesso.');
});

if (configuracao) {
		datas = passagemTempo(configuracao.data_inicial, configuracao.data_final);
		quantidade = datas.length;
		// inserindo largura e altura no canvas
		canvas.width = window.innerWidth - 100;
		qtde_por_linha = (canvas.width) / (dimensao_elemento + passo);
		qtde_linhas = quantidade / qtde_por_linha;
		canvas.height = qtde_linhas * (dimensao_elemento + (passo / 6));

		// exibições de elementos
		canvas.style.display = 'block';
		btn_salvar.style.display = 'block';
		btn_resetar.style.display = 'block';
		form.style.display = 'none';

		// primeiro cria todos os quadrados cinzas sem significado
		criaQuadradosSubsequentes(quantidade);

		if (configuracao.intervalos.length > 0) {
			insereIntervalos(configuracao.intervalos);
		}
		insereAniversarios({data: dataInt(datas[0]), cor: 'brown'});
		if (configuracao.comentarios_idade.length > 0) {
			insereComentariosIdade(configuracao.comentarios_idade);
		}
		if (configuracao.datas_especificas.length > 0) {
			insereElementosUnicos(configuracao.datas_especificas);
		}
		if (configuracao.datas_comemorativas.length > 0) {
			insereDatasComemorativas(configuracao.datas_comemorativas);
		}

		// insere background no canvas
		// coloca atrás dos elementos
		ctx.globalCompositeOperation = 'destination-over'
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
}
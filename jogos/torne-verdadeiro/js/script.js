let qtde_linhas=0;
let qtde_colunas=0;
let qtde_elementos=0;
let quadro=[];

function criaCircuito(circuito){
	$('#quadro').empty();
	$('#container_inputs').empty();

	circuito=JSON.parse(circuito);
	qtde_linhas=circuito['dimensao'][0];
	qtde_colunas=circuito['dimensao'][1];
	qtde_elementos=qtde_linhas*qtde_colunas;

	// CRIA quadro E ENCHE DE ZEROS
	for (let i=0; i<qtde_linhas; i++) {
		let linha=[];
		for (let j=0; j<qtde_colunas; j++) {
			linha.push(0);
		}
		quadro.push(linha);
	}
	// FAZ COM QUE TODOS FIQUEM LOCALIZÁVEIS DENTRO DE UMA quadro
	let k=0;
	for (let i=qtde_linhas-1; i>=0; i--) {
		for (let j=0; j<qtde_colunas; j++) {
			let elemento=$("<div class='dimensao_filho'></div>");
			$('#quadro').append(elemento);
			quadro[i][j] = $('#quadro').children().eq(k);
			k++;
		}
	}

	// CRIA OS INPUTS DE ACORDO COM A QUANTIDADE DE COLUNAS
	for(let i=0; i<qtde_colunas; i++){
		let input=$(`<div class="input" id="input_${i}">0</div>`);
		$('#container_inputs').append(input);
	}

	// DIMENSIONA TODOS OS ELEMENTOS, PARA FICAREM DE ACORDO
	let valor_pixels=50; 
	let dimensao_pai=qtde_colunas*valor_pixels;
	let dimensao_filho=dimensao_pai/qtde_colunas;
	$('.config_base').css('grid-template-columns', `repeat(${qtde_colunas}, 1fr)`)
	$('.dimensao_pai').css('width', `${dimensao_pai}px`);
	$('.dimensao_filho').css('height', `${dimensao_filho}px`);

	for(let i=0; i<circuito['info'].length; i++){
		let coords=(circuito['info'][i]['coordenada']).split(',');
		let l=parseInt(coords[0]);
		let c=parseInt(coords[1]);
		if(circuito['info'][i]['simples']=='true'){
			$(quadro[l][c]).attr('tipo', `${circuito['info'][i]['tipo']}`).attr('simples', 'true').attr('conexao', `${circuito['info'][i]['conexao']}`);
		}else{
			$(quadro[l][c]).attr('tipo', `${circuito['info'][i]['tipo']}`).attr('simples', 'false').attr('primeira_conexao', `${circuito['info'][i]['primeira_conexao']}`).attr('segunda_conexao', `${circuito['info'][i]['segunda_conexao']}`);
		}
	}

	$('.input').click(function(){
		if($(this).text()=='1'){
			$(this).text('0');
		}else if ($(this).text()=='0'){
			$(this).text('1');
		}
		verifica_inputs();
	});

	verifica_quadro();
	verifica_fim();
	verifica_inputs();
	insere_imagens();
}

// x='{"dimensao":[3,2],"info":[{"coordenada":"2,0","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"1,0","tipo":"and","simples":"false","primeira_conexao":"0,0","segunda_conexao":"0,1"},{"coordenada":"0,0","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"conexao","simples":"true","conexao":"inicial"}]}';

// y='{"dimensao":[3,2],"info":[{"coordenada":"2,0","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"1,0","tipo":"or","simples":"false","primeira_conexao":"0,0","segunda_conexao":"0,1"},{"coordenada":"0,0","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"conexao","simples":"true","conexao":"inicial"}]}';

// w='{"dimensao":[3,4],"info":[{"coordenada":"2,0","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,2","tipo":"conexao","simples":"true","conexao":"1,2"},{"coordenada":"2,3","tipo":"conexao","simples":"true","conexao":"1,2"},{"coordenada":"1,0","tipo":"and","simples":"false","primeira_conexao":"0,0","segunda_conexao":"0,1"},{"coordenada":"1,2","tipo":"or","simples":"false","primeira_conexao":"0,2","segunda_conexao":"0,3"},{"coordenada":"0,0","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,2","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,3","tipo":"conexao","simples":"true","conexao":"inicial"}]}';

// f='{"dimensao":[5,2],"info":[{"coordenada":"4,0","tipo":"conexao","simples":"true","conexao":"3,0"},{"coordenada":"4,1","tipo":"conexao","simples":"true","conexao":"3,0"},{"coordenada":"3,0","tipo":"and","simples":"false","primeira_conexao":"2,0","segunda_conexao":"2,1"},{"coordenada":"2,0","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"conexao","simples":"true","conexao":"1,1"},{"coordenada":"1,0","tipo":"conexao","simples":"true","conexao":"0,0"},{"coordenada":"1,1","tipo":"not","simples":"true","conexao":"0,1"},{"coordenada":"0,0","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"conexao","simples":"true","conexao":"inicial"}]}';

// z='{"dimensao":[5,4],"info":[{"coordenada":"4,0","tipo":"conexao","simples":"true","conexao":"3,0"},{"coordenada":"4,1","tipo":"conexao","simples":"true","conexao":"3,1"},{"coordenada":"4,2","tipo":"conexao","simples":"true","conexao":"3,2"},{"coordenada":"4,3","tipo":"conexao","simples":"true","conexao":"3,3"},{"coordenada":"3,0","tipo":"not","simples":"true","conexao":"2,0"},{"coordenada":"3,1","tipo":"not","simples":"true","conexao":"2,1"},{"coordenada":"3,2","tipo":"conexao","simples":"true","conexao":"2,2"},{"coordenada":"3,3","tipo":"conexao","simples":"true","conexao":"2,3"},{"coordenada":"2,0","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,2","tipo":"conexao","simples":"true","conexao":"1,2"},{"coordenada":"2,3","tipo":"conexao","simples":"true","conexao":"1,2"},{"coordenada":"1,0","tipo":"and","simples":"false","primeira_conexao":"0,0","segunda_conexao":"0,1"},{"coordenada":"1,2","tipo":"or","simples":"false","primeira_conexao":"0,2","segunda_conexao":"0,3"},{"coordenada":"0,0","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,2","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,3","tipo":"conexao","simples":"true","conexao":"inicial"}]}';

// k='{"dimensao":[5,4],"info":[{"coordenada":"4,0","tipo":"conexao","simples":"true","conexao":"3,0"},{"coordenada":"4,1","tipo":"conexao","simples":"true","conexao":"3,1"},{"coordenada":"4,2","tipo":"conexao","simples":"true","conexao":"3,2"},{"coordenada":"4,3","tipo":"conexao","simples":"true","conexao":"3,3"},{"coordenada":"3,0","tipo":"conexao","simples":"true","conexao":"2,0"},{"coordenada":"3,1","tipo":"conexao","simples":"true","conexao":"2,1"},{"coordenada":"3,2","tipo":"not","simples":"true","conexao":"2,2"},{"coordenada":"3,3","tipo":"not","simples":"true","conexao":"2,3"},{"coordenada":"2,0","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"conexao","simples":"true","conexao":"1,0"},{"coordenada":"2,2","tipo":"conexao","simples":"true","conexao":"1,2"},{"coordenada":"2,3","tipo":"conexao","simples":"true","conexao":"1,2"},{"coordenada":"1,0","tipo":"and","simples":"false","primeira_conexao":"0,0","segunda_conexao":"0,1"},{"coordenada":"1,2","tipo":"or","simples":"false","primeira_conexao":"0,2","segunda_conexao":"0,3"},{"coordenada":"0,0","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,2","tipo":"conexao","simples":"true","conexao":"inicial"},{"coordenada":"0,3","tipo":"conexao","simples":"true","conexao":"inicial"}]}';

j='{"dimensao":[7,4],"info":[{"coordenada":"6,0","tipo":"linha_central","simples":"true","conexao":"5,0"},{"coordenada":"6,1","tipo":"linha_central","simples":"true","conexao":"5,1"},{"coordenada":"6,2","tipo":"linha_central","simples":"true","conexao":"5,2"},{"coordenada":"6,3","tipo":"linha_central","simples":"true","conexao":"5,3"},{"coordenada":"5,0","tipo":"linha_central","simples":"true","conexao":"4,0"},{"coordenada":"5,1","tipo":"linha_central","simples":"true","conexao":"4,1"},{"coordenada":"5,2","tipo":"not","simples":"true","conexao":"4,2"},{"coordenada":"5,3","tipo":"not","simples":"true","conexao":"4,3"},{"coordenada":"4,0","tipo":"linha_central","simples":"true","conexao":"3,0"},{"coordenada":"4,1","tipo":"linha_central","simples":"true","conexao":"3,1"},{"coordenada":"4,2","tipo":"linha_central","simples":"true","conexao":"3,2"},{"coordenada":"4,3","tipo":"linha_central","simples":"true","conexao":"3,3"},{"coordenada":"3,0","tipo":"linha_central","simples":"true","conexao":"2,0"},{"coordenada":"3,1","tipo":"linha_central","simples":"true","conexao":"2,1"},{"coordenada":"3,2","tipo":"not","simples":"true","conexao":"2,2"},{"coordenada":"3,3","tipo":"not","simples":"true","conexao":"2,3"},{"coordenada":"2,0","tipo":"linha_central","simples":"true","conexao":"1,0"},{"coordenada":"2,1","tipo":"linha_central","simples":"true","conexao":"1,0"},{"coordenada":"2,2","tipo":"linha_central","simples":"true","conexao":"1,2"},{"coordenada":"2,3","tipo":"linha_central","simples":"true","conexao":"1,2"},{"coordenada":"1,0","tipo":"and","simples":"false","primeira_conexao":"0,0","segunda_conexao":"0,1"},{"coordenada":"1,2","tipo":"or","simples":"false","primeira_conexao":"0,2","segunda_conexao":"0,3"},{"coordenada":"0,0","tipo":"linha_central","simples":"true","conexao":"inicial"},{"coordenada":"0,1","tipo":"linha_central","simples":"true","conexao":"inicial"},{"coordenada":"0,2","tipo":"linha_central","simples":"true","conexao":"inicial"},{"coordenada":"0,3","tipo":"linha_central","simples":"true","conexao":"inicial"}]}';

criaCircuito(j);

function atualiza_celula(celula, novo_estado){
	if(novo_estado=='on'){
		if($(celula).hasClass('off')){
			$(celula).removeClass('off');
		}
		if($(celula).hasClass('on')){
			$(celula).removeClass('on');
		}

		$(celula).addClass('on');
	}else{
		if($(celula).hasClass('on')){
			$(celula).removeClass('on');
		}
		if($(celula).hasClass('off')){
			$(celula).removeClass('off');
		}
		$(celula).addClass('off');
	}
	insere_imagens();
}

function insere_imagens(){
	for(let i=0; i<qtde_linhas; i++){
		for(let j=0; j<qtde_colunas; j++){
			if($(quadro[i][j]).attr('tipo')=='not'){
				let conecta_a=$(quadro[i][j]).attr('conexao');
				if(conecta_a!=undefined){
					conecta_a=conecta_a.split(',');
					conecta_a=listaparaint(conecta_a);
					let l=conecta_a[0]; let c=conecta_a[1];
					if($(quadro[l][c]).attr('tipo')=='linha_lateral'){
						$(quadro[i][j]).css('background-image', "url('img/not1.jpg')");
						$(quadro[i][j+1]).css('background-image', "url('img/not2.jpg')");
					}else{
						$(quadro[i][j]).css('background-image', "url('img/not.jpg')");
					}
				}
			}else if($(quadro[i][j]).attr('tipo')=='and'){
				$(quadro[i][j]).css('background-image', "url('img/and1.jpg')");
				$(quadro[i][j+1]).css('background-image', "url('img/and2.jpg')");
			}else if($(quadro[i][j]).attr('tipo')=='or'){
				$(quadro[i][j]).css('background-image', "url('img/or1.jpg')");
				$(quadro[i][j+1]).css('background-image', "url('img/or2.jpg')");
			}else if($(quadro[i][j]).attr('tipo')=='linha_central'){
				$(quadro[i][j]).css('background-image', "url('img/linha_central.jpg')");

				if($(quadro[i][j]).hasClass('on')){
					$(quadro[i][j]).css('background-image', "url('img/linha_central_on.jpg')");
				}else if($(quadro[i][j]).hasClass('off')){
					$(quadro[i][j]).css('background-image', "url('img/linha_central_off.jpg')");
				}

			}else if($(quadro[i][j]).attr('tipo')=='linha_lateral'){
				$(quadro[i][j]).css('background-image', "url('img/linha_lateral.jpg')");

				if($(quadro[i][j]).hasClass('on')){
					$(quadro[i][j]).css('background-image', "url('img/linha_lateral_on.jpg')");
				}else if($(quadro[i][j]).hasClass('off')){
					$(quadro[i][j]).css('background-image', "url('img/linha_lateral_off.jpg')");
				}

			}
		}
	}
}

function verifica_quadro(){
	for(let i=0; i<qtde_linhas; i++){
		for(let j=0; j<qtde_colunas; j++){
			// ELEMENTOS SIMPLES
			if($(quadro[i][j]).attr('simples')=='true'){
				if($(quadro[i][j]).attr('conexao')!='inicial'){
					let conexao=$(quadro[i][j]).attr('conexao');
					conexao=listaparaint(conexao.split(','));
					if($(quadro[i][j]).attr('tipo')!='not'){
						if($(quadro[conexao[0]][conexao[1]]).hasClass('on')){
							$(atualiza_celula(quadro[i][j], 'on'));
						}else{
							$(atualiza_celula(quadro[i][j], 'off'));
						}
					}else{
						if($(quadro[conexao[0]][conexao[1]]).hasClass('on')){
							$(atualiza_celula(quadro[i][j], 'off'));
						}else{
							$(atualiza_celula(quadro[i][j], 'on'));
						}						
					}
				}
			}
			// ELEMENTOS COMPLEXOS
			if($(quadro[i][j]).attr('simples')=='false'){
				let primeira_conexao=$(quadro[i][j]).attr('primeira_conexao');
				let segunda_conexao=$(quadro[i][j]).attr('segunda_conexao');

				primeira_conexao=listaparaint(primeira_conexao.split(','));
				segunda_conexao=listaparaint(segunda_conexao.split(','));
				// and
				if($(quadro[i][j]).attr('tipo')=='and'){
					// se as duas conexões estão ativas
					if($(quadro[primeira_conexao[0]][primeira_conexao[1]]).hasClass('on')
						&&
						$(quadro[segunda_conexao[0]][segunda_conexao[1]]).hasClass('on')){
						// então...
						$(atualiza_celula(quadro[i][j], 'on'));
					}else{
						// senão...
						$(atualiza_celula(quadro[i][j], 'off'));
					}
				}
				// or
				if($(quadro[i][j]).attr('tipo')=='or'){
					// se uma das duas conexões estão ativas
					if($(quadro[primeira_conexao[0]][primeira_conexao[1]]).hasClass('on')
						||
						$(quadro[segunda_conexao[0]][segunda_conexao[1]]).hasClass('on')){
						// então...
						$(atualiza_celula(quadro[i][j], 'on'));
					}else{
						// senão...
						$(atualiza_celula(quadro[i][j], 'off'));
					}
				}
			}
		}
	}
}

function verifica_inputs(){
	// ESTA FUNÇÃO VERIFICA OS INPUTS E ATUALIZA AS CELULAS LOGO ACIMA DELES
	for(let i=0; i<qtde_colunas; i++){
		if($(`#input_${i}`).text()=='1'){
			atualiza_celula(quadro[0][i], 'on');
		}else{
			atualiza_celula(quadro[0][i], 'off');
		}
	}
	verifica_quadro();
	verifica_fim();
}

// VERIFICA FIM
function verifica_fim(){
	let fim=true;
	let contador=0;
	for(let i=0; i<qtde_colunas; i++){
		if($(quadro[qtde_linhas-1][i]).hasClass('off')){
			fim=false;
		}else{
			if($(quadro[qtde_linhas-1][i]).hasClass('on')){
				contador++;
			}
		}
	}
	if(contador>0&&fim){
		fim=true;
		$('#output').text('V');
		$('#output').css('background', 'darkgreen');
		$('#output').css('color', 'white');
		$('#btn_proximo').css('background', 'darkgreen');
	}else if(!fim){
		$('#output').text('F');
		$('#output').css('background', 'brown');
		$('#output').css('color', 'white');
	}
}

$('#envio_circuito').on('change', function(){
	criaCircuito($('#envio_circuito').val());
});

// TOAST
function toast(texto, bg, tempo=1100) {
	$('#toast').css('background', bg);
	$('#toast').text(texto);
	$('#toast').fadeIn('300');
	setTimeout(function() {
		$('#toast').fadeOut('1000');
	}, tempo);
}
// ***
function aleatorio(min, max) {
	// Gera um número aleatório entre o mínimo e o máximo, estando eles inclusos
	 min = Math.ceil(min);
	 max = Math.floor(max);
	 return Math.floor(Math.random()*(max-min+1))+min;
}

function em_string(string, palavra){
	string=string.split('');
	palavra=palavra.split('');
	let contador, encontrado=false;
	for(let i=0; i<string.length; i++){
		contador=0;
		let x=i;
		for(let j=0; j<palavra.length; j++){
			if(string[x]==palavra[j]){
				contador++;
			}
			x++;
		}
		if(contador==palavra.length){
			encontrado=true;
			break;
		}
	}
	return encontrado;
}

function listaparaint(lista){
	for(let i=0; i<lista.length; i++){
		lista[i]=parseInt(lista[i]);
	}
	return lista;
}

function getColuna(matriz, col){
	let coluna=[];
	for(let i=0; i<matriz.length; i++){
		coluna.push(matriz[i][col]);
	}
	return coluna;
}

function distinguir(lista) {
	let distintos = [];
	for (let i=0; i<lista.length; i++) {
		if(lista[i]!=-1){
			let tem=false;
			for (let j=0; j<distintos.length; j++) {
				if (lista[i] == distintos[j]) {
					tem=true;
				}
			}
			if (!tem) {
				distintos.push(lista[i]);
			}
		}
	}
	return distintos;
}

function maximo(lista) {
	let max = 0;
	for (let i = 0; i < lista.length; i++) {
		if (lista[i] > max) {
			max = lista[i];
		}
	}
	return max;
}

function minimo(lista) {
	let min = 99999999;
	for (let i = 0; i < lista.length; i++) {
		if (lista[i] < min) {
			min = lista[i];
		}
	}
	return min;
}
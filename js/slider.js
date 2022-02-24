const botoesControle = [... document.getElementsByClassName('botao-controle')];
const linha = document.getElementById('linha');

botoesControle.forEach((botao, index) => {
	botao.addEventListener('click', () => {
		linha.style.transform = `translateX(-${index * 100}vw)`;
		limpaBotoesAtivos();
		botao.classList.add('ativo');
	});
});

function limpaBotoesAtivos() {
	botoesControle.forEach(botao => {
		botao.classList.remove('ativo');
	});	
}
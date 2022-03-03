const botoesControle = [... document.getElementsByClassName('botao-controle')];
const colunaTexto = [... document.querySelectorAll('.coluna .texto')];
const colunaContainerImagem = [... document.querySelectorAll('.coluna .container-imagem')]
const linha = document.getElementById('linha');

botoesControle.forEach((botao, index) => {
	botao.addEventListener('click', () => {
		linha.style.transform = `translateX(-${index * 100}vw)`;
		limpaBotoesAtivos();
		botao.classList.add('ativo');
	});
});


colunaContainerImagem.forEach((containerImagem, index) => {
	containerImagem.addEventListener('click', () => {
		limpaBotoesAtivos();
		if (index === colunaContainerImagem.length - 1) {
			linha.style.transform = `translateX(${0}vw)`;
			botoesControle[0].classList.add('ativo');
		} else {
			linha.style.transform = `translateX(-${(index + 1) * 100}vw)`;
			botoesControle[index + 1].classList.add('ativo');
		}
	});
});

let intervalIndex = 0;
let movimentacao = 0;
setInterval(() => {
	limpaBotoesAtivos();
	if (intervalIndex === botoesControle.length - 1) {
		linha.style.transform = `translateX(${0}vw)`;
		botoesControle[0].classList.add('ativo');
		intervalIndex = 0;
		movimentacao = 0;

	} else {
		movimentacao += 100;
		linha.style.transform = `translateX(-${movimentacao}vw)`;
		intervalIndex++;
		botoesControle[intervalIndex].classList.add('ativo');
	}
}, 3000);

function limpaBotoesAtivos() {
	botoesControle.forEach(botao => {
		botao.classList.remove('ativo');
	});	
}
const menu = document.getElementById('menu');
const toggleMenu = document.querySelector('[data-toggle-menu]');
const listaMenu = document.querySelector('[data-lista-menu]');
const links = [... document.getElementsByClassName('link-menu')];
const btnSubir = document.getElementById('btnSubir');

const VELOCIDADE_SCROLL = 17;

let aberto = false;
toggleMenu.addEventListener('click', () => {
	if (listaMenu.style.transform === 'translateY(0%)') {
		listaMenu.style.transform = 'translateY(120%)';
		toggleMenu.classList.remove('bi-x');
		toggleMenu.classList.add('bi-list');
		aberto = false;
	} else {
		listaMenu.style.transform = 'translateY(0%)';
		toggleMenu.classList.remove('bi-list');
		toggleMenu.classList.add('bi-x');
		aberto = true;
	}
});

// === scroll suave em vanilla javascript ===
for (const link of links) {
  link.addEventListener("click", clickHandler);
}

function clickHandler(e) {
	e.preventDefault();
	const href = this.getAttribute("href");
	const offsetTop = document.querySelector(href).offsetTop - 100;
	let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
	scrollSuave(scrollTop, offsetTop, VELOCIDADE_SCROLL);
}

// === scroll ===
let scrollTopAnterior = 0;
document.addEventListener('scroll', e => {
	let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
	// para aparecer botão de subir
	if (scrollTop > 250) {
		btnSubir.style.display = 'block';
	} else if (scrollTop < 250) {
		btnSubir.style.display = 'none';
	}
	// para tirar o menu da tela
	if (scrollTop > scrollTopAnterior) {
		menu.style.opacity = '.75';
	} else {
		menu.style.opacity = '1';
	}
	scrollTopAnterior = scrollTop;
});

// clicar no botão de subir
btnSubir.addEventListener('click', () => {
	let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
	scrollSuave(scrollTop, 0, VELOCIDADE_SCROLL);
});


function scrollSuave(topAtual, top, passo) {
		let interval = setInterval(() => {
				if (top > topAtual) {
					topAtual += passo;
					if (topAtual >= top) {
						clearInterval(interval);
					}
				} else {
					topAtual -= passo;
					if (topAtual <= top) {
						clearInterval(interval);
					}
				}
			scroll({ top: topAtual });
		}, 1);
}
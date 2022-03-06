// 1 - é sempre necessário criar duas funções: uma para lidar com o início dos jogos e outra para lidar com o fim: handleStart e handleLose
// 2 - handleStart é colocada como resultado de um eventListener no document é deve ser executada somente uma vez { once: true }
// 3 - o uso dos atributos data-element é um facilitador para o javascript, pois assim fica mais fácil de separar o que é seletor css e o que é seletor javascript
// 4 - selecionar todos os elementos que serão usados no começo do código ajuda a visualização
// 5 - todo jogo precisa de uma função updateLoop e o javascript já possui uma função facilitadora para criação de loops assim, que é o requestAnimationFrame; esta função nativa já permite, inclusive, obter o tempo de cada frame, o que nos permite calcular o delta, isto é, a distância entre um frame e outro, de tal maneira que podemos corrigir o lag, compensando pelo tempo perdido; setInterval não é a escolha mais adequada, pois possui baixa performance e não é acurado
// 6 - acontece que se o usuário sair da página e voltar depois de um tempo, todo esse tempo será contado como tempo perdido, fazendo com que o jogo bugue completamente; então, é necessário identificar se o usuário saiu da página

const bird = document.querySelector('[js-data-bird]');
const title = document.querySelector('[js-data-title]');
const subtitle = document.querySelector('[js-data-subtitle]');
const record = document.querySelector('[js-data-record]');

let checkedRecord = JSON.parse(localStorage.getItem('recordBlackBird')) || 0;

if (checkedRecord !== 0) {
	checkedRecord = checkedRecord.record;
}

function checkRecord() {
	if (getPassedPipesCount() > checkedRecord) {
		checkedRecord = getPassedPipesCount();
		localStorage.setItem('recordBlackBird', JSON.stringify({ record: checkedRecord }));
	}
}

// event listeners
document.addEventListener('keypress', handleStart, { once: true });

let lastTime = null;
function update(time) {
	if (lastTime) {
		const delta = time - lastTime;
		updateBird(delta);
		handleFlap(delta);
		updatePipes(delta);
		// é este return que finaliza o loop, pois ele impede que o request seja feito novamente
		if (checkLose()) return handleLose();
	}
	lastTime = time;
	requestAnimationFrame(update);
}

function handleStart() {
	title.classList.add('hide');
	setupBird();
	setupPipes();
	// é importante não simplesmente chamar a função de maneira normal, mas sim pelo request, pois assim os frames e os tempos já serão levados em conta logo de início
	requestAnimationFrame(update);
}

function checkLose() {
	const birdRect = getBirdRect();
	const insidePipe = getPipeRects().some(rect => isCollision(birdRect, rect));
	const outsideWorld = birdRect.top <= 0 || birdRect.bottom > window.innerHeight;

	return outsideWorld || insidePipe;
}

function handleLose() {
	checkRecord();
	title.classList.remove('hide');
	subtitle.classList.remove('hide');
	record.classList.remove('hide');
	subtitle.textContent = `${getPassedPipesCount()} passagens.`;
	record.textContent = `Seu recorde é ${checkedRecord}!`;
	lastTime = null;
	setTimeout(() => {
		document.addEventListener('keypress', handleStart, { once: true });
	}, 500);
}

// bird
const JUMP_DURATION = 200;
const BIRD_SPEED = 0.3;
let timeSinceLastJump = 0;

function setupBird() {
	setTop(window.innerHeight / 2);
	document.removeEventListener('keydown', handleJump);
	document.addEventListener('keydown', handleJump);
}

function updateBird(delta) {
	// tudo que se mexe precisa ser corrigido com o delta
	// se o timeSinceLastJump for maior do que o JUMP_DURATION, então o bird desce; caso contrário, se o usuário aperta Space, então o timeSinceLastJump vai para zero, ficando menor do que o JUMP_DURATION até que o JUMP_DURATION é somado algumas vezes o delta, para voltar a cair
	if (timeSinceLastJump < JUMP_DURATION) {
		setTop(getTop() - BIRD_SPEED * delta);
	} else {
		setTop(getTop() + BIRD_SPEED * delta);
	}

	timeSinceLastJump += delta;
}

function handleJump(e) {
	if (e.code !== 'Space') return;

	timeSinceLastJump = 0;
}

function setTop(top) {
	bird.style.setProperty('--bird-top', top);
}

function getTop() {
	return parseFloat(getComputedStyle(bird).getPropertyValue('--bird-top'));
}

function getBirdRect() {
	return bird.getBoundingClientRect();
}

// animação
// variáveis e constantes de animação
const FRAME_TIME = 30;
let currentFrameTime = 0;
let frame = 1;
let lastFrame = 7;
let forward = true;
function handleFlap(delta) {
	if (currentFrameTime >= FRAME_TIME) {
		bird.src = `img/anim-bird-${frame}.png`;
		currentFrameTime -= FRAME_TIME;
		if (frame < lastFrame && forward) {
			frame++;
		} else {
			if (frame > 1) {
				forward = false;
				frame--;				
			} else {
				forward = true;
			}
		}
	}
	currentFrameTime += delta;
}

// pipes
let pipes = [];
let timeSinceLastPipe;
let passedPipeCount = 0;
const PIPE_INTERVAL = 1500; // com que frequenta os pipes são criados; neste caso, 1500ms
const PIPE_SPEED = .50;
const HOLE_HEIGHT = 120;
const PIPE_WIDTH = 75;

function setupPipes() {
	document.documentElement.style.setProperty('--pipe-width', PIPE_WIDTH);
	/* à medida em que se mexe nesse valor, o gap subirá ou descerá; no javascript, um valor aleatório é chamado para */
	document.documentElement.style.setProperty('--hole-height', HOLE_HEIGHT);
	timeSinceLastPipe = PIPE_INTERVAL;
	passedPipeCount = 0;
	// remove os pipes do jogo anterior, antes de começar outro
	pipes.forEach(pipe => pipe.remove());
} 

function createPipe() {
	// com isto aqui, já é criada toda aquela configuração de CSS dos pipes
	const pipeElem = document.createElement('div');
	// estas funções de createSegment já colocam as classes necessárias
	const topElem = createPipeSegment('top');
	const bottomElem = createPipeSegment('bottom');
	pipeElem.append(topElem);
	pipeElem.append(bottomElem);
	pipeElem.classList.add('pipe'); // classe de pipe
	// todo este cálculo é para evitar que os buracos subam ou desçam demais a ponto de não serem vistos; o menor valor sempre será 1 HOLE_HEIGHT mais metade e o segundo valor sempre será a altura da janela menos metade de um HOLE_HEIGHT
	pipeElem.style.setProperty('--hole-top', randomNumberBetween(HOLE_HEIGHT * 1.5, window.innerHeight - HOLE_HEIGHT * 0.5));
	const pipe = {
		get left() {
			return parseFloat(getComputedStyle(pipeElem).getPropertyValue('--pipe-left'));
		},
		set left(value) {
			pipeElem.style.setProperty('--pipe-left', value);
		},
		remove() {
			// se o pipe não é igual ao pipe atual, remova-o do array
			pipes = pipes.filter(p => p !== pipe);
			// depois remova-o da página
			pipeElem.remove();
		},
		rects() {
			return [
				topElem.getBoundingClientRect(),
				bottomElem.getBoundingClientRect()
			]
		}
	};
	pipe.left = window.innerWidth; // todo pipe criado para começar na extremidade direita da janela
	// insere o elemento no body
	document.body.append(pipeElem);
	pipes.push(pipe); // basicamente, coloca o pipe criado em um array, para que depois esse array possa ser percorrido, de modo a mover cada um dos pipes que foram criados, lá no updatePipes (* procure o asterisco para achar onde isso foi feito)
}

function createPipeSegment(position) {
	const segment = document.createElement('div');
	segment.classList.add('segment', position);
	return segment;
} 

function randomNumberBetween(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function updatePipes(delta) {
	timeSinceLastPipe += delta;
	if (timeSinceLastPipe > PIPE_INTERVAL) {
		timeSinceLastPipe -= PIPE_INTERVAL;
		createPipe();
	}
	// (*)
	pipes.forEach(pipe => {
		// se o pipe já foi pra esquerda da tela, ele pode ser removido
		if (pipe.left + PIPE_WIDTH < 0) {
			passedPipeCount++;
			return pipe.remove();
		}
		pipe.left = pipe.left - delta * PIPE_SPEED;
	});
}

function getPassedPipesCount() {
	return passedPipeCount;
}

function getPipeRects() {
	return pipes.flatMap(pipe => pipe.rects());
}

function isCollision(rect1, rect2) {
	return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
}
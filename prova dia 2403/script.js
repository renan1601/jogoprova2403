const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

let pontuacao = 0;
let recorde = localStorage.getItem('recorde') ? parseInt(localStorage.getItem('recorde')) : 0;

const tamanhoBloco = 20;
const velocidade = 20;

class Cobra {
    constructor() {
        this.corpo = [{ x: 100, y: 200 }];
        this.direcao = { x: velocidade, y: 0 };
        this.viva = true;
    }

    atualizar() {
        if (!this.viva) return;

        const novaCabeca = {
            x: this.corpo[0].x + this.direcao.x,
            y: this.corpo[0].y + this.direcao.y
        };

        if (this.verificarColisaoBorda(novaCabeca) || this.verificarColisaoCorpo(novaCabeca)) {
            this.viva = false;
            if (pontuacao > recorde) {
                recorde = pontuacao;
                localStorage.setItem('recorde', recorde);
            }
            return;
        }

        this.corpo.unshift(novaCabeca);

        if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
            pontuacao++;
            comida.gerarNovaPosicao();
        } else {
            this.corpo.pop();
        }
    }

    desenhar() {
        ctx.fillStyle = 'blue';
        this.corpo.forEach(segmento => {
            ctx.fillRect(segmento.x, segmento.y, tamanhoBloco, tamanhoBloco);
        });
    }

    verificarColisaoBorda(cabeca) {
        return cabeca.x < 0 || cabeca.x >= canvas.width || cabeca.y < 0 || cabeca.y >= canvas.height;
    }

    verificarColisaoCorpo(cabeca) {
        return this.corpo.some((segmento, index) => index !== 0 && segmento.x === cabeca.x && segmento.y === cabeca.y);
    }
}

class Comida {
    constructor() {
        this.gerarNovaPosicao();
    }

    gerarNovaPosicao() {
        this.x = Math.floor(Math.random() * (canvas.width / tamanhoBloco)) * tamanhoBloco;
        this.y = Math.floor(Math.random() * (canvas.height / tamanhoBloco)) * tamanhoBloco;
    }

    desenhar() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, tamanhoBloco, tamanhoBloco);
    }
}

const cobra = new Cobra();
const comida = new Comida();

function desenharPontuacao() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${pontuacao}`, 10, 20);
    ctx.fillText(`Recorde: ${recorde}`, 10, 40);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW' && cobra.direcao.y === 0) {
        cobra.direcao = { x: 0, y: -velocidade };
    } else if (e.code === 'KeyS' && cobra.direcao.y === 0) {
        cobra.direcao = { x: 0, y: velocidade };
    } else if (e.code === 'KeyA' && cobra.direcao.x === 0) {
        cobra.direcao = { x: -velocidade, y: 0 };
    } else if (e.code === 'KeyD' && cobra.direcao.x === 0) {
        cobra.direcao = { x: velocidade, y: 0 };
    }
});

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cobra.viva) {
        cobra.atualizar();
        comida.desenhar();
        cobra.desenhar();
        desenharPontuacao();
        setTimeout(loop, 100);
    } else {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText(`Pontuação final: ${pontuacao}`, canvas.width / 2 - 80, canvas.height / 2 + 40);
    }
}

loop();

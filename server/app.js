// importação de dependência(s)
import express from 'express';
import fs from 'fs';

// variáveis globais deste módulo
const PORT = 3000;
const db = {};
const app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))

fs.readFile('./server/data/jogadores.json', (_, res) => {
    db.jogadores = JSON.parse(res);
});

fs.readFile('./server/data/jogosPorJogador.json', (_, res) => {
    db.jogosPorJogador = JSON.parse(res);
});

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas

app.set('view engine', 'hbs');
app.set('views', './server/views/');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)

app.get('/', (_, res) => {
    res.render('index', db.jogadores);
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código

app.get('/jogador/:id', (req, res) => {

    const id = req.params.id;
    const jogador = db.jogadores.players.find(j => j.steamid === id);
    const jogos = db.jogosPorJogador[id].games;

    jogador.quantidadeJogos = db.jogosPorJogador[id].game_count;
    jogador.quantidadeNaoJogados = jogos.filter(j => !j.playtime_forever).length;

    jogador.jogos = jogos.sort((j1, j2) => j1.playtime_forever < j2.playtime_forever ? 1 : -1).slice(0, 5);

    jogador.jogos.forEach(j => j.tempo_hora = Math.round(j.playtime_forever / 60));
    jogador.jogoPreferido = jogador.jogos[0];

    res.render('jogador', jogador);
});

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código

app.use(express.static('./client')).listen(PORT);
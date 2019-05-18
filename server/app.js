var fs= require('fs');
var _ = require('underscore');
var express = require('express'),
app = express();

var  player,	
     games,							
     notPlayedYet, 
 	   orderedListOfGames, 		
     topFive, 					 
     topPlayed;			

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
    jogadores: JSON.parse(fs.readFileSync(__dirname + "/data/jogadores.json")),
	  jogosPorJogador: JSON.parse(fs.readFileSync(__dirname + "/data/jogosPorJogador.json"))
};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');
app.set('view engine', 'hbs');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.set('views', 'server/views');
app.get('/', function (req, res) {res.render('index', db.jogadores)});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:id/', function (req, res) {

  calculateParameters(req);
  res.render('jogador', {
		player: 		player,
		games: 			games,
		notPlayedYet: 	notPlayedYet,
		favoriteGame: 	topPlayed,
		topFive: 		topFive,
  });
  
});

function calculateParameters (req) {
  player = _.find(db.jogadores.players, function(id) {return id.steamid === req.params.id}); 
  games = db.jogosPorJogador[req.params.id];  

  let gnp = _.where(games.games, {playtime_forever: 0});
	notPlayedYet = gnp.length;
    
  orderedListOfGames = _.sortBy(games.games, 'playtime_forever');
  topFive = _.map(_.chain(_.last(orderedListOfGames, [5])).reverse().value(), function (id) { 
    id.playtime_forever = Math.round(id.playtime_forever/60); 
      return id; }); 
  topPlayed = [topFive[0], player.steamid]; 
}


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client/'));

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
app.listen(3000, function () {
  console.log('Escutando na : http://localhost:3000')});
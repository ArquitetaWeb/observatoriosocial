 var express = require('express'),
	path = require('path'),
	http = require('http'),
	open = require('open'),
    api = require('./routes/callsApi');
 
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    //app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */    
	//app.use(express.bodyParser()); // deprecated	
	app.use(express.json());
	app.use(express.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
});

//
app.get('/graph/:parameters', api.dadosParam); 
app.get('/api/dados/:parameters', api.dadosParam); // api/dados/789?tabA=4561&tabB=123
app.get('/api/dados', api.dados);

// Adicionar dados para o banco
app.post('/api/dados', api.adddata); // Adiciona itens via Json Object

// 
app.get('/api/recreate', api.recriar); // recriar tabelas

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
	
	var webPage = "http://localhost:" + app.get('port');
	//open(webPage);
});
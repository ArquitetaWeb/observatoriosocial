var mongo = require('mongodb');
var crypto = require('crypto');
var nodemailer = require("nodemailer");

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;	
	ObjectID = mongo.ObjectID;

//https://accounts.google.com/DisplayUnlockCaptcha // Libera GMAIL
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
    auth: {
        user: "arquitetaweb@gmail.com",
        pass: "pass"
    }   
});

encrypt = function(text){
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
decrypt = function(text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

sendEmail = function(lat, lng) {
	var latEncrypt = encrypt(lat);	
	var lngEncrypt = encrypt(lng);	
	var textLink = "https://feiralivre.herokuapp.com/#authenticated/" + latEncrypt + "/" + lngEncrypt;	
	var gMapsLink = "https://www.google.com/maps/preview?q=" + lat + "," + lng + "";
	
	var mailOptions = {
        from: "FeiraLivre ArquitetaWeb <arquitetaweb@gmail.com>", // sender address
        to: "marcos.tomazini@gmail.com",
        subject: "FeiraLivre - Adicionado Local", 
        html: '<b>Adicionado Local de Alguma Feira :D</b><br />'				
				+ '<a href=\"'+ textLink.toString() + '\">Clique Aqui Para Liberar.</a><br /><br />'
				+ '<a href=\"'+ gMapsLink.toString() + '\">Local Adicionado - Preview</a>'
				+ '<br />'
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

// DATA OBJECT
var	tabelaData = require('./data/tabelas');

var stringConexao = "ds063449.mongolab.com";
var portaConexao = 63449;

var server = new Server(stringConexao, portaConexao, {auto_reconnect: true});	
db = new Db('heroku_app28571941', server, {safe: true});	

db.open(function(err, db) {
	console.log("opening connection...");
	
	if(err) { return console.log("erro aqui -> " + err); }	
	
	console.log("Connected to 'ArquitetaWeb Observatorio Social' database");
	
	if (stringConexao == "localhost") {		
		console.log("MONGO Authorized");
		db.collection('tabelaA', {safe:true}, function(err, collection) {
			if (err) {
				console.log(err);
				console.log("The 'tabela A' collection doesn't exist. Creating data...");
				populateTabelas();
			}
		});	
	} else {	
		db.authenticate("arquitetaweb", "arqw3b", {}, function(err,success){
			if (err) {
				console.warn("MONGO ERROR: unauthorized "+ err.message);
			} else {
				console.log("MONGO Authorized");
				verifyTables();				
			}
		});
	}	
});

exports.recriar = function(req, res) {
	dropTables();
	verifyTables();
	res.send({'success':'recreate datatables success!'});
};

exports.adddata = function(req, res) {
	var consumoObject = req.body;	
	var consumoStr =  JSON.stringify(consumoObject);
	console.log('objeto: ' +consumoStr);
	//console.log('description: ' +consumoObject.description);
	db.collection('dados', function(err, collection) {
		if (consumoStr == "{}") {
			console.log('Error insert dados: object invalid retry');
			res.send(500, {'error': 'Invalid object.'});
			return;
		}
		
		if (err) {
			console.log('Error insert dados: ' + err);
			res.send(500, {'error': 'An error has occurred'});
		} else {		
			collection.insert(consumoObject, function (err, inserted) {
				if (err) {
					console.log('Error insert dados: ' + err);
					res.send(500, {'error': 'An error has occurred'});
				} else {	
					//sendEmail(consumoObject.latitude.toString(), consumoObject.longitude.toString());
					console.log('success inserted consumomesa: ' + inserted);
					res.send(inserted);					
				}		
			});	
		}
	});
};

exports.addfilhos = function(req, res) {
	var consumoObject = req.body;	
	var consumoStr =  JSON.stringify(consumoObject);
	console.log('objeto: ' +consumoStr);
	//console.log('description: ' +consumoObject.description);
	db.collection('dadosfilhos', function(err, collection) {
		if (consumoStr == "{}") {
			console.log('Error insert secretarias: object invalid retry');
			res.send(500, {'error': 'Invalid object.'});
			return;
		}
		
		if (err) {
			console.log('Error insert dadosfilhos: ' + err);
			res.send(500, {'error': 'An error has occurred'});
		} else {		
			collection.insert(consumoObject, function (err, inserted) {
				if (err) {
					console.log('Error insert dadosfilhos: ' + err);
					res.send(500, {'error': 'An error has occurred'});
				} else {	
					//sendEmail(consumoObject.latitude.toString(), consumoObject.longitude.toString());
					console.log('success inserted consumomesa: ' + inserted);
					res.send(inserted);					
				}		
			});	
		}
	});
};

exports.dados = function(req, res) {
	db.collection('dados', function(err, collection) {
		//collection.find({'confirmed': true, 'ads': false}).toArray(function(err, items) {
		collection.find().toArray(function(err, items) {
		
			var object = [];		
			items.forEach(function(entry) {					
					var objectChild = [];
					objectChild.push({v: entry.secretaria});
					objectChild.push({v: entry.realizado});
					objectChild.push({v: entry.orcado});						
					object.push({c: objectChild});					
				}
			);	
			
			res.setHeader('content-type', 'application/json');
			res.send(object);
		});
	});
};

exports.dadosParam = function(req, res) {	
	var query = require('url').parse(req.url,true).query;
	var type = req.param("parameters"); // inutil kkk	
	var queryJson = JSON.stringify(query);	
	
	console.log("all query strings : " + queryJson);
	
	if (type != "children") {
		db.collection('dados', function(err, collection) {
			//collection.find({'confirmed': true, 'ads': false}).toArray(function(err, items) {
			collection.find().toArray(function(err, items) {
			
				var object = [];		
				items.forEach(function(entry) {					
						var objectChild = [];
						objectChild.push({v: entry.secretaria});
						objectChild.push({v: entry.realizado});
						objectChild.push({v: entry.orcado});						
						object.push({c: objectChild});					
					}
				);	
				
				res.setHeader('content-type', 'application/json');
				res.send(object);
			});
		});
	} else {
		db.collection('dadosfilho', function(err, collection) {
		var object = [];		
		collection.find(query).toArray(function(err, items) {		
			/*items.forEach(function(entry) {									
					entry.despesaList.forEach(function(entryChild) {
							var objectChild = [];					
							objectChild.push({v: "2014"});
							objectChild.push({v: entryChild.valorColuna1.orcado});
							objectChild.push({v: entryChild.valorColuna1.atual});
							object.push({c: objectChild});
						}
					);											
									
				}
			);			
			
			var objCount=0;
			for(_obj in object) objCount++;
			console.log(objCount);*/
		
			res.send(items);
		});
	});
	}
};

exports.dadosParamCustom = function(req, res) {	
	var query = require('url').parse(req.url,true).query;
	var codigo = req.param("parameters"); // inutil kkk
	var queryJson = JSON.stringify(query);
	
	console.log(queryJson);
	console.log('Retrieving codigo ' + codigo);	
	console.log("all query strings : " + queryJson);
	
	db.collection('dados', function(err, collection) {
		var object = [];		
		collection.find(query).toArray(function(err, items) {		
		//collection.distinct('codigo', query).toArray(function(err, items) {		
		
		//collection.distinct('codigo', query, function(err, items) {		
			items.forEach(function(entry) {					
					if (codigo == "child") {
						entry.despesaList.forEach(function(entryChild) {
								var objectChild = [];					
								objectChild.push({v: "2014"});
								objectChild.push({v: entryChild.valorColuna1.orcado});
								objectChild.push({v: entryChild.valorColuna1.atual});
								object.push({c: objectChild});
							}
						);											
					} else {
						var objectChild = [];
						objectChild.push({v: "2014"});
						objectChild.push({v: entry.valorColuna1.orcado});
						objectChild.push({v: entry.valorColuna1.atual});						
						object.push({c: objectChild});
					}					
				}
			);			
			
			var objCount=0;
			for(_obj in object) objCount++;
			console.log(objCount);
		
			res.send(object);
		});
	});
};

dropTables = function() {
	db.collection('tabelaA').drop();	
	db.collection('tabelaB').drop();	
	db.collection('tabelaC').drop();	
	db.collection('tabelaD').drop();		
	db.collection('dados').drop();		
	db.collection('dadosfilhos').drop();	
}

verifyTables = function() {
	db.collection('tabelaA', {safe:true}, function(err, collection) {
		if (err) {
			console.log(err);
			console.log("The 'tabelas' collection doesn't exist. Creating data...");
			populateTabelas(); 
		}
	});	
};

populateTabelas = function() {
	console.log("populando tabelas");
	
    db.collection('tabelaA', function(err, collection) {
		console.log("inserindo tabela A");
        collection.insert(tabelaData.tabelaA(), {safe:true}, function(err, result) {});
    });
	
	db.collection('tabelaB', function(err, collection) {
		console.log("inserindo tabela B");
        collection.insert(tabelaData.tabelaB(), {safe:true}, function(err, result) {});
    });
	
	db.collection('tabelaC', function(err, collection) {
		console.log("inserindo tabela C");
        collection.insert(tabelaData.tabelaC(), {safe:true}, function(err, result) {});
    });
	
	db.collection('tabelaD', function(err, collection) {
		console.log("inserindo tabela D");
        collection.insert(tabelaData.tabelaD(), {safe:true}, function(err, result) {});
    });
	
	/*db.collection('dados', function(err, collection) {
		console.log("inserindo dados");
        collection.insert(tabelaData.dadosCidade(), {safe:true}, function(err, result) {});
    });*/
};
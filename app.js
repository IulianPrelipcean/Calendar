
const cookieParser=require('cookie-parser'); 

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const app = express();

const port = 9999;

var mysql = require('mysql');

const util = require('util');





// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(__dirname + '/public'));

// set for cookies
app.use(cookieParser());

app.use(session({
	secret:'secret',
	resave:false,
	saveUninitialized:false,
}));



// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res


// // citim din fisier intrebarile 
// 'use strict'
// const fs = require('fs');
// const { render } = require('ejs');
// const { isFunction } = require('util');
// let rawData = fs.readFileSync('intrebari.json')
// let continut = JSON.parse(rawData)
// let listaIntrebari = continut.listaIntrebari

// // citim din fisier utilizatorii
// rawData = fs.readFileSync('utilizatori.json')
// continut = JSON.parse(rawData)
// let listaUtilizatori = continut
// //console.log("utilz:" + listaUtilizatori[0].utilizator)


// pentru ip
'use strict';
const { networkInterfaces } = require('os');
const { table } = require('console');

const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
           	  results[name].push(net.address);
        }
    }
}
//console.log(results)



// pentru limitarea numarului de accesari la o resursa
//import rateLimit from 'express-rate-limit';
// const rateLimiter = rateLimit({
// 	windowMs: 5 * 60 * 1000, // 24 hrs in milliseconds
// 	max: 3,
// 	message: 'You have exceeded the 100 requests in 24 hrs limit!', 
// 	handler: (req, res) =>{
// 		req.session.mesaj = "Prea multe incercari !";
// 		res.redirect('/');
// 	}
// });

session.nr_incercari = 0;

var possible_path = ['/', '/eveniment', '/preluare_TOATE_evenimentele', '/preluare_evenimente_existente', '/adaugare_utilizator', '/adaugare_credentiale_utilizator', '/chestionar', '/rezultat_chestionar', '/autentificare', '/delogare', '/verificare-autentificare', '/calendar', '/creare-db', '/inserare-db','/extrage_produse', '/adaugare_cos', '/vizualizare-cos', '/admin', '/adauga_produs_nou', 'admin_page']

//orice path introdus va trece pe aici
app.all('*', (req, res, next) =>{
	// var existsPath = possible_path.find((path)=>{
	// 	return req.path == path
	// }) != undefined;

	//console.log(req.session.ip)

	//console.log(req.path)

	var existsPath = false;

	// verifcare existenta path
	for (var i=0; i<possible_path.length; i++)
	{
		if(req.path == possible_path[i])
		{
			//console.log("adresa corecta")
			existsPath = true;
		}
		else{
			//console.log("adresa inexistanta")
		}
	}


	if(existsPath)
	{
		next()
	}
	else{
		req.session.nr_incercari += 1						// incrementez nr de incercari esuate 
		nr_incercari_esuate = req.session.nr_incercari;		
		//console.log("path error")

		mesaj = undefined;
		var utilizator = undefined

		if(nr_incercari_esuate > 2)
		{
			mesaj = "Prea multe incercari eseuate. Blocat!"
			res.render('page_not_found_404', {utilizator: utilizator, mesaj:mesaj})
		}
		else{
			res.render('page_not_found_404', {utilizator: utilizator, mesaj:mesaj})
		}
	}
	
});



//app.get('/', (req, res) => res.send('Hello World'));
// la accesarea 'localhost:6789/' ne redirectioneaza la index.ejs
app.get('/', (req, res) => {
	var utilizator = req.session.utilizator
	// console.log("bd= ")
	// console.log(req.session.produse)
	// pentru preluarea produselor din baza de date 
	if(req.session.vector == undefined)
	{
		req.session.vector = []
	}
		
	produse = req.session.produse

  	var utilizator = req.session.utilizator
	var mesaj = undefined



	res.render('index', {utilizator: utilizator, produse: produse, mesaj:mesaj})
});


// // redirectioneaza catre pagina de autentificare.ejs
// app.get('/autentificare', (req, res) => {
// 	var utilizator = req.session.utilizator
// 	var mesaj = undefined
// 	res.render('autentificare', {utilizator: utilizator, mesaj: mesaj})
// });

app.get('/delogare', (req, res) => {
	req.session.utilizator = undefined
  	console.log("delogare")
	res.redirect('/')
	// sau asa
	//res.render('index', {utilizator: undefined})
});

app.get('/adaugare_utilizator', (req, res) =>{
	var utilizator = req.session.utilizator
	var mesaj = undefined
	res.render('adauga-utilizator', {utilizator: utilizator, mesaj: mesaj})
});

app.post('/adaugare_credentiale_utilizator', (req, res) =>{
	var utilizator = req.session.utilizator
	var mesaj = undefined

	var nume = req.body.utilizator;
	var parola = req.body.parola;

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "pw_pass"
	});
	 

	con.connect(function(err) {
		if (err){
			throw err;
		}
		else{
			console.log("Connected!");
		}

		var sql = "USE calendar;"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log("Se foloseste calendar database.");
			}
		});

	
		var sql = "INSERT into user (nume, parola) values(\"" + nume + "\", \"" + parola+ "\");"
		con.query(sql, function(err, result){
		if(err){
			throw err;
		}
		else{	
			console.log("Inserted succesfully");
		}
		});
		
	});
	
	res.render('index', {utilizator: utilizator, mesaj: mesaj})
});


// verifica credentialele 
//app.post('/verificare-autentificare', rateLimiter, (req, res) => {
app.post('/verificare-autentificare', (req, res) => {
  	var rezultat = req.body
	
	var utilizator = rezultat['utilizator']
	var parola = rezultat['parola']

	console.log('utiliz: ' + utilizator)
	console.log('parola: ' + parola)

	req.session.utilizator = utilizator
	var mesaj = undefined
	var validare_login = false;


	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "pw_pass"
	});

	// take the user from database
	con.connect(function(err) {
		if (err){
			throw err;
		}
		else{
			console.log("Connected!");
		}

		var sql = "USE calendar;"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log("Se foloseste cumparaturi database.");
			}
		});

	
		var sql = "select * from user;"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{	
				//console.log(result[0].nume);
				// logare admin
				if(utilizator == "admin" && parola == "admin")
				{
					res.redirect('/admin')
				}
				else{
					for(var i=0; i<result.length; i++)
					{
						if(result[i].nume == utilizator && result[i].parola == parola)
						{
							validare_login = true;
							req.session.id_user = result[i].id;
							//console.log("prenume: " + req.session.prenume)
						}
					}
				
					if(validare_login)
					{
						res.cookie('utilizator', utilizator)
						res.cookie('parola', parola)

						// console.log("utilizator: " + req.cookies['utilizator'])
						// console.log("parola: " + req.cookies['parola'])

						res.render('calendar', {mesaj: mesaj, utilizator: utilizator})
					}
					else
					{
						mesaj = "Utilizator sau parola gresite!"
						req.session.utilizator = undefined
						utilizator = undefined
						//res.cookie('mesaj', mesaj)
						//rateLimiter.resetKey(req.ip)
						res.render('index', {utilizator: utilizator, mesaj: mesaj})
						
					}
				}

			}
		});
		
	});

});


app.get('/calendar', (req, res) => {  
  var utilizator = req.session.utilizator
  res.render('calendar', {utilizator: utilizator})
});


app.post('/eveniment', (req, res) =>{
  var utilizator = req.session.utilizator
  console.log(req.body)

  var titlu = req.body.titlu
  var id_user = req.session.id_user;
  var ora_inceput = req.body.ora_de_inceput
  var ora_sfarsit = req.body.ora_de_sfarsit
  var descriere = req.body.descriere
  var zi = req.body.zi
  var luna = req.body.luna
  var an = req.body.an

  var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "pw_pass"
	});


  con.connect(function(err) {
		if (err){
			throw err;
		}
		else{
			console.log("Connected!");
		}

		var sql = "USE calendar;"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log("Se foloseste cumparaturi database.");
			}
		});
	
		var sql = "INSERT into eveniment (titlu, id_user, ora_inceput, ora_sfarsit, descriere, zi, luna, an) values(\"" + titlu + "\", \"" + id_user+ "\" , \"" + ora_inceput+ "\",  \"" + ora_sfarsit+ "\",  \"" + descriere+ "\", \"" + zi+ "\", \"" + luna+ "\", \"" + an+ "\");"
		con.query(sql, function(err, result){
		if(err){
			throw err;
		}
		else{	
			console.log("Inserted succesfully");
		}
		});
		
	});

  console.log("aici")
  res.render('calendar', {utilizator: utilizator})
})


app.post('/preluare_evenimente_existente', (req, res) =>{
	var utilizator = req.session.utilizator
	console.log(req.body)

	var zi = req.body.zi;
	var luna = req.body.luna;
	var an = req.body.an;
	var id_user = req.session.id_user;



	console.log("id=  " + id_user)

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "pw_pass"
	});

	con.connect(function(err) {
		if (err){
			throw err;
		}
		else{
			console.log("Connected!");
		}

		var sql = "USE calendar;"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log("Se foloseste calendar database.");
			}
		});
	
		var sql = "select * from eveniment where id_user=\"" + id_user + "\" and zi=\"" + zi + "\" and luna=\"" + luna + "\" and an=\"" + an + "\";"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{	
				console.log(result);
				//res.render('calendar', {utilizator: utilizator, result: result})
				res.send({result: result})
			}
		});
		
	});


	//res.render('calendar', {utilizator: utilizator})
})


app.get("/preluare_TOATE_evenimentele", (req, res) =>{

	var id_user = req.session.id_user;

	console.log("id_ +++: " + id_user)

	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "pw_pass"
	});

	con.connect(function(err) {
		if (err){
			throw err;
		}
		else{
			console.log("Connected!");
		}

		var sql = "USE calendar;"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log("Se foloseste calendar database.");
			}
		});
	
		var sql = "select * from eveniment where id_user=" + id_user + ";"
		con.query(sql, function(err, result){
			if(err){
				throw err;
			}
			else{	
				//console.log("in app:")
				//console.log(result);
				//res.render('calendar', {utilizator: utilizator, result: result})
				res.send({result: result})
			}
		});
		
	});
})


app.get('/admin', (req, res) =>{
	utilizator = req.session.utilizator
	res.render('admin_page', {utilizator: utilizator})
});




app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));


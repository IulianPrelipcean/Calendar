//const { json } = require("body-parser");

function apeluriMultiple(){
	seteazaDataCurenta()
	//preiaToateEvenimenteleDB()
	afisareTabel()
	
}


// afisarea datei 
function afiseazaDataCurenta(){
    var today =  new Date()
    var date = today.getFullYear()+ ' - ' + (today.getMonth()+1)+ ' - ' + today.getDate();
    document.getElementById("data_curenta").innerHTML = date;
}


function seteazaDataCurenta(){
	// preluam data curenta
	var today =  new Date()
    var an = today.getFullYear()
	var luna = today.getMonth()+1
	var zi = today.getDate()
	//console.log(an+ ', ' + luna + ', ' + zi)


	// selectul care va contine anul curent
	var an_curent = "<select name=\"an\" id=\"an_selectat\" >"

	for(var i=2015; i<2030; i++) {
		if(i == an)
		{
			an_curent += "<option value=\"" + i + "\"selected>" + i + "</option>"
		}
		else{
			an_curent += "<option value=\"" + i + "\">" + i + "</option>"
		}
	}
	an_curent += "</select>"
		

	// selectul care va contine luna curent
	var luna_curenta = "<select name=\"luna\" id=\"luna_selectata\">"

	for(var i=1; i<13; i++) {
		if(i == luna)
		{
			luna_curenta += "<option value=\"" + i + "\"selected>" + i + "</option>"
		}
		else{
			luna_curenta += "<option value=\"" + i + "\">" + i + "</option>"
		}
	}
	luna_curenta += "</select>"

	document.getElementById("an_curent").innerHTML = an_curent
	document.getElementById("luna_curenta").innerHTML = luna_curenta
}


function afisareTabel(){


	var xhttp = new XMLHttpRequest();
   
	xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);

			var text = this.responseText;
			var obj =JSON.parse(text);

			console.log("obj: ")
			//console.log(obj.result)

			var numar_evenimente_existente = [];
			for (var i=1; i<32; i++)
			{
				numar_evenimente_existente[i] = 0
			}	

			// preia datele pentru a stii ce sa selecteze din tabela eveniment
			var an_selectat = document.getElementById("an_selectat").value;
			var luna_selectata = document.getElementById("luna_selectata").value;
			// console.log("an: " + an_selectat)			
			// console.log("luna: " +luna_selectata)

			for (var i=0; i<obj.result.length; i++)
			{
				if(obj.result[i].luna == luna_selectata && obj.result[i].an == an_selectat)
				{
					numar_evenimente_existente[obj.result[i].zi]++
				}
			}
			console.log(numar_evenimente_existente)

			// ------------------------------------------

			var today =  new Date()
			var ziua_curenta = today.getDate()
			var an_curent = today.getFullYear()
			var luna_curenta = today.getMonth()+1
		
			var vector_luni = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		
			// var an_selectat = document.getElementById("an_curent").value;
			// var luna_selectata = document.getElementById("luna_selectata").value;

			console.log("hatz: "+ luna_selectata)
		
		
			var table = "<table><tbody>"
		
			var index = 1;
		
			for(var i=0; i<5; i++)
			{
				table += "<tr>"
				for (var j=0; j<7; j++)
				{
					table += "<td>"
					if(index <= vector_luni[luna_selectata])
					{
						table += "<button id=\"myBtn\"class=\"buton_zi\" onClick=\"adaugaEveniment(" + index + ")\">"
					}
					else{
						table += "<button disabled id=\"myBtn\"class=\"buton_zi\" onClick=\"adaugaEveniment(" + index + ")\">"
					}
					table += "<div class=\"content_button\">"
					if(index <= vector_luni[luna_selectata])
					{
						
						// show the number of the day
						table += "<div class=\"continut_td\">"
						
						// for the current day is applied a text format(a filled green box)
						if(index == ziua_curenta)
						{
							if(luna_curenta == luna_selectata && an_curent == an_selectat)
							{
								table += "<div class=\"numar_data\">"
								table += index;
								table += "</div>"
							}
							else
							{
								table += index;
							}
						}
						else
						{
							table += index;
						}
						table += "</div>"
		
						
						// show a circle if there is an event
						for (var k=0; k<numar_evenimente_existente[index]; k++)
						{
							table += "<div class=\"exista_eveniment\">" +
							"</div>"
						}
					}
					table += "</div>"
					table += "</button>"
					table += "</td>"
					index++
				}
				table += "</tr>"
			}
			table += "</tbody></table>"
		
			document.getElementById("tabel").innerHTML = table

			// ------------------------------------------

        }
    };

	console.log("apasat")

    xhttp.open("GET", "/preluare_TOATE_evenimentele", true);
	xhttp.send();
}


function salveazaEveniment(){

	var xhttp = new XMLHttpRequest();
   
	xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);

			// the function is called in order to update the number of existing events
			afisareTabel()
        }
    };

	// preluare date despre eveniment/task
	var titlu_eveniment = document.getElementById("titlu_eveniment").value;
	var ora_de_inceput = document.getElementById("ora_de_inceput").value
	var ora_de_sfarsit = document.getElementById("ora_de_sfarsit").value
	var descriere = document.getElementById("description").value
	var zi = document.getElementById("zi_aleasa").value
	var luna = document.getElementById("luna_selectata").value
	var an = document.getElementById("an_selectat").value


	console.log("eve: " + titlu_eveniment)



	console.log("ziua: " + zi)

	var date_json = {
		titlu: titlu_eveniment,
		ora_de_inceput: ora_de_inceput,
		ora_de_sfarsit: ora_de_sfarsit,
		descriere: descriere,
		zi: zi,
		luna: luna,
		an: an
	}
	console.log(date_json)

	console.log("apasat")

	if(titlu_eveniment == "" || descriere == "")
	{
		alert("Campuri necompletate!")
	}
	else{
		xhttp.open("POST", "/eveniment", true);
		//xhttp.setRequestHeader('Content-Type', 'application/json')
		//xhttp.send("parola");
		xhttp.setRequestHeader('Content-Type', 'application/json')
		//xhttp.send(JSON.stringify(number));
		xhttp.send(JSON.stringify(date_json));
	
		
		// Get the modal
		var modal = document.getElementById("myModal");
		modal.style.display = "none";

		// used for clearing the field after changing the focus
		document.getElementById("titlu_eveniment").value = "";
		document.getElementById("ora_de_inceput").value = "0:00";
		document.getElementById("ora_de_sfarsit").value = "0:00";
		document.getElementById("description").value = "";
	
		//alert("Adaugat cu succes!")
	}

	
    
	
}



function adaugaEveniment(zi){
	
	//console.log(zi)



	// set the value of input (hidden) elemenet in order to be used when saving data in database
	document.getElementById("zi_aleasa").value = zi

	// set the value of span elemenet in order to specify the selected day
	document.getElementById("ziua_selectata").innerHTML = zi

	// se preiau evenimentele din ziua aleasa pentru afisare
	preluareEvenimenteExistente()

	// Get the modal
	var modal = document.getElementById("myModal");
	
	// Get the button that opens the modal
	//var btn = document.getElementById("myBtn");
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
	// When the user clicks the button, open the modal 
	modal.style.display = "block";
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  modal.style.display = "none";

	  // used for clearing the field after changing the focus
		document.getElementById("titlu_eveniment").value = "";
		document.getElementById("ora_de_inceput").value = "0:00";
		document.getElementById("ora_de_sfarsit").value = "0:00";
		document.getElementById("description").value = "";
	}
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = "none";

		// used for clearing the field after changing the focus
		document.getElementById("titlu_eveniment").value = "";
		document.getElementById("ora_de_inceput").value = "0:00";
		document.getElementById("ora_de_sfarsit").value = "0:00";
		document.getElementById("description").value = "";
	  }
	}
}


// preia elemenetele existente pentru o zi anume
function preluareEvenimenteExistente(){
	var xhttp = new XMLHttpRequest();
   
	xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);

			var text = this.responseText;
			var obj =JSON.parse(text);

			console.log("text")
			//console.log(obj.result[0])
			document.getElementById("evenimente_existente").innerHTML = ""; 

			for (var i=0; i<obj.result.length; i++)
			{
				console.log(obj.result[i])
				//document.getElementById("evenimente_existente").innerHTML += obj.result[i].titlu
				document.getElementById("evenimente_existente").innerHTML += "<div class=\"eveniment_interior\">" +
				"<b><label>id: </lable>" + (i+1) + "</b><br/>" + 				
				"<label><b>Titlu:  </b></lable>" + obj.result[i].titlu + "<br/>" + 
				"<label><b>Ora inceput:  </b></lable>" + obj.result[i].ora_inceput + "<br/>" + 
				"<label><b>Ora sfarsit:  </b></lable>" + obj.result[i].ora_sfarsit + "<br/>" + 
				"<label><b>Descriere:  </b></lable>" + obj.result[i].descriere + "<br/>" + 
				"</div>"

			}

        }
    };

	// preluare date despre eveniment/task
	var zi = document.getElementById("zi_aleasa").value
	var luna = document.getElementById("luna_selectata").value
	var an = document.getElementById("an_selectat").value


	console.log("ziua: " + zi)

	var date_json = {
		zi: zi,
		luna: luna,
		an: an
	}

	console.log("apasat")

    xhttp.open("POST", "/preluare_evenimente_existente", true);
	xhttp.setRequestHeader('Content-Type', 'application/json')
	xhttp.send(JSON.stringify(date_json));
}

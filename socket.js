var net = require('net');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var HOST = '127.0.0.1'; // for TNC
var PORT = 8001; //For TNC

var client = new net.Socket();




//TNC portion

client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 


});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {


    //console.log('DATA: ' + data);
    buff = new Buffer(data, 'hex');
    buff2 = new Buffer(data, 'hex');
	//console.log ("length" + buff.length);
	var lastHeaderByte = 0;
	for (i = 1; i < buff.length; i++) { 
	   // console.log ("Last: "+ i + ": " + buff[i] + " Compared: " +  (buff[i] & 0x01));
	  //  console.log ("Last2: "+ i + ": " + buff[i] + " Compared: " +  (buff[i] & 0x80));
		if (buff[i] & 0x01){
			lastHeaderBytes = i;
			break;
		}
	}
//console.log ("last header: " + lastHeaderBytes);

//console.log (buff);

	for (i = 0; i <= lastHeaderBytes; i++) { 
		//console.log (i + " : " + buff[i] + "  " + buff[i]>>1);
	    buff[i] = (buff[i]>>1);

	}

//console.log (buff);

	var HeaderInfo = new Object;
	data2 = String.fromCharCode.apply(null, new Uint8Array(buff, 1, lastHeaderByte));
	HeaderInfo["Destination"] = data2.substring (1, 8).trim ();
	//HeaderInfo["Destination_SSID"] = h2d(stringToHex(data2.substring (8, 9)).substring (1, 2));
	HeaderInfo["Destination_SSID"] =  h2d(buff.toString ('hex',8, 9).substring (1, 2));
//HeaderInfo["Info"] = data.toString('utf8', datastart, data.length);
	
	HeaderInfo["Source"] = data2.substring (9, 15).trim ();
	//HeaderInfo["Source_SSID"] = h2d(stringToHex(data2.substring (15, 16)).substring (1, 2));
	HeaderInfo["Source_SSID"] =  h2d(buff.toString ('hex',15, 16).substring (1, 2));
/*need some SSID tricks 
https://www.tapr.org/pdf/AX25.2.2.pdf page 21

ssid is the lower half of the byte
XXXSSID0 >> 0CXXSSID
			C Bit is the command/response bit of an AX.25 frame, as outlined in Section 6.1.2.
			for the digipeater section this bit specifies if the frame has been repeated
*/
HeaderInfo["Digipeaters"] = new Object ();

	for (i = 1; i <=((lastHeaderBytes - 15) / 7); i++) { 
		var Digipeater = {
			callsign: data2.substring (9+i*7, 15+i*7).trim (),
			ssid:  h2d(stringToHex(data2.substring (15+i*7, 16+i*7)).substring (1, 2))
		};
			//console.log ("Last SSID bit: " + (16+i*7) + " header end " + lastHeaderBytes);
		//HeaderInfo["LastSSID"] = (16+i*7);
		HeaderInfo["Digipeaters"][i-1] = Digipeater;

	}



   // console.log( data.toString('hex',0,5)); // encoding defaults to 'utf8', outputs abcde
datastart =0;
	for (i = 0; i <= data.length; i++) { 
		//console.log (d2h(i) + ": " +   stringToHex(data.substring (i, i+1)));
		if ( data.toString('hex',i,i+1) == "03"){

			//console.log ("found 03");
			datastart =i;
		}
		if (data.toString('hex',i,i+1) == "f0" && (datastart+1 == i)){

			//console.log ("found f0");
			datastart =i+1;
			//break; //save cycles
		}
		
	}
//console.log ("data start: " + datastart);
//HeaderInfo["DataStart"] = datastart;



HeaderInfo["ControlCalcStart"] = lastHeaderBytes+ 1;

//HeaderInfo["ControlCalcStart2"] = d2h(HeaderInfo["LastSSID"]);


//HeaderInfo["PID"] = data.substring (lastHeaderBytes+ 2, lastHeaderBytes + 3);
HeaderInfo["Info"]; 
HeaderInfo["FCS"];
HeaderInfo["FrameOK"];
HeaderInfo["Info"] = data.toString('utf8', datastart, data.length);


/*
http://www.aprs.org/doc/APRS101.PDF page 27 data type id

sameple data

'  Covered in AX.25 decoding           ' Start of APRS info

! position data w/o timestamp w/o messaging
/ position w/ timestamp w/o messaging
= posistion w/o timestamp w/ messaging
@ position w/ timestamp w/ messaging

$ raw gps
: message
; object
? query
{ user defined format

mic-e forms, harder to decode
0x1c current Rev 0 beta
0x1d old Rev 0 beta
' old format, current for TM-D700
KB1YHW-9>EBDS6S,K2PUT-15*,WIDE2-1,qAR,WB2ZII-15:`e.Wl7HK\]"5j}mobile= 





*/
console.log ("Datatype: " + data.toString('utf8', datastart, datastart+1));

		HeaderInfo["SystemTimeStamp"] = "Not yet";

switch(data.toString('utf8', datastart, datastart+1)) {
	case "!":
		//position w/o time or messaging
		HeaderInfo["MessageCapable"] = "False";
		HeaderInfo["PacketTimeStamp"] = null;


		var NextStart = 1;
		var prefix;
		if( data.toString('utf8', datastart+NextStart+7, datastart+NextStart+8) == "S" ) {
			prefix="-";
		}else{
			prefix = "";
		}
		HeaderInfo["Latitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart, datastart+NextStart+2) + " " + data.toString('utf8', datastart+NextStart+2, datastart+NextStart+7) 
		}

		HeaderInfo["SymbolTable"] = data.toString('utf8', datastart+NextStart+8, datastart+NextStart+9);


		var prefix;
		if( data.toString('utf8', datastart+NextStart+17, datastart+NextStart+18) == "W" ) {
			prefix="-";
		}else{
			prefix = "";
		}

		HeaderInfo["Longitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart+9, datastart+NextStart+12) + " " + data.toString('utf8', datastart+NextStart+12, datastart+NextStart+17)
		}




	break;

	case "/":
		//position w/ time w/o messaging

		HeaderInfo["MessageCapable"] = "False";

//parseFloat ();




		//AB1JC-9>APTT4,W1MRA*,WIDE2-1,qAR,AB2NE:/113644h4225.90N/07135.55W>203/068/A=000368!wO?!
		//KB1WLW-10>MIKEM,WIDE1-1,WIDE2-1,TEMP,qAR,WB2ZII-15:/000000h4110.25N/07319.73W`Rolnick Observatory
/*
		6 byte for time format defined by identifiyer below
		1 byte for format
			z DDHHMM utc time
			/ DDHHMM local time
			h HHMMSS utc time
			other MM DD HH MM
		
		8 bytes Latitude
		1 byte symbol table
		9 bytes Longitude
*/

//data.toString('utf8', datastart+1, datastart+7)


var NextStart = 0;
		switch (data.toString('utf8', datastart+7, datastart+8)){
			case "z":
				HeaderInfo["PacketTimeStamp"] = {
					Day: data.toString('utf8', datastart+1, datastart+3),
					Hour: data.toString('utf8', datastart+3, datastart+5),
					Minutes: data.toString('utf8', datastart+5, datastart+7),
					Offset: 0
				};
				NextStart = 8;
			break;


			case "/":


				HeaderInfo["PacketTimeStamp"] = {
					Day: data.toString('utf8', datastart+1, datastart+3),
					Hour: data.toString('utf8', datastart+3, datastart+5),
					Minutes: data.toString('utf8', datastart+5, datastart+7),
					Offset: (new Date().getTimezoneOffset()/60)
				};
				NextStart = 8;

			break;

			case "h":

				HeaderInfo["PacketTimeStamp"] = {
					Hour: data.toString('utf8', datastart+1, datastart+3),
					Minutes: data.toString('utf8', datastart+3, datastart+5),
					Seconds: data.toString('utf8', datastart+5, datastart+7),
					Offset: 0
				};
				NextStart = 8;
			break;

			default:

				HeaderInfo["PacketTimeStamp"] = {
					Month: data.toString('utf8', datastart+1, datastart+3),
					Day: data.toString('utf8', datastart+3, datastart+5),
					Hours: data.toString('utf8', datastart+5, datastart+7),
					Minutes: data.toString('utf8', datastart+7, datastart+9),
					Offset: 0
				};
				NextStart = 10;
			break;
		}
		//HeaderInfo["PacketTimeStamp"] = data.toString('utf8', datastart+7, datastart+8);

				var prefix;
		if( data.toString('utf8', datastart+NextStart+7, datastart+NextStart+8) == "S" ) {
			prefix="-";
		}else{
			prefix = "";
		}

	


		HeaderInfo["Latitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart, datastart+NextStart+2) + " " + data.toString('utf8', datastart+NextStart+2, datastart+NextStart+7) 
		}

		HeaderInfo["SymbolTable"] = data.toString('utf8', datastart+NextStart+8, datastart+NextStart+9);
		var prefix;
		if( data.toString('utf8', datastart+NextStart+17, datastart+NextStart+18) == "W" ) {
			prefix="-";
		}else{
			prefix = "";
		}
		HeaderInfo["Longitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart+9, datastart+NextStart+12) + " " + data.toString('utf8', datastart+NextStart+12, datastart+NextStart+17)
		}
		




	break;

	case "=":
		//position w/o time w/ messaging
		HeaderInfo["MessageCapable"] = "True";
		HeaderInfo["PacketTimeStamp"] = null;
		//N1NKM-15>APU25N,TCPIP*,qAC,T2NUENGLD:=4117.99N/07257.94W-PHG02304/N1NKM New Haven's IGATE {UIV32N}

		var NextStart = 1;


		var prefix;
		if( data.toString('utf8', datastart+NextStart+7, datastart+NextStart+8) == "S" ) {
			prefix="-";
		}else{
			prefix = "";
		}



		HeaderInfo["Latitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart, datastart+NextStart+2) + " " + data.toString('utf8', datastart+NextStart+2, datastart+NextStart+7) 
		}

		HeaderInfo["SymbolTable"] = data.toString('utf8', datastart+NextStart+8, datastart+NextStart+9);


		var prefix;
		if( data.toString('utf8', datastart+NextStart+17, datastart+NextStart+18) == "W" ) {
			prefix="-";
		}else{
			prefix = "";
		}

		HeaderInfo["Longitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart+9, datastart+NextStart+12) + " " + data.toString('utf8', datastart+NextStart+12, datastart+NextStart+17)
		}




	break;

	case "@":
		//position w/ time and messaging
		HeaderInfo["MessageCapable"] = "True";
		HeaderInfo["PacketTimeStamp"] = "Not Yet";


		var NextStart = 0;
		switch (data.toString('utf8', datastart+7, datastart+8)){
			case "z":
				HeaderInfo["PacketTimeStamp"] = {
					Day: data.toString('utf8', datastart+1, datastart+3),
					Hour: data.toString('utf8', datastart+3, datastart+5),
					Minutes: data.toString('utf8', datastart+5, datastart+7),
					Offset: 0
				};
				NextStart = 8;
			break;


			case "/":


				HeaderInfo["PacketTimeStamp"] = {
					Day: data.toString('utf8', datastart+1, datastart+3),
					Hour: data.toString('utf8', datastart+3, datastart+5),
					Minutes: data.toString('utf8', datastart+5, datastart+7),
					Offset: (new Date().getTimezoneOffset()/60)
				};
				NextStart = 8;

			break;

			case "h":

				HeaderInfo["PacketTimeStamp"] = {
					Hour: data.toString('utf8', datastart+1, datastart+3),
					Minutes: data.toString('utf8', datastart+3, datastart+5),
					Seconds: data.toString('utf8', datastart+5, datastart+7),
					Offset: 0
				};
				NextStart = 8;
			break;

			default:

				HeaderInfo["PacketTimeStamp"] = {
					Month: data.toString('utf8', datastart+1, datastart+3),
					Day: data.toString('utf8', datastart+3, datastart+5),
					Hours: data.toString('utf8', datastart+5, datastart+7),
					Minutes: data.toString('utf8', datastart+7, datastart+9),
					Offset: 0
				};
				NextStart = 10;
			break;
		}
		//HeaderInfo["PacketTimeStamp"] = data.toString('utf8', datastart+7, datastart+8);

		var prefix;
		if( data.toString('utf8', datastart+NextStart+7, datastart+NextStart+8) == "S" ) {
			prefix="-";
		}else{
			prefix = "";
		}


		HeaderInfo["Latitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart, datastart+NextStart+2) + " " + data.toString('utf8', datastart+NextStart+2, datastart+NextStart+7) 
		}

		HeaderInfo["SymbolTable"] = data.toString('utf8', datastart+NextStart+8, datastart+NextStart+9);
		var prefix;
		if( data.toString('utf8', datastart+NextStart+17, datastart+NextStart+18) == "W" ) {
			prefix="-";
		}else{
			prefix = "";
		}

		HeaderInfo["Longitude"] = {
			DDM:prefix + data.toString('utf8', datastart+NextStart+9, datastart+NextStart+12) + " " + data.toString('utf8', datastart+NextStart+12, datastart+NextStart+17)
		}
		





	break;

}


if (typeof HeaderInfo["Longitude"] != 'undefined') {

		HeaderInfo["Longitude"]["DD"] = (parseFloat(HeaderInfo["Longitude"]["DDM"].split(' ')[0])+parseFloat(HeaderInfo["Longitude"]["DDM"].split(' ')[1])/60).toFixed(6);
		HeaderInfo["Latitude"]["DD"] = (parseFloat(HeaderInfo["Latitude"]["DDM"].split(' ')[0])+parseFloat(HeaderInfo["Latitude"]["DDM"].split(' ')[1])/60).toFixed(6);

}



		//if (data.toString('hex',i,i+1) == "f0" && (datastart+1 == i)){
	//console.log ("DATA P" + data.substring (lastHeaderByte, data.length));

	//console.log (data);
console.log (HeaderInfo);


io.emit ('packet', HeaderInfo);
	//console.log (data.substring(datastart, data.length));

    // Close the client socket completely
    //client.destroy();




});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});






//http and websocket

http.listen(3000, function(){
  console.log('listening on *:3000');
});


app.get('/', function(req, res){
//  res.sendfile('index.html');
  res.sendfile(__dirname + '/index.html');

});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



//general functions
function d2h(d) {
    return d.toString(16);
}
function h2d (h) {
    return parseInt(h, 16);
}
function stringToHex (tmp) {
	//console.log ("input String: " + tmp);
    var str = '',
        i = 0,
        tmp_len = tmp.length,
        c;
    
    for (; i < tmp_len; i += 1) {
        c = tmp.charCodeAt(i);
        str += d2h(c) + ' ';
    }
	//console.log ("outpt String: " + str);
    return str;
}
function hexToString (tmp) {
    var arr = tmp.split(' '),
        str = '',
        i = 0,
        arr_len = arr.length,
        c;
    
    for (; i < arr_len; i += 1) {
        c = String.fromCharCode( h2d( arr[i] ) );
        str += c;
    }
    
    return str;
}

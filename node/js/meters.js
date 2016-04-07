var socket;
var websocketServer = 'localhost';
	socket = io.connect( 'http://' + websocketServer + ':3000');
	init_socket ();


$(function() {
    // run the currently selected effect

	$( ".meter" ).click(meter_dblclick_handler);

	//  var socket = io();

    
});


function init_socket (){
	socket.on('packet', function (data) {
		console.log ("Got message");
		console.log (data);

		if (typeof data.Latitude != 'undefined') {
			var append_data = data["Source"] + " "+ data.Latitude.DDM + " " + data.Longitude.DDM + "<br />";
			$( "#log_data" ).append (append_data);
		}




	});
	socket.on('data', function (data) {
		console.log ("Got message2");

	});


  socket.on('connect', function () {
	console.log ("websocket connected");
    socket.emit('hi!');
  });

}



function meter_dblclick_handler (){

	console.log ();
		$( ".meter" ).each(function( index ) {
			$( this ).addClass( "hidden" );
		});




		$( this ).removeClass( "meter" );
		$( this ).addClass( "fullscreen_meter" );
//      	$( this ).show( "scale", { percent: 100 }, 500);
			$( this ).removeClass( "hidden" );	
		setTimeout(function() {
				$( ".fullscreen_meter" ).removeClass( "hidden" );
				$( ".fullscreen_meter" ).removeAttr( "style" );


			  }, 1000 );

		$( this ).click(fullscreen_meter_dblclick_handler);

}


function fullscreen_meter_dblclick_handler (){

		
			$( ".meter" ).each(function( index ) {
				$( this ).removeClass( "hidden" );
				$( this ).removeAttr( "style" );
			});

			$( this ).removeClass( "hidden" );
			$( this ).removeClass( "fullscreen_meter" );
			$( this ).addClass( "meter" );

		
	$( this ).click(meter_dblclick_handler);
			$( this ).removeAttr( "style" );
}

var SerialPort = require("serialport").SerialPort
var FS = require('fs');
var FileData;



var port = new SerialPort('/dev/ttyUSB0', {
  baudrate: 19200
}, false);

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  console.log ("port opened");
  FS.readFile('data.txt', 'utf8', function(err, data) {
      if (err) throw err;
    //  console.log('File has been read:', data);
      FileData = data.split ("\n");
      writeData (0);

  });
});



function writeData(lineNumber){

    console.log ("write data: ", lineNumber, FileData[lineNumber]);
  if (lineNumber>=FileData.length){
    return; //done
  }
  port.write(FileData[lineNumber] + "\n");
  setTimeout (writeData, 1500, (lineNumber+1));


}

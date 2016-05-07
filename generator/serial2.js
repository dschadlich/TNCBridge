var SerialPort = require("serialport").SerialPort




var port = new SerialPort('/dev/ttyUSB0', {
  baudrate: 19200
}, false);

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }

  // errors will be emitted on the port since there is no callback to write
  writeData();
});



function writeData(){
  port.write('/161727h4056.32N/07225.61WO212/012/A=011977!w4N!\n');
}

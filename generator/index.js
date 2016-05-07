var SerialPort = require('serialport').SerialPort;
var port = new SerialPort('/dev/ttyUSB0', function () {
  port.write('APRS TEST\n', function(err, bytesWritten) {
    if (err) {
      return console.log('Error: ', err.message);
    }
    console.log(bytesWritten, 'bytes written');
  });
});

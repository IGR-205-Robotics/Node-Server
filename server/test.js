const { Marvelmind } = require('./marvelmind');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const marvelmind = new Marvelmind({ debug: false, paused: true });
marvelmind.toggleReading();

// marvelmind.on('rawDistances', (hedgehogAddress, beaconsDistances) => {
//   console.log('rawDistances', hedgehogAddress, beaconsDistances);
// });
marvelmind.on('hedgehogMilimeter', (hedgehogAddress, hedgehogCoordinates) => {
    console.log('hedgehogMilimeter', hedgehogAddress, hedgehogCoordinates);
});
// marvelmind.on('beaconsMilimeter', (beaconsCoordinates) => {
//   console.log('beaconsMilimeter', beaconsCoordinates);
// });
// marvelmind.on('quality', (hedgehogAddress, qualityData) => {
//   console.log('quality', hedgehogAddress, qualityData);
// });
// marvelmind.on('telemetry', (deviceAddress, telemetryData) => {
//   console.log('telemetry', deviceAddress, telemetryData);
// });

server.on('error', (err) => {
console.log(`server error:\n${err.stack}`);
server.close();
});

server.on('message', (msg, senderInfo) => {
console.log('Messages received '+ msg)
server.send("client msg received :" + msg,senderInfo.port,senderInfo.address,()=>{
console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`)
})
});

server.on('listening', () => {
const address = server.address();
console.log(`server listening on ${address.address}:${address.port}`);
});

server.bind(5500);
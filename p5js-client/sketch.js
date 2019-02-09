
var host = 'localhost:12345';
var oscWebSocket;
var statusMessage = 'not connected';
var receivedMessage = '';

let input;

function setup() {
  createCanvas(400, 400);

  let button = createButton('connect');
  button.position(250, 60);
  button.mousePressed(onConnectClick);

  input = createInput();
  input.position(80, 270);

  let buttonSend = createButton('send');
  buttonSend.position(250, 260);
  buttonSend.mousePressed(onSendClick);

  textSize(20);
  // connect to WebSocket server:
  oscWebSocket = new osc.WebSocketPort({
    url: "ws://localhost:12345",
    metadata: true
  });

  oscWebSocket.on("ready", onSocketOpen);
  oscWebSocket.on("message", onSocketMessage);
}

function draw() {
  background('#999999');
  fill(255);
  text('SERVER HOST:  ' + host, 50, 40);
  text(statusMessage, 50, 80);
  text(receivedMessage, 50, 150);
}

function onConnectClick() {
  oscWebSocket.open();
}

function onSendClick() {
  const msg = input.value();
  input.value('');

  // send the OSC message to server. (osc.js will convert it to binary packet):
  oscWebSocket.send({
    address: "/p5js/sayhi",
    args: [
      {
        type: "s",
        value: msg
      }
    ]
  });
}


function onSocketOpen(e) {
  print('server connected');
  statusMessage = 'server connected';
  
}

function onSocketMessage(message) {
  print(message);
  if (message) {
    receivedMessage = 'address: ' + message.address;

    if (message.args && message.args.length > 0) {
      receivedMessage += ', value: ' + message.args[0].value;
    }
  }

}
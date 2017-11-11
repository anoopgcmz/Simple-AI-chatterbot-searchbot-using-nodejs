const APIAI_TOKEN = ''; //dialogflow client ID
const APIAI_SESSION_TOKEN = '';//dialogflow developer ID
const google = require('google');
var express = require('express'); 
var app = express();


google.resultsPerPage = 1
var nextCounter = 0

/*app.get('/', function(req,res){
    res.send('Hello world');
});*/

app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));

const server = app.listen('3800');

const io = require('socket.io')(server);
io.on('connection',function(socket){
console.log('connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

app.get('/',function(req,res){
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    socket.on('chat message', (text) => {
      //console.log('Message: ' + text);

     //google scrap serach function.. uncomment this line to see search result

     google(text, function (err, res){
      if (err) console.error(err)
     
      for (var i = 0; i < res.links.length; ++i) {
        var link = res.links[i];
        var Svalue = link.description;
        //console.log(link.title + ' - ' + link.href)
        console.log(link.description + "\n");  
        socket.emit('bot search', Svalue);
        
      }
     
      if (nextCounter < 1) {
        nextCounter += 1
        if (res.next) res.next()
      }
     }) 
  
      // Get a reply from API.ai
  
      let apiaiReq = apiai.textRequest(text, {
        sessionId: APIAI_SESSION_TOKEN
      });
  
      apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
       // console.log('Bot reply: ' + aiText);
        socket.emit('bot reply', aiText);
      });
  
      apiaiReq.on('error', (error) => {
        console.log(error);
      });
  
      apiaiReq.end();
  
    });
  });

  function gsearch(text){
   
  }
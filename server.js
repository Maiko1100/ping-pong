var app = require("express")();
var mysql = require("./mysql");
var cache = require("./cache");
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  // res.sendFile(__dirname + '/index.html');
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});


io.on("connection", function(socket) {
  socket.on("score", function(id) {
    
    var storedCache = cache.getCache();
  
    if(storedCache[1].value.id == null || storedCache[2].value.id == null){
      io.emit("notCheckedIn", storedCache);
        console.log(storedCache[1].value.id  +"  "+ storedCache[2].value.id);
    } else{
      var cb = cache.scored(id);
    switch (cb) {
      case "1 won set":
        io.emit("wonSet", storedCache);
        break;
      case "2 won set":
        io.emit("wonSet", storedCache);
        break;
      case "1 won game":
        // mysql.setWinner(storedCache);
        io.emit("wonGame", storedCache);
        break;
      case "2 won game":
        // mysql.setWinner(storedCache);
        io.emit("wonGame", storedCache);
        break;
      default:
      io.emit("score", cb);
    }
  }
  });
});

io.on("connection", function(socket) {
  socket.on("playerCheckin", async function(msg) {
    console.log("checkedIn");
    var user = await mysql.getPlayer(msg.id);
    cache
      .setPlayer(user)
      .then(function(cache) {
        io.emit("playerCheckin", cache);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
});

http.listen(3002, function() {
  console.log("listening on *:3002");
});

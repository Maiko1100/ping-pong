var cache = require("memory-cache");

cache.put(1, { id: null, name: null, picture: null });
cache.put(2, { id: null, name: null, picture: null });
cache.put("currentSet", 1);
cache.put("currentSetdata", { 1: 0, 2: 0, service: null, won: null ,matchPoint: null});
cache.put("set1", { 1: 0, 2: 0, service: null, won: null, firstService: null , matchPoint: null});
cache.put("set2", { 1: 0, 2: 0, service: null, won: null , matchPoint: null});
cache.put("set3", { 1: 0, 2: 0, service: null, won: null , matchPoint: null});
cache.put("currentSetText",("set" + cache.get("currentSet")))

function getOpponent(playerId) {
  return playerId == 1 ? 2 : 1;
}
function setFirstService(currentSetText,currentSet, playerId) {
  
  cache.put(currentSetText, {
    ...currentSet,
    1: 0,
    2: 0,
    service: playerId,
    firstService: playerId
  });
}

function getCurrentSet() {
  return parseInt(cache.get("currentSet"));
}

function setNextSet() {
  cache.put("currentSet", parseInt(cache.get("currentSet") + 1));
}
function setService(playerScore, opponentScore, currentSet, currentSetText) {
  if (playerScore >= 20 && opponentScore >= 20) {
    var newService = getOpponent(currentSet.service);
    cache.put(currentSetText, { ...currentSet, service: newService });
  } else {
    if ((playerScore + opponentScore) % 5 == 0) {
      var newService = getOpponent(currentSet.service);

      cache.put(currentSetText, { ...currentSet, service: newService });
    }
  }
}
function checkIfWon(playerScore, opponentScore, playerId, currentSetText, currentSet) {
  if (
    (playerScore >= 21 && opponentScore <= playerScore - 2) ||
    (opponentScore >= 21 && playerScore <= opponentScore - 2)
  ) {

    cache.put(currentSetText, { ...currentSet, won: playerId });
    return true;
  }
}
function checkIfMatchpoint(playerScore, opponentScore, playerId, currentSetText, currentSet) {
  if (
    (playerScore >= 20 && opponentScore < playerScore - 1) ||
    (opponentScore >= 20 && playerScore <= opponentScore - 1)
  ) {
    
    cache.put(currentSetText, { ...currentSet, matchPoint: playerId });
  }
}

module.exports = {
  scored: function(player) {
    console.log("kom in scored");
    var playerId = player.id;
    cache.put("currentSetText","set" + cache.get("currentSet")); 
    var currentSetText = "set" + cache.get("currentSet");

    cache.put(currentSetText, {
      ...cache.get(currentSetText),
      [playerId]: cache.get(currentSetText)[playerId] + 1
    });

    var currentSet = cache.get(currentSetText);
    var opponentId = getOpponent(playerId);
    var playerScore = currentSet[playerId];
    var opponentScore = currentSet[opponentId];

    if (getCurrentSet() == 1 && currentSet.service == null) {
      setFirstService(currentSetText, currentSet, playerId);
    } else {

      setService(playerScore, opponentScore, currentSet, currentSetText);
      
      checkIfMatchpoint(playerScore, opponentScore, playerId, currentSetText, currentSet);
      if (checkIfWon(playerScore, opponentScore, playerId, currentSetText, currentSet)) {
        var set = parseInt(cache.get("currentSet"));

        if (set == 1) {
            setNextSet();
            setFirstService(currentSet,
                getOpponent(cache.get(cache.get("set1").firstService))
              );
          return playerId + " won set";
        } else if (set == 2) {
          var firstSetWon = cache.get("set1").won;
          if (firstSetWon == cache.get("set" + cache.get("currentSet")).won) {
            return playerId + " won game";
          } else {
            setNextSet();
            setFirstService(
              cache.get("set1").firstService
            );
          }
        } else if (set == 3) {
          return playerId + " won game";
        }
      }
    }
    cache.put("currentSetdata", cache.get(currentSetText));

    return JSON.parse(cache.exportJson());
  },

  setPlayer: function(user) {
    var player1 = cache.get("1");
    var player2 = cache.get("2");
    return new Promise(function(resolve, reject) {
      if (player1.id == null) {
        cache.put("1", { id: user.id, name: user.name });
        resolve(JSON.parse(cache.exportJson()));
      } else if (player2.id == null) {
        if (user.id == player1.id) {
          reject("user is already in the game");
        } else {
          cache.put("2", { id: user.id, name: user.name });
          resolve(JSON.parse(cache.exportJson()));
        }
      } else {
        reject("Game is full");
      }
    });
  },
  getCache: function() {
    return JSON.parse(cache.exportJson());
  }
};

const isValidReqBodyFormat = function(paramsKeys,req) {
  let reqParams = Object.keys(req.body);
  return paramsKeys.every(function(key){
    return reqParams.includes(key) && req.body[key];
  });
};

const verifyCreateGameReq = function(req,res,next) {
  if(!isValidReqBodyFormat(['gameName','playerName'],req)){
    res.statusCode = 400 ;
    res.json({gameCreated:false,message:'bad request'});
    res.end();
    return;
  }
  next();
};

const hasCreatedGame = function(req){
  let game = req.app.gamesManager.getGame(req.cookies.gameName);
  return game && game.doesPlayerExist(req.cookies.playerName);
};

const blockIfUserHasGame = function(req,res,next){
  if(hasCreatedGame(req)) {
    res.json({gameCreated:true});
    res.end();
    return;
  }
  next();
};

const resWithGameCreated = function(res,gameName,playerName) {
  res.cookie('gameName',gameName,{path:''});
  res.cookie('playerName',playerName,{path:''});
  res.json({gameCreated:true});
  res.end();
};

const resGameAlreadyExists = function(res) {
  res.json({gameCreated:false,message:'game name already taken'});
  res.end();
};

const createNewGame = function(req,res) {
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName;
  let playerName = req.body.playerName;
  if(gamesManager.doesGameExists(gameName)){
    return resGameAlreadyExists(res);
  }
  let game = gamesManager.addGame(gameName);
  game.addPlayer(playerName);
  resWithGameCreated(res,gameName,playerName);
};

const joinPlayerToGame = function(req,res){
  if(!isValidReqBodyFormat(['gameName','playerName'],req)){
    res.statusCode = 400 ;
    res.json({status:false,message:'bad request'});
    res.end();
    return;
  }
  let gamesManager = req.app.gamesManager;
  let gameName = req.body.gameName.trim();
  let playerName = req.body.playerName.trim();
  if(!gamesManager.doesGameExists(gameName)){
    res.statusCode = 400 ;
    res.json({status:false,message:'game dosen\'t exist'});
    res.end();
    return;
  }
  if(playerName.length > 8){
    res.statusCode = 400 ;
    res.json({status:false,message:'player name is lengthy'});
    res.end();
    return;
  }
  let joiningStatus = gamesManager.addPlayerTo(gameName,playerName);
  if (joiningStatus) {
    res.cookie('gameName',gameName,{path:''});
    res.cookie('playerName',playerName,{path:''});
  }
  res.json({status:joiningStatus});
  res.end();
};

const moveCoin = function(req,res){
  let coinToMove = req.body.coinId;
  if (req.game.moveCoin(coinToMove)) {
    let status = req.game.getStatus();
    status.status = true;
    res.send(status);
    return;
  }
  res.send({status:false,message:`Coin can't be moved`});
};

module.exports = {
  blockIfUserHasGame,
  createNewGame,
  joinPlayerToGame,
  verifyCreateGameReq,
  moveCoin
};

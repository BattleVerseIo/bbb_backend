const express = require('express'),
  path = require('path'),
  cors = require('cors'),

  JSONdb = require('simple-json-db'),
  mongoose = require('mongoose'),

  dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json'),
  dbIpfsHashesShrooms = new JSONdb('./db/ipfs_hashes_shrooms.json'),

  dbTraitsBots = new JSONdb('./db/traits_bots.json'),
  dbTraitsShrooms = new JSONdb('./db/traits_shrooms.json'),
  dbTraitsDummies = new JSONdb('./db/traits_dummies.json'),

  dbStatsBots = new JSONdb('./db/stats_bots.json'),
  dbStatsShrooms = new JSONdb('./db/stats_shrooms.json'),
  dbStatsDummies = new JSONdb('./db/stats_dummies.json'),

  dbPlatforms = new JSONdb('./db/platforms.json'),

  dbIpfsHashesPrizes = new JSONdb('./db/ipfs_hashes_prizes.json'),
  dbIpfsHashesPrizesPreviews = new JSONdb('./db/ipfs_hashes_prizes_previews.json'),
  dbWinnerCategories = new JSONdb('./db/winner_categories.json'),
  dbWalletAddresses = new JSONdb('./db/wallet_addresses.json'),

  revealIsActive = true,
  placeholderIpfsHash = 'QmchQaQQ9CMwV3nDLBvcgqn1td3mAd4gf3hzqwPB3Q9hyP',

  PORT = process.env.PORT || 5000,

  app = express()
    .set('port', PORT)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')


app.use(cors());
app.use(express.json())

app.get('/', function (req, res) {
  res.send('All_is up');
})

mongoose.connect("mongodb+srv://VictorSoltan:Password1!@cluster0.dc7dp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (err) => {
  if(!err) console.log('db connected')
  else console.log(err)
})

const Stat = new mongoose.Schema({
  wallet: String,
  logs: Array 
})

const NewModel = new mongoose.model("userStats", Stat)

function getStat(db, type, traits) {
  result = false;
  statsAll = db.get(type);

  traits.forEach(trait => {
    foundStat = statsAll.find(function(stat, index){
      if(trait.trait_type == type && stat.item == trait.value) return true;
    });

    if(typeof foundStat !== 'undefined') result = foundStat;
  });

  return result ? result.force : -1;
}

function getStatAttack(db, type, traits) {
  result = false;
  statsAll = db.get(type);

  traits.forEach(trait => {
    foundStat = statsAll.find(function(stat, index){
      if(trait.trait_type == type && stat.item == trait.value) return true;
    });

    if(typeof foundStat !== 'undefined') result = foundStat;
  });

  return result ? result.attack : -1;
}

function getStatSelfBoost(db, type, traits) {
  result = false;
  statsAll = db.get(type);

  traits.forEach(trait => {
    foundStat = statsAll.find(function(stat, index){
      if(trait.trait_type == type && stat.item == trait.value) return true;
    });

    if(typeof foundStat !== 'undefined') result = foundStat;
  });

  return result ? result.selfBoost : -1;
}

app.get('/bot/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  traits = dbTraitsBots.get(tokenId);

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(getStat(dbStatsBots, "Weapon", traits))});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(getStat(dbStatsBots, "Toy", traits))});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(getStat(dbStatsBots, "Head", traits))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Attack", "value": Math.round(getStatAttack(dbStatsBots, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Defence", "value": Math.round(getStatAttack(dbStatsBots, "Toy", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Trick", "value": Math.round(getStatAttack(dbStatsBots, "Head", traits))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Attack", "value": Math.round(getStatSelfBoost(dbStatsBots, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Defence", "value": Math.round(getStatSelfBoost(dbStatsBots, "Toy", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Trick", "value": Math.round(getStatSelfBoost(dbStatsBots, "Head", traits))});  

  traits.push({"trait_type": "Health", "value": 100});

  let tokenDetails = {
    description: "Baby Combat Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Baby Combat Bot #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon',
    },
    alpha_125: 'https://battleverse.storage.googleapis.com/bots_alpha_125/a_'+tokenId+'.png',
    alpha_500: 'https://battleverse.storage.googleapis.com/bots_alpha_500/a_'+tokenId+'.png'
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);

  for(let x = 0; x<4; x++) traits.pop();
})

app.get('/shroom/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashesShrooms.get(tokenId);
  traits = dbTraitsShrooms.get(tokenId);

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(getStat(dbStatsShrooms, "Weapon", traits))});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(getStat(dbStatsShrooms, "Tools", traits))});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(getStat(dbStatsShrooms, "Head", traits))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Attack", "value": Math.round(getStatAttack(dbStatsShrooms, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Defence", "value": Math.round(getStatAttack(dbStatsShrooms, "Tools", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Trick", "value": Math.round(getStatAttack(dbStatsShrooms, "Head", traits))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Attack", "value": Math.round(getStatSelfBoost(dbStatsShrooms, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Defence", "value": Math.round(getStatSelfBoost(dbStatsShrooms, "Tools", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Trick", "value": Math.round(getStatSelfBoost(dbStatsShrooms, "Head", traits))}); 

  traits.push({"trait_type": "Health", "value": 100});

  let tokenDetails = {
    description: "First generation of Battle Shrooms — a collection of procedurally generated mushrooms race ready to fight in BattleVerse!",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Battle Shroom #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_125: 'https://battleverse.storage.googleapis.com/shrooms_alpha_125/a_'+tokenId+'.png',
    alpha_500: 'https://battleverse.storage.googleapis.com/shrooms_alpha_500/a_'+tokenId+'.png'
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);

  for(let x = 0; x<4; x++) traits.pop();
})

app.get('/dummy/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashesShrooms.get(tokenId);
  traits = dbTraitsDummies.get(tokenId);

  weaponPower = getStat(dbStatsDummies, "Weapon", traits);
  toolPower = getStat(dbStatsDummies, "Tools", traits)
  trickPower = getStat(dbStatsDummies, "Head", traits)

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(weaponPower)});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(toolPower)});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(trickPower)});

  let traitForResist

  traits.forEach(trait => {
    if(trait.trait_type == "Tools"){
      traitForResist = trait.value
    }
  })

  traits.push({"trait_type": "Health", "value": 100});

  let tokenDetails = {
    description: "",
    image: '',
    name: '',
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_125: '',
    alpha_500: ''
  };

  if (revealIsActive) {
    // tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    // tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);

  traits.pop();
  traits.pop();
  traits.pop();
  traits.pop();
})

app.get('/platforms', function (req, res) {
  res.send(dbPlatforms.storage);
})

app.get('/prize/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const winnerCategory = dbWinnerCategories.get(tokenId).toString();
  const ipfsAnimationHash = dbIpfsHashesPrizes.get(winnerCategory);
  const ipfsPreviewHash = dbIpfsHashesPrizesPreviews.get(winnerCategory);
  const traitType = {
    "non_owner": "Iridescent",
    "owner_1": "White Carbon",
    "owner_2": "Purple",
    "owner_3": "Gold",
    "owner_5": "Gem",
    "first": "Hexagon Awesomness"
  }

  let tokenDetails = {
    description: "Baby Combat Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://ipfs.io/ipfs/' + ipfsPreviewHash,
    animation_url: 'https://gateway.pinata.cloud/ipfs/' + ipfsAnimationHash,
    name: 'Puzzle Prize #' + tokenId,
    attributes: {
      'Type': traitType[winnerCategory]
    }
  };

  res.send(tokenDetails);
})

app.post('/sendDataAboutBug', async function (req, res) {
  let wallet = req.body.wallet;
  const user = await NewModel.findOne({ wallet: wallet });
  const isoStr = new Date().toISOString();

  if(user){
    console.log('exist')
    user.logs.push({time: isoStr, logs: req.body.data})
    user.save()
  }else{
    console.log("doesn't exist")
    const data = NewModel({
      wallet: req.body.wallet, 
      logs: {time: isoStr, logs: req.body.data}
    })
    data.save()
  }
})

app.get('/logs', async function (req, res) {
  const logs = await NewModel.find({});
  res.send(logs);
})

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "");
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
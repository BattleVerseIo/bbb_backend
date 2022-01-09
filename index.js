const express = require('express'),
  path = require('path'),
  cors = require('cors'),

  JSONdb = require('simple-json-db'),

  dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json'),
  dbIpfsHashesShrooms = new JSONdb('./db/ipfs_hashes_shrooms.json'),

  dbTraitsBots = new JSONdb('./db/traits_bots.json'),
  dbTraitsShrooms = new JSONdb('./db/traits_shrooms.json'),

  dbStatsBots = new JSONdb('./db/stats_bots.json'),
  dbStatsShrooms = new JSONdb('./db/stats_shrooms.json'),

  dbResistanceBots = new JSONdb('./db/resistance_bots.json'),
  dbResistanceShrooms = new JSONdb('./db/resistance_shrooms.json'),

  dbIpfsHashesPrizes = new JSONdb('./db/ipfs_hashes_prizes.json'),
  dbIpfsHashesPrizesPreviews = new JSONdb('./db/ipfs_hashes_prizes_previews.json'),
  dbWinnerCategories = new JSONdb('./db/winner_categories.json'),

  revealIsActive = true,
  placeholderIpfsHash = 'QmchQaQQ9CMwV3nDLBvcgqn1td3mAd4gf3hzqwPB3Q9hyP',

  PORT = process.env.PORT || 5000,

  getHeads = require('./googleSheetsService'),

  app = express()
    .set('port', PORT)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')


// Static public files
//app.use(express.static(path.join(__dirname, 'public')))

app.use(cors());

app.get('/', function (req, res) {
  res.send('All_is up');
})

let BotsHeader 
let ShroomsHeader = []

async function getGoogleSheetData(){
  await getHeads.one.then(result => BotsHeader = result);
  await getHeads.two.then(result => ShroomsHeader = result);
}

getGoogleSheetData()

function getStat(db, type, traits) {
  result = false;
  statsAll = db.get(type);

  traits.forEach(trait => {
    foundStat = statsAll.find(function(stat, index){
      if(trait.trait_type == type && stat.item == trait.value)
        return true;
    });

    if(typeof foundStat !== 'undefined')
      result = foundStat;
  });

  return result ? result.power : -1;
}

app.get('/bot/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  traits = dbTraitsBots.get(tokenId);

  weaponPower = getStat(dbStatsBots, "Weapon", traits);
  toyPower = getStat(dbStatsBots, "Toy", traits)

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": weaponPower});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": toyPower});
  
  let resist = dbResistanceBots.storage.Resistance
  let toyResist
  let traitForResist

  let traitHead 

  traits.forEach(trait => {
    if(trait.trait_type == "Toy"){
      traitForResist = trait.value
    }
  })
  
  traits.forEach(trait => {
    if(trait.trait_type == "Head"){
      traitHead = trait.value
    }
  })

  resist.forEach(elem => {
    if(traitForResist===elem.item){
      toyResist = elem.values
    }
  })

  
  BotsHeader.forEach(elem => {
    if(traitHead === elem.head){
      traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": elem.force});
    }
  })

  let tokenDetails = {
    description: "Baby Combat Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Baby Combat Bot #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon',
    },
    alpha_125: 'https://battleverse.storage.googleapis.com/bots_alpha_125/a_'+tokenId+'.png',
    alpha_500: 'https://battleverse.storage.googleapis.com/bots_alpha_500/a_'+tokenId+'.png',
    resistance: toyResist
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);

  traits.pop();
  traits.pop();
})

app.get('/shroom/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashesShrooms.get(tokenId);
  traits = dbTraitsShrooms.get(tokenId);

  weaponPower = getStat(dbStatsShrooms, "Weapon", traits);
  toolPower = getStat(dbStatsShrooms, "Tools", traits)

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": weaponPower});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": toolPower});

  let resist = dbResistanceShrooms.storage.Resistance
  let toyResist
  let traitForResist

  let traitHead 

  traits.forEach(trait => {
    if(trait.trait_type == "Tools"){
      traitForResist = trait.value
    }
  })
  
  traits.forEach(trait => {
    if(trait.trait_type == "Head"){
      traitHead = trait.value
    }
  })

  resist.forEach(elem => {
    if(traitForResist===elem.item){
      toyResist = elem.values
    }
  })

  ShroomsHeader.forEach(elem => {
    if(traitHead === elem.head){
      traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": elem.force});
    }
  })

  let tokenDetails = {
    description: "First generation of Battle Shrooms — a collection of procedurally generated mushrooms race ready to fight in BattleVerse!",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Battle Shroom #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_125: 'https://battleverse.storage.googleapis.com/shrooms_alpha_125/a_'+tokenId+'.png',
    alpha_500: 'https://battleverse.storage.googleapis.com/shrooms_alpha_500/a_'+tokenId+'.png',
    resistance: toyResist
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);

  traits.pop();
  traits.pop();
})

// app.get('/resistance_bots/', function (req, res) {
//   res.send(dbResistanceBots);
// })

// app.get('/resistance_shrooms/', function (req, res) {
//   res.send(dbResistanceShrooms);
// })

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

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
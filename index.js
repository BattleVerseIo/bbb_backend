const express = require('express'),
  path = require('path'),
  cors = require('cors'),

  JSONdb = require('simple-json-db'),

  dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json'),
  dbIpfsHashesShrooms = new JSONdb('./db/ipfs_hashes_shrooms.json'),

  dbTraitsBots = new JSONdb('./db/traits_bots.json'),
  dbTraitsShrooms = new JSONdb('./db/traits_shrooms.json'),
  dbTraitsDummies = new JSONdb('./db/traits_dummies.json'),

  dbStatsBots = new JSONdb('./db/stats_bots.json'),
  dbStatsShrooms = new JSONdb('./db/stats_shrooms.json'),
  dbStatsDummies = new JSONdb('./db/stats_dummies.json'),

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

app.get('/bot/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  traits = dbTraitsBots.get(tokenId);

  weaponPower = getStat(dbStatsBots, "Weapon", traits);
  toyPower = getStat(dbStatsBots, "Toy", traits)
  trickPower = getStat(dbStatsBots, "Head", traits)
  
  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(weaponPower)});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(toyPower)});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(trickPower)});

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

  traits.pop();
  traits.pop();
  traits.pop();
  traits.pop();
})

app.get('/shroom/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashesShrooms.get(tokenId);
  traits = dbTraitsShrooms.get(tokenId);

  weaponPower = getStat(dbStatsShrooms, "Weapon", traits);
  toolPower = getStat(dbStatsShrooms, "Tools", traits)
  toolPower = getStat(dbStatsShrooms, "Head", traits)

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(weaponPower)});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(toolPower)});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(toolPower)});

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

  traits.pop();
  traits.pop();
  traits.pop();
  traits.pop();
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

  // traits.forEach(trait => {
  //   if(trait.trait_type === "Attack"){
  //     traitHealth += trait.value
  //   }
  //   if(trait.trait_type === "Defence"){
  //     traitHealth += trait.value
  //   }
  //   if(trait.trait_type === "Trick"){
  //     traitHealth += trait.value
  //   }        
  // })

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

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "");
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
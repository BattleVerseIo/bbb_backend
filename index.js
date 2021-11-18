const express = require('express')
const path = require('path')
const cors = require('cors')

const JSONdb = require('simple-json-db');

const dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json');
const dbIpfsHashesShrooms = new JSONdb('./db/ipfs_hashes_shrooms.json');

const dbTraitsBots = new JSONdb('./db/traits_bots.json');
const dbTraitsShrooms = new JSONdb('./db/traits_shrooms.json');

const dbStatsBots = new JSONdb('./db/stats_bots.json');
const dbStatsShrooms = new JSONdb('./db/stats_shrooms.json');

const dbIpfsHashesPrizes = new JSONdb('./db/ipfs_hashes_prizes.json');
const dbIpfsHashesPrizesPreviews = new JSONdb('./db/ipfs_hashes_prizes_previews.json');
const dbWinnerCategories = new JSONdb('./db/winner_categories.json');

const revealIsActive = true;
const placeholderIpfsHash = 'QmchQaQQ9CMwV3nDLBvcgqn1td3mAd4gf3hzqwPB3Q9hyP';

const PORT = process.env.PORT || 5000

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
//app.use(express.static(path.join(__dirname, 'public')))

app.use(cors());

app.get('/', function (req, res) {
  res.send('All is up');
})

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
  traits.push({"display_type": "boost_number", "trait_type": "Defense", "value": toyPower});

  var tokenDetails = {
    description: "Baby Combat Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Baby Combat Bot #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_1: 'https://battleverse.storage.googleapis.com/bots_1/a_'+tokenId+'.png',
    alpha_2: 'https://battleverse.storage.googleapis.com/bots_2/a_'+tokenId+'.png',
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
  traits.push({"display_type": "boost_number", "trait_type": "Defense", "value": toolPower});

  var tokenDetails = {
    description: "First generation of Battle Shrooms — a collection of procedurally generated mushrooms race ready to fight in BattleVerse!",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Battle Shroom #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_1: 'https://storage.googleapis.com/battleverse/shrooms_1/a_'+tokenId+'.png',
    alpha_2: 'https://storage.googleapis.com/battleverse/shrooms_2/a_'+tokenId+'.png'
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

  var tokenDetails = {
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
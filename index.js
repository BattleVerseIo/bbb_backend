const express = require('express')
const path = require('path')
const cors = require('cors')

const JSONdb = require('simple-json-db');
const dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json');
const dbIpfsHashesShrooms = new JSONdb('./db/ipfs_hashes_shrooms.json');
const dbTraits = new JSONdb('./db/traits.json');
const dbTraitsShrooms = new JSONdb('./db/traits_shrooms.json');

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

app.get('/bot/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  const traits = dbTraits.get(tokenId);

  var tokenDetails = {
    description: "Baby Combat Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Baby Combat Bot #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_1: 'https://storage.googleapis.com/battleverse/bots_1/a_'+tokenId+'.png',
    alpha_2: 'https://storage.googleapis.com/battleverse/bots_2/a_'+tokenId+'.png'
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);
})

app.get('/shroom/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashesShrooms.get(tokenId);
  const traits = dbTraitsShrooms.get(tokenId);

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
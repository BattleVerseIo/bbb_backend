const express = require('express')
const path = require('path')

const JSONdb = require('simple-json-db');
const dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json');
const dbTraits = new JSONdb('./db/traits.json');

const revealIsActive = true;
const placeholderIpfsHash = 'QmchQaQQ9CMwV3nDLBvcgqn1td3mAd4gf3hzqwPB3Q9hyP';

const PORT = process.env.PORT || 5000

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
//app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.send('All is up');
})

app.get('/token/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  const traits = dbTraits.get(tokenId);

  var tokenDetails = {
    description: "Baby Battle Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://ipfs.io/ipfs/' + placeholderIpfsHash,
    name: 'Baby Battle Bot #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    }
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.ipfs_image = 'https://ipfs.io/ipfs/' + ipfsHash;
    tokenDetails.attributes = traits;
  }

  res.send(tokenDetails);
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
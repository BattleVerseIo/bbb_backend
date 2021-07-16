const express = require('express')
const path = require('path')

const JSONdb = require('simple-json-db');
const dbIpfsHashes = new JSONdb('./db/ipfs_hashes.json');
const dbTraits = new JSONdb('./db/traits.json');

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

  const tokenDetails = {
    description: "Baby Battle Bots is a collection of randomly generated and stylistically curated NFTs that exist on the Ethereum Blockchain. ",
    image: 'https://ipfs.io/ipfs/' + ipfsHash,
    ipfs_image: 'https://ipfs.io/ipfs/' + ipfsHash,
    name: 'Baby Battle Bot #' + tokenId,
    attributes: traits
  };

  res.send(tokenDetails);
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
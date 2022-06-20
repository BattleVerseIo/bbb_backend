
const express = require('express'),
  path = require('path'),
  cors = require('cors'),
  { Client } = require("@notionhq/client"),

  notion = new Client({ auth: "secret_wth3zVobb9hQpzTuvj9WtjNodiXu6VYd8EUHp1ayuxt" }),
  databaseId = "7120ba6f5cf94f2888f07e990097abcb",

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
  logId: Number,
  wallet: String,
  date: String,
  theme: Array,
  response: Array,
  user_Message: Array,
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

// function getStatAttack(db, type, traits) {
//   result = false;
//   statsAll = db.get(type);

//   traits.forEach(trait => {
//     foundStat = statsAll.find(function(stat, index){
//       if(trait.trait_type == type && stat.item == trait.value) return true;
//     });

//     if(typeof foundStat !== 'undefined') result = foundStat;
//   });

//   return result ? result.attack : -1;
// }

// function getStatSelfBoost(db, type, traits) {
//   result = false;
//   statsAll = db.get(type);

//   traits.forEach(trait => {
//     foundStat = statsAll.find(function(stat, index){
//       if(trait.trait_type == type && stat.item == trait.value) return true;
//     });

//     if(typeof foundStat !== 'undefined') result = foundStat;
//   });

//   return result ? result.selfBoost : -1;
// }

app.get('/bot/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  traits = dbTraitsBots.get(tokenId);
  console.log('traits ', traits)
  let HeadLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Heads/heads.'
    WeaponLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Weapons/icons_v02.icons.',
    ToysLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Toys/icons_v03.toys.',
    PlatformLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Platforms/platforms.',

  traits.forEach(el => {
    if(el.trait_type === 'Head'){
      if(el.value === 'Happy Cylinder') HeadLink += '0001.png'
      else if(el.value === 'Surprised Sphere') HeadLink += '0002.png'
      else if(el.value === 'Toothy') HeadLink += '0003.png'
      else if(el.value === 'Sad Pot') HeadLink += '0004.png'
      else if(el.value === 'Ninja') HeadLink += '0005.png'
      else if(el.value === 'Sucker') HeadLink += '0006.png'
      else if(el.value === 'Happy Speaker') HeadLink += '0007.png'
      else if(el.value === 'Crazy Skull') HeadLink += '0008.png'
    }
  })

  traits.forEach(el => {
    if(el.trait_type === 'Weapon'){
      if(el.value === 'Saw') WeaponLink += '0001.png'
      else if(el.value === 'Hammer') WeaponLink += '0002.png'
      else if(el.value === 'Axe') WeaponLink += '0003.png'
      else if(el.value === 'Lightnning') WeaponLink += '0004.png'
      else if(el.value === 'Club') WeaponLink += '0005.png'
      else if(el.value === 'Double Spike') WeaponLink += '0006.png'
      else if(el.value === 'Spike') WeaponLink += '0007.png'
      else if(el.value === 'Blade') WeaponLink += '0008.png'
    }
  })

  traits.forEach(el => {
    if(el.trait_type === 'Toy'){
      if(el.value === 'Ball') ToysLink += '0001.png'
      else if(el.value === 'Drum') ToysLink += '0002.png'
      else if(el.value === 'Icecream') ToysLink += '0003.png'
      else if(el.value === 'Lollipop') ToysLink += '0004.png'
      else if(el.value === 'Shovel') ToysLink += '0005.png'
      else if(el.value === 'Rocket') ToysLink += '0006.png'
      else if(el.value === 'Shaker') ToysLink += '0007.png'
      else if(el.value === 'Bottle') ToysLink += '0008.png'
      else if(el.value === 'Ducky') ToysLink += '0009.png'
      else if(el.value === 'Balloons') ToysLink += '0010.png'
      else if(el.value === 'Windmill') ToysLink += '0011.png'
    }
  })  

  traits.forEach(el => {
    if(el.trait_type === 'Platform'){
      if(el.value === 'Platform 1') PlatformLink += '0001.png'
      else if(el.value === 'Platform 2') PlatformLink += '0002.png'
      else if(el.value === 'Platform 3') PlatformLink += '0003.png'
    }
  })    

  traits.forEach(el => {
    if(el.trait_type === 'Head') el['img_link'] =  HeadLink
    if(el.trait_type === 'Weapon') el['img_link'] =  WeaponLink
    if(el.trait_type === 'Toy') el['img_link'] =  ToysLink
    if(el.trait_type === 'Platform') el['img_link'] =  PlatformLink
  })    


  console.log('link ', HeadLink)
  console.log('link ', WeaponLink)
  console.log('link ', ToysLink)
  console.log('link ', PlatformLink)

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
  console.log('traits ', traits)
  let HeadLink = 'https://storage.googleapis.com/battleverse/Items/Shrooms%2082x82/Heads/heads.'
    WeaponLink = 'https://storage.googleapis.com/battleverse/Items/Shrooms%2082x82/Weapon/icons_v07.weapon_shrooms.',
    ToysLink = 'https://storage.googleapis.com/battleverse/Items/Shrooms%2082x82/Toys/icons_v07.tools_shrooms.',
    PlatformLink = 'https://storage.googleapis.com/battleverse/Items/Shrooms%2082x82/Platforms/platforms.',

  traits.forEach(el => {
    if(el.trait_type === 'Head'){
      if(el.value === 'Scientist') HeadLink += '0010.png'
      else if(el.value === 'Monk') HeadLink += '0009.png'
      else if(el.value === 'Professor') HeadLink += '0007.png'
      else if(el.value === 'Four-eyed') HeadLink += '0008.png'
      else if(el.value === 'Mentalist') HeadLink += '0001.png'
      else if(el.value === 'Gilles') HeadLink += '0007.png'
      else if(el.value === 'Favus') HeadLink += '0011.png'
      else if(el.value === 'Redneck') HeadLink += '0006.png'
      else if(el.value === 'Viking') HeadLink += '0002.png'
      else if(el.value === 'Snaims') HeadLink += '0004.png'
      else if(el.value === 'Licker') HeadLink += '0005.png'
    }
  })

  traits.forEach(el => {
    if(el.trait_type === 'Weapon'){
      if(el.value === 'Tripple Hook') WeaponLink += '0001.png'
      else if(el.value === 'Nunchucks') WeaponLink += '0002.png'
      else if(el.value === 'Sword') WeaponLink += '0003.png'
      else if(el.value === 'Scissors') WeaponLink += '0004.png'
      else if(el.value === 'Long Knife') WeaponLink += '0005.png'
      else if(el.value === 'Hammer') WeaponLink += '0006.png'
      else if(el.value === 'Axe') WeaponLink += '0007.png'
      else if(el.value === 'Hoe') WeaponLink += '0008.png'
      else if(el.value === 'Shovel') WeaponLink += '0009.png'
      else if(el.value === 'Butcher') WeaponLink += '0010.png'
    }
  })

  traits.forEach(el => {
    if(el.trait_type === 'Tools'){
      if(el.value === 'Beehive') ToysLink += '0005.png'
      else if(el.value === 'Trap') ToysLink += '0002.png'
      else if(el.value === 'Bomb') ToysLink += '0009.png'
      else if(el.value === 'Poison') ToysLink += '0003.png'
      else if(el.value === 'Dreamcatcher') ToysLink += '0008.png'
      else if(el.value === 'Liquid') ToysLink += '0001.png'
      else if(el.value === 'Torch') ToysLink += '0007.png'
      else if(el.value === 'Net') ToysLink += '0008.png'
      else if(el.value === 'Circle Shield') ToysLink += '0002.png'
      else if(el.value === 'Doll') ToysLink += '0004.png'
      else if(el.value === 'Hexagon Shield') ToysLink += '0006.png'
    }
  })  

  traits.forEach(el => {
    if(el.trait_type === 'Platform'){
      if(el.value === 'Platform 1') PlatformLink += '0001.png'
      else if(el.value === 'Platform 2') PlatformLink += '0002.png'
      else if(el.value === 'Platform 3') PlatformLink += '0003.png'
    }
  })    

  traits.forEach(el => {
    if(el.trait_type === 'Head') el['img_link'] =  HeadLink
    if(el.trait_type === 'Weapon') el['img_link'] =  WeaponLink
    if(el.trait_type === 'Tools') el['img_link'] =  ToysLink
    if(el.trait_type === 'Platform') el['img_link'] =  PlatformLink
  })    


  console.log('link ', HeadLink)
  console.log('link ', WeaponLink)
  console.log('link ', ToysLink)
  console.log('link ', PlatformLink)
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

app.get('/testshroom/:token_id', function (req, res) {
  const tokenId = parseInt(690).toString();
  const ipfsHash = dbIpfsHashesShrooms.get(tokenId);
  
  traits = [
    { trait_type: 'Head', value: 'Monk' },
    { trait_type: 'Tools', value: 'Net' },
    { trait_type: 'Body', value: 'Bones' },
    { trait_type: 'Weapon', value: 'Long Knife' },
    { trait_type: 'Platform', value: 'Platform 1' },
    { trait_type: 'Material', value: 'Blue' },
    { trait_type: 'Secondary material', value: 'Dark_Red' }
  ]

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
  const isoStr = new Date().toISOString();

  const data = NewModel({
    logId: req.body.logId,
    wallet: req.body.wallet, 
    theme: req.body.theme,
    date: isoStr,
    response: req.body.statsOther,
    user_Message: req.body.userMessage,
    logs: req.body.logs
  })
  data.save()

  console.log('trying ', req.body.logId)

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Id: { 
          number: req.body.logId
        },        
        Title: { 
          title:[
            {
              text: {
                content: JSON.stringify(req.body.statsOther)
              }
            }
          ]
        },
        User_Message: { 
          rich_text:[
            {
              text: {
                content: JSON.stringify(req.body.userMessage)
              }
            }
          ]
        },        
        Theme: { 
          rich_text:[
            {
              text: {
                content: JSON.stringify(req.body.theme)
              }
            }
          ]
        },
        Wallet: { 
          rich_text:[
            {
              text: {
                content: String(req.body.wallet)
              }
            }
          ]
        },        
        Link: { 
          url: 'https://tokens.battleverse.io/logs/' + String(req.body.logId) 
        }                  
      }
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }

})

app.get('/logs', async function (req, res) {
  const logs = await NewModel.find({})
  let newArr = []
  for(let x=0; x<logs.length;  x++){
    newArr.push({wallet: logs[x].wallet, logId: logs[x].logId, theme: logs[x].theme, response: logs[x].response,
      user_Message: logs[x].user_Message, date: logs[x].date, logs: logs[x].logs })
  }
  res.send(newArr.reverse());  
})

app.get('/logs/:id', async function (req, res) {
  console.log('log id', req.params.id)
  const logs = await NewModel.findOne({logId: req.params.id})
  res.send(logs);  
})

app.post('/submitFormToNotion', async (req, res) => {


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
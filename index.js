
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

const BotHeadImgs = [
  {item: 'Happy Cylinder', img: '0001.png'},
  {item: 'Surprised Sphere', img: '0002.png'},
  {item: 'Toothy', img: '0003.png'},
  {item: 'Sad Pot', img: '0004.png'},
  {item: 'Ninja', img: '0005.png'},
  {item: 'Sucker', img: '0006.png'},
  {item: 'Happy Speaker', img: '0007.png'},
  {item: 'Crazy Skull', img: '0008.png'}
],

BotWeaponImgs = [
  {item:'Saw', img: '0001.png'},
  {item:'Drill', img: '0002.png'},
  {item:'Hammer', img: '0003.png'},
  {item:'Axe', img: '0004.png'},
  {item:'Lightnning', img: '0005.png'},
  {item:'Claw', img: '0006.png'},
  {item:'Club', img: '0007.png'},
  {item:'Double Spike', img: '0008.png'},
  {item:'Spike', img: '0009.png'},
  {item:'Blade', img: '0010.png'}
],

BotToysImgs = [
  {item: 'Ball', img: '0001.png'},
  {item: 'Drum', img: '0002.png'},
  {item: 'Icecream', img: '0003.png'},
  {item: 'Lollipop', img: '0004.png'},
  {item: 'Shovel', img: '0005.png'},
  {item: 'Rocket', img: '0006.png'},
  {item: 'Shaker', img: '0007.png'},
  {item: 'Bottle', img: '0008.png'},
  {item: 'Ducky', img: '0009.png'},
  {item: 'Balloons', img: '0010.png'},
  {item: 'Windmill', img: '0011.png'} ],

BotPlatformImgs = [
  {item: 'Platform 1', img: '0001.png'},
  {item: 'Platform 2', img: '0002.png'},
  {item: 'Platform 3', img: '0003.png'} ],

ShroomHeadImgs = [
  {item: 'Scientist', img: '0003.png'},
  {item: 'Monk', img: '0009.png'},
  {item: 'Professor', img: '0010.png'},
  {item: 'Four-eyed', img: '0008.png'},
  {item: 'Mentalist', img: '0001.png'},
  {item: 'Gilles', img: '0007.png'},
  {item: 'Favus', img: '0006.png'},
  {item: 'Redneck', img: '0011.png'},
  {item: 'Viking', img: '0002.png'},
  {item: 'Snaims', img: '0004.png'},
  {item: 'Licker', img: '0005.png'} ],

ShroomWeaponImgs = [
  {item: 'Tripple Hook', img: '0004.png'},
  {item: 'Nunchucks', img: '0011.png'},
  {item: 'Sword', img: '0002.png'},
  {item: 'Scissors', img: '0008.png'},
  {item: 'Long Knife', img: '0001.png'},
  {item: 'Mace', img: '0009.png'},
  {item: 'Hammer', img: '0006.png'},
  {item: 'Axe', img: '0007.png'},
  {item: 'Hoe', img: '0005.png'},
  {item: 'Shovel', img: '0010.png'},
  {item: 'Butcher', img: '0003.png'} ],

ShroomToysImgs = [
  {item: 'Beehive', img: '0005.png'},
  {item: 'Trap', img: '0011.png'},
  {item: 'Bomb', img: '0009.png'},
  {item: 'Poison', img: '0003.png'},
  {item: 'Dreamcatcher', img: '0008.png'},
  {item: 'Liquid', img: '0001.png'},
  {item: 'Torch', img: '0007.png'},
  {item: 'Net', img: '0010.png'},
  {item: 'Circle Shield', img: '0002.png'},
  {item: 'Doll', img: '0004.png'},
  {item: 'Hexagon Shield', img: '0006.png'} ],

ShroomPlatformImgs = [
  {item: 'Platform 1', img: '0001.png'},
  {item: 'Platform 2', img: '0002.png'},
  {item: 'Platform 3', img: '0003.png'},
  {item: 'Platform 4', img: '0003.png'} ]  


function getStat(db, type, traits, stata) {
  result = false;
  statsAll = db.get(type);

  traits.forEach(trait => {
    foundStat = statsAll.find(function(stat, index){
      if(trait.trait_type == type && stat.item == trait.value) return true;
    });

    if(typeof foundStat !== 'undefined') result = foundStat;
  });

  return result ? result[stata] : -1;
}

app.get('/bot/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const ipfsHash = dbIpfsHashes.get(tokenId);
  traits = dbTraitsBots.get(tokenId);
  console.log('traits ', traits)
  let HeadLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Heads/heads.',
    WeaponLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Weapons/icons_v02.icons.',
    ToysLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Toys/icons_v03.toys.',
    PlatformLink = 'https://storage.googleapis.com/battleverse/Items/Bots%2082x82/Platforms/platforms.'

  traits.forEach(el => {

    if(el.trait_type === 'Head'){
      el['rarity'] = getStat(dbStatsBots, "Head", traits, 'rarity')

      BotHeadImgs.forEach(elem => {
        if(el.value === elem.item) HeadLink += elem.img
      })      
    }
    
    if(el.trait_type === 'Weapon'){
      el['rarity'] = getStat(dbStatsBots, "Weapon", traits, 'rarity')

      BotWeaponImgs.forEach(elem => {
        if(el.value === elem.item) WeaponLink += elem.img
      }) 
    }    
    
    if(el.trait_type === 'Toy'){
      el['rarity'] = getStat(dbStatsBots, "Toy", traits, 'rarity')

      BotToysImgs.forEach(elem => {
        if(el.value === elem.item) ToysLink += elem.img
      }) 
    }    
    
    if(el.trait_type === 'Platform'){
      el['rarity'] = getStat(dbStatsBots, "Platform", traits, 'rarity')

      BotPlatformImgs.forEach(elem => {
        if(el.value === elem.item) PlatformLink += elem.img
      }) 
    }    

  })


  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(getStat(dbStatsBots, "Weapon", traits, 'force'))});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(getStat(dbStatsBots, "Toy", traits, 'force'))});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(getStat(dbStatsBots, "Head", traits, 'force'))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Attack", "value": Math.round(getStatAttack(dbStatsBots, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Defence", "value": Math.round(getStatAttack(dbStatsBots, "Toy", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Trick", "value": Math.round(getStatAttack(dbStatsBots, "Head", traits))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Attack", "value": Math.round(getStatSelfBoost(dbStatsBots, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Defence", "value": Math.round(getStatSelfBoost(dbStatsBots, "Toy", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Trick", "value": Math.round(getStatSelfBoost(dbStatsBots, "Head", traits))});  

  traits.push({"trait_type": "Health", "value": 100});

  let tokenDetails = {
    description: "Baby Combat Bots is a collection of cute and deadly procedurally generated robots. Own a Bot. Battle other Bots. Earn Eth.",
    image: 'https://storage.googleapis.com/battleverse/deprecated.png',
    name: 'Baby Combat Bot #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon',
    },
    alpha_125: 'https://storage.googleapis.com/battleverse/deprecated.png',
    alpha_500: 'https://storage.googleapis.com/battleverse/deprecated.png',
    head_link: HeadLink,
    weapon_link: WeaponLink,
    toys_link: ToysLink,
    platform_link: PlatformLink 
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://storage.googleapis.com/battleverse/deprecated.png';
    tokenDetails.ipfs_image = 'https://storage.googleapis.com/battleverse/deprecated.png';
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
    PlatformLink = 'https://storage.googleapis.com/battleverse/Items/Shrooms%2082x82/Platforms/platforms.'



  traits.forEach(el => {
    if(el.trait_type === 'Head'){
      el['rarity'] = getStat(dbStatsShrooms, "Head", traits, 'rarity')

      ShroomHeadImgs.forEach(elem => {
        if(el.value === elem.item) HeadLink += elem.img
      })
    }
    
    if(el.trait_type === 'Weapon'){
      el['rarity'] = getStat(dbStatsShrooms, "Weapon", traits, 'rarity')

      ShroomWeaponImgs.forEach(elem => {
        if(el.value === elem.item) WeaponLink += elem.img
      })
    } 
    
    if(el.trait_type === 'Tools'){
      el['rarity'] = getStat(dbStatsShrooms, "Tools", traits, 'rarity')

      ShroomToysImgs.forEach(elem => {
        if(el.value === elem.item) ToysLink += elem.img
      })
    }

    if(el.trait_type === 'Platform'){
      el['rarity'] = getStat(dbStatsShrooms, "Platform", traits, 'rarity')

      ShroomPlatformImgs.forEach(elem => {
        if(el.value === elem.item) PlatformLink += elem.img
      })
    }
  })

  traits.push({"display_type": "boost_number", "trait_type": "Attack", "value": Math.round(getStat(dbStatsShrooms, "Weapon", traits, 'force'))});
  traits.push({"display_type": "boost_number", "trait_type": "Defence", "value": Math.round(getStat(dbStatsShrooms, "Tools", traits, 'force'))});
  traits.push({"display_type": "boost_number", "trait_type": "Trick", "value": Math.round(getStat(dbStatsShrooms, "Head", traits, 'force'))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Attack", "value": Math.round(getStatAttack(dbStatsShrooms, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Defence", "value": Math.round(getStatAttack(dbStatsShrooms, "Tools", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Attack_Trick", "value": Math.round(getStatAttack(dbStatsShrooms, "Head", traits))});

  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Attack", "value": Math.round(getStatSelfBoost(dbStatsShrooms, "Weapon", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Defence", "value": Math.round(getStatSelfBoost(dbStatsShrooms, "Tools", traits))});
  // traits.push({"display_type": "boost_number", "trait_type": "racing_Selfboost_Trick", "value": Math.round(getStatSelfBoost(dbStatsShrooms, "Head", traits))}); 

  traits.push({"trait_type": "Health", "value": 100});

  let tokenDetails = {
    description: "Deprecated! Don't Buy! First generation of Battle Shrooms — a collection of procedurally generated mushrooms race ready to fight in BattleVerse!",
    image: 'https://storage.googleapis.com/battleverse/deprecated.png',
    name: 'Battle Shroom #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_125: 'https://storage.googleapis.com/battleverse/deprecated.png',
    alpha_500: 'https://storage.googleapis.com/battleverse/deprecated.png',
    head_link: HeadLink,
    weapon_link: WeaponLink,
    toys_link: ToysLink,
    platform_link: PlatformLink
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://storage.googleapis.com/battleverse/deprecated.png';
    tokenDetails.ipfs_image = 'https://storage.googleapis.com/battleverse/deprecated.png';
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
    image: 'https://storage.googleapis.com/battleverse/deprecated.png',
    name: 'Battle Shroom #' + tokenId,
    attributes: {
      'Ready To Battle': 'Soon'
    },
    alpha_125: 'https://storage.googleapis.com/battleverse/deprecated.png',
    alpha_500: 'https://storage.googleapis.com/battleverse/deprecated.png'
  };

  if (revealIsActive) {
    tokenDetails.image = 'https://storage.googleapis.com/battleverse/deprecated.png';
    tokenDetails.ipfs_image = 'https://storage.googleapis.com/battleverse/deprecated.png';
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
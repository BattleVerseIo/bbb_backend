const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = require('./coral-core-337710-8c50e72e7ab1.json')

const doc = new GoogleSpreadsheet('1JzcnhRrKGgTeFqmGP6bNJ8IFQI4kA33idDvLVGipPao');

const JSONdb = require('simple-json-db')

const dbStatsBots = new JSONdb('./db/stats_bots.json'),
  dbStatsShrooms = new JSONdb('./db/stats_shrooms.json'),
  dbStatsDummies = new JSONdb('./db/stats_dummies.json'),
  fs = require('fs')
  
let BotsWeapon = []
let BotsToy = []
let BotsHeads = []

let ShroomsWeapon = []
let ShroomsToy = []
let ShroomsHeads = []

let DummiesWeapon = []
let DummiesToy = []
let DummiesHeads = []

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  
  await doc.loadInfo(); // loads document properties and worksheets

  return doc.sheetsByIndex[1];
}

async function getBotsHeads(){
  let sheet = await accessSpreadsheet()
  await sheet.loadCells('A2:G12');
  for(let x = 2; x<12; x++){
    BotsWeapon.push({
      item: sheet.getCell(x, 0).value, 
      force: sheet.getCell(x, 2).value, 
      // selfBoost: sheet.getCell(x, 3).value, 
      // attack: sheet.getCell(x, 4).value, 
      rarity: sheet.getCell(x, 4).value, 
    })
  }
  await sheet.loadCells('G2:K13');
  for(let x = 2; x<13; x++){
    BotsToy.push({
      item: sheet.getCell(x, 6).value, 
      force: sheet.getCell(x, 8).value, 
      // selfBoost: sheet.getCell(x, 6).value, 
      // attack: sheet.getCell(x, 8).value, 
      rarity: sheet.getCell(x, 10).value, 
    })
  }

  await sheet.loadCells('M2:Q10');
  for(let x = 2; x<10; x++){
    BotsHeads.push({
      item: sheet.getCell(x, 12).value, 
      force: sheet.getCell(x, 14).value, 
      // selfBoost: sheet.getCell(x, 10).value, 
      // attack: sheet.getCell(x, 11).value,
      rarity: sheet.getCell(x, 16).value
    })
  }
    const bots = {
      Weapon: BotsWeapon, 
      Toy: BotsToy, 
      Head: BotsHeads  
    };
    console.log(bots)
    json = JSON.stringify(bots); //convert it back to json
    fs.writeFile('./db/stats_bots.json', json, 'utf8', () => {}); // write it back 
}

// getBotsHeads()

async function getShroomsHeads(){
  let sheet = await accessSpreadsheet()

  await sheet.loadCells('A19:E30');
  for(let x = 19; x<30; x++){
    ShroomsWeapon.push({
      item: sheet.getCell(x, 0).value, 
      force: sheet.getCell(x, 2).value, 
      // selfBoost: sheet.getCell(x, 2).value, 
      // attack: sheet.getCell(x, 3).value, 
      rarity: sheet.getCell(x, 4).value
    })
  }

  await sheet.loadCells('G19:K30');
  for(let x = 19; x<30; x++){
    ShroomsToy.push({
      item: sheet.getCell(x, 6).value, 
      force: sheet.getCell(x, 8).value, 
      // selfBoost: sheet.getCell(x, 6).value, 
      // attack: sheet.getCell(x, 7).value,  
      rarity: sheet.getCell(x, 10).value
    })
  }

  await sheet.loadCells('M19:Q29');
  for(let x = 19; x<29; x++){
    ShroomsHeads.push({
      item: sheet.getCell(x, 12).value, 
      force: sheet.getCell(x, 14).value, 
      // selfBoost: sheet.getCell(x, 10).value, 
      // attack: sheet.getCell(x, 11).value
      rarity: sheet.getCell(x, 16).value
    })
  }

    
  const shrooms = {
    Weapon: ShroomsWeapon,  
    Tools: ShroomsToy,  
    Head: ShroomsHeads  
  };


  console.log(shrooms)
  json = JSON.stringify(shrooms); //convert it back to json
  fs.writeFile('./db/stats_shrooms.json', json, 'utf8', () => {}); // write it back 
}

getShroomsHeads()

// async function getDummiesHeads(){
//   let sheet = await accessSpreadsheet()

//   await sheet.loadCells('A36:D40');
//   for(let x = 19; x<30; x++){
//     DummiesWeapon.push({
//       item: sheet.getCell(x, 0).value, 
//       force: sheet.getCell(x, 2).value, 
//     })
//   }

//   await sheet.loadCells('G36:J40');
//   for(let x = 19; x<30; x++){
//     DummiesToy.push({
//       item: sheet.getCell(x, 6).value, 
//       force: sheet.getCell(x, 8).value, 
//     })
//   }

//   await sheet.loadCells('M36:O40');
//   for(let x = 19; x<30; x++){
//     DummiesHeads.push({
//       item: sheet.getCell(x, 12).value, 
//       force: sheet.getCell(x, 14).value
//     })
//   }

    
//   const dummies = {
//     Weapon: DummiesWeapon,  
//     Tools: DummiesToy,  
//     Head: DummiesHeads  
//   };


//   console.log(dummies)
//   json = JSON.stringify(dummies); //convert it back to json
//   fs.writeFile('./db/stats_dummies.json', json, 'utf8', () => {}); // write it back 
// }

// getDummiesHeads()
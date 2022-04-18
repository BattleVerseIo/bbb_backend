const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./coral-core-337710-8c50e72e7ab1.json')

const doc = new GoogleSpreadsheet('1JzcnhRrKGgTeFqmGP6bNJ8IFQI4kA33idDvLVGipPao');

const JSONdb = require('simple-json-db')

const dbStatsBots = new JSONdb('./db/stats_bots.json'),
  dbStatsShrooms = new JSONdb('./db/stats_shrooms.json'),
  fs = require('fs')
  
let BotsWeapon = []
let BotsToy = []
let BotsHeads = []

let ShroomsWeapon = []
let ShroomsToy = []
let ShroomsHeads = []

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
  await sheet.loadCells('A1:D12');
  for(let x = 2; x<12; x++){
    BotsWeapon.push({
      item: ((sheet.getCell(x, 0).value).slice(2)).replace(' ', ''), 
      rarity: sheet.getCell(x, 1).value, 
      force: sheet.getCell(x, 2).value, 
      quantity: sheet.getCell(x, 3).value, 
    })
  }

  await sheet.loadCells('G1:J14');
  for(let x = 2; x<13; x++){
    BotsToy.push({
      item: sheet.getCell(x, 6).value, 
      rarity: sheet.getCell(x, 7).value, 
      force: sheet.getCell(x, 8).value, 
      quantity: sheet.getCell(x, 9).value, 
    })
  }

  await sheet.loadCells('M1:O11');
  for(let x = 2; x<10; x++){
    BotsHeads.push({
      head: sheet.getCell(x, 12).value, 
      rarity: sheet.getCell(x, 13).value, 
      force: sheet.getCell(x, 14).value
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

getBotsHeads()

async function getShroomsHeads(){
  let sheet = await accessSpreadsheet()

  await sheet.loadCells('A18:D30');
  for(let x = 19; x<30; x++){
    ShroomsWeapon.push({
      item: sheet.getCell(x, 0).value, 
      rarity: sheet.getCell(x, 1).value, 
      force: sheet.getCell(x, 2).value, 
    })
  }

  await sheet.loadCells('G19:J30');
  for(let x = 19; x<30; x++){
    ShroomsToy.push({
      item: sheet.getCell(x, 6).value, 
      rarity: sheet.getCell(x, 7).value, 
      force: sheet.getCell(x, 8).value, 
    })
  }

  await sheet.loadCells('M18:O30');
  for(let x = 19; x<30; x++){
    ShroomsHeads.push({
      head: sheet.getCell(x, 12).value, 
      rarity: sheet.getCell(x, 13).value, 
      force: sheet.getCell(x, 14).value
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

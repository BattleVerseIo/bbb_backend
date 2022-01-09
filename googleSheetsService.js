const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./coral-core-337710-8c50e72e7ab1.json')

const doc = new GoogleSpreadsheet('1JzcnhRrKGgTeFqmGP6bNJ8IFQI4kA33idDvLVGipPao');

let BotsHeads = []
let ShroomsHeads = []

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  
  await doc.loadInfo(); // loads document properties and worksheets

  return doc.sheetsByIndex[0];
}

async function getBotsHeads(){
  let sheet = await accessSpreadsheet()
  await sheet.loadCells('M1:O11');
  for(let x = 2; x<10; x++){
    BotsHeads.push({
      head: sheet.getCell(x, 12).value, 
      rarity: sheet.getCell(x, 13).value, 
      force: sheet.getCell(x, 14).value
    })
  }
  return BotsHeads
}

async function getShroomsHeads(){
  let sheet = await accessSpreadsheet()
  await sheet.loadCells('M18:O30');
  for(let x = 19; x<30; x++){
    ShroomsHeads.push({
      head: sheet.getCell(x, 12).value, 
      rarity: sheet.getCell(x, 13).value, 
      force: sheet.getCell(x, 14).value
    })
  }
  return ShroomsHeads
}

module.exports.one = getBotsHeads()
module.exports.two = getShroomsHeads() 


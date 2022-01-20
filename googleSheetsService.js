const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./coral-core-337710-8c50e72e7ab1.json')

const doc = new GoogleSpreadsheet('1JzcnhRrKGgTeFqmGP6bNJ8IFQI4kA33idDvLVGipPao');

const JSONdb = require('simple-json-db')

const dbStatsBots = new JSONdb('./db/stats_bots.json'),
  dbStatsShrooms = new JSONdb('./db/stats_shrooms.json'),
  fs = require('fs')
  
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
  fs.readFile('./db/stats_bots.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    
    const head = {
      Head: BotsHeads  
    };
    const finalResult = Object.assign(obj, head);

    console.log(finalResult)
    json = JSON.stringify(finalResult); //convert it back to json
    fs.writeFile('./db/stats_bots.json', json, 'utf8', () => {}); // write it back 
  }});
}

getBotsHeads()

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

  fs.readFile('./db/stats_shrooms.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    
    const head = {
      Head: ShroomsHeads  
    };
    const finalResult = Object.assign(obj, head);

    console.log(finalResult)
    json = JSON.stringify(finalResult); //convert it back to json
    console.log(json)
    fs.writeFile('./db/stats_shrooms.json', json, 'utf8', () => {}); // write it back 
  }});  
}

getShroomsHeads()

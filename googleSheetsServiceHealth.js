const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./coral-core-337710-8c50e72e7ab1.json')

const doc = new GoogleSpreadsheet('1JzcnhRrKGgTeFqmGP6bNJ8IFQI4kA33idDvLVGipPao');

const JSONdb = require('simple-json-db')

const health = new JSONdb('./db/health.json'),
  fs = require('fs')
  
let healthValue = []

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  
  await doc.loadInfo(); // loads document properties and worksheets

  return doc.sheetsByIndex[3];
}

async function getBotsHeads(){
  
  let sheet = await accessSpreadsheet()
  await sheet.loadCells('C11:C111');
  for(let x = 11; x<111; x++){
    healthValue.push({
      health: Math.round(sheet.getCell(x, 2).value),
    })
  }
  // const  = {
  //   Health: healthValue, 
  // };

  console.log(healthValue)
  json = JSON.stringify(healthValue); //convert it back to json
  fs.writeFile('./db/health.json', json, 'utf8', () => {}); // write it back 

}

getBotsHeads()

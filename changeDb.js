const JSONdb = require('simple-json-db')

const health = new JSONdb('./db/traits_shrooms.json'),
  fs = require('fs')
  
let healthValue = []

// async function accessSpreadsheet() {
//   await doc.useServiceAccountAuth({
//     client_email: creds.client_email,
//     private_key: creds.private_key,
//   });
  
//   await doc.loadInfo(); // loads document properties and worksheets

//   return doc.sheetsByIndex[3];
// }

async function getBotsHeads(){
  console.log(health[0])
  // let sheet = await accessSpreadsheet()
  // await sheet.loadCells('C11:C111');
  // for(let x = 11; x<111; x++){
  //   healthValue.push({
  //     health: Math.round(sheet.getCell(x, 2).value),
  //   })
  // }
  // const  = {
  //   Health: healthValue, 
  // };

  // console.log(healthValue)


  
  json = JSON.stringify(healthValue); //convert it back to json

  fs.writeFile('./db/traits_shrooms1.json', json, 'utf8', () => {}); // write it back 

}

getBotsHeads()

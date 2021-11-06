
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('cc184157dc8a45893259', '1d9fa62ceaf03d10682bcce4a00397fd875f7194c4c5a66b04de2738c5dc14d0');
const fs = require('fs');

const JSONdb = require('simple-json-db');
const db = new JSONdb('./db/ipfs_hashes_shrooms.json');
const project = 'shrooms';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pinFile(file) {
    const readableStreamForFile = fs.createReadStream(file);
    const options = {
        pinataMetadata: {
            keyvalues: {
                project: project
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    return pinata.pinFileToIPFS(readableStreamForFile, options);
}

async function upload() {
    var auth = await pinata.testAuthentication();
    if (auth.authenticated == true) {
        const sourcePath = './local/generated_images/Shrooms';

        var files = fs.readdirSync(sourcePath);
        for (let file of files) {
            fileId = file.replace('.jpg', '');
            if (!db.get(fileId)) {
                await sleep(600);
                var pinResult = await pinFile(sourcePath + '/' + file);
                db.set(fileId, pinResult.IpfsHash);
                console.log(file + ' --- ' + pinResult.IpfsHash);
            } else {
                console.log(fileId + " already uploaded")
            }
        }
    }
}

upload();
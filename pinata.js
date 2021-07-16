
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('cc184157dc8a45893259', '1d9fa62ceaf03d10682bcce4a00397fd875f7194c4c5a66b04de2738c5dc14d0');
const fs = require('fs');

const JSONdb = require('simple-json-db');
const db = new JSONdb('./db/ipfs_hashes.json');
const project = 'bbb';

function pinFile(file) {
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

pinata.testAuthentication().then((result) => {
    if (result.authenticated === true) {
        const sourcePath = './local/generated_images';

        fs.readdirSync(sourcePath).forEach(file => {
            pinFile(sourcePath + '\\' + file).then((result) => {
                file = file.replace('.jpg', '');
                db.set(file, result.IpfsHash);
                console.log(file + ' --- ' + result.IpfsHash);
            }).catch((err) => {
                console.log(err);
            });
        });
    }
}).catch((err) => {
    console.log(err);
});
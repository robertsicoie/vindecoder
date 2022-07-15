import fs from 'fs'; 

export default class FSStorage {

    constructor(path) {
        this.path = path;
    }

    responseFromStorage(vin) {
        let rawFile = fs.readFileSync(`${this.path}/${vin}.json`, 'utf-8');
        let json = JSON.parse(rawFile);
        return json;
    }
    
    responseToStorage(vin, vinData) {
        fs.writeFile(`${this.path}/${vin}.json`, vinData, (err) => {
            if (err) throw err;
            console.log(`${vin} written to file.`);
        })
    
    }
}
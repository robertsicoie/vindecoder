import express from 'express';
import { got } from 'got';
import crypto from 'crypto';

const config = {
    API_KEY: process.env.API_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    PORT: process.env.PORT ?? 3000,
    CONNECT_TIMEOUT: process.env.CONNECT_TIMEOUT ?? 5000,
    READ_TIMEOUT: process.env.READ_TIMEOUT ?? 5000
};

const app = express();

app.get('/vin/decode/:vin', async (req, res) => {
    const vin = req.params.vin;
    if (invalid(vin)) {
        res.send('VIN is invalid!');
        return;
    }

    var controlSum = checksum(vin, 'decode');
    try {
        const response = await got.get(`https://api.vindecoder.eu/3.1/${config.API_KEY}/${controlSum}/decode/${vin}.json`, {
            timeout: {
                connect: config.CONNECT_TIMEOUT,
                read: config.READ_TIMEOUT
            }
        });
        res.send(JSON.parse(response.body));
    } catch(error) {
        console.log('Error: ', error);
        throw new Error('Failed to decode VIN: ', error);
    }
});

app.listen(config.PORT, () => {
    console.log(`VIN service listening on port ${config.PORT}`);
});

function checksum(vin, action) {
    var shasum = crypto.createHash('sha1')
    shasum.update(`${vin}|${action}|${config.API_KEY}|${config.SECRET_KEY}`);
    return shasum.digest('hex').substring(0, 10);
}

function invalid(vin) {
    return vin == null 
        || vin.length != 17 
        || vin.includes('I') 
        || vin.includes('O') 
        || vin.includes('Q');
}

export default app;
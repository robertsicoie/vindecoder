import express from 'express';
import { got } from 'got';
import cors from 'cors';
import crypto from 'crypto';
import FSStorage from './storage.js';

const config = {
    API_KEY: process.env.API_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    PORT: process.env.PORT ?? 3000,
    CONNECT_TIMEOUT: process.env.CONNECT_TIMEOUT ?? 5000,
    READ_TIMEOUT: process.env.READ_TIMEOUT ?? 5000,
    JWT: process.env.JWT,
    STORAGE_PATH: '/tmp'
};

const storage = new FSStorage(config.STORAGE_PATH);

const app = express();
app.use(cors({'origin': '*'}));

app.get('/vin/decode/:vin', async (req, res) => {
    if (!isAuthorized(req)) {
        logRequest('Unauthorized request!', req);
        res.sendStatus(401);
        return;
    };
    const vin = req.params.vin;
    if (invalid(vin)) {
        res.send('VIN is invalid!');
        return;
    }

    var responseBody= {};
    try {
        responseBody = storage.responseFromStorage(vin);
        console.log(`Found ${vin} in storage.`);
    } catch (error) {
        console.log(`VIN ${vin} not found, calling API...`);
        var controlSum = checksum(vin, 'decode');
        try {
            const response = await got.get(`https://api.vindecoder.eu/3.1/${config.API_KEY}/${controlSum}/decode/${vin}.json`, {
                timeout: {
                    connect: config.CONNECT_TIMEOUT,
                    read: config.READ_TIMEOUT
                }
            });
            responseBody = JSON.parse(response.body);
            storage.responseToStorage(vin, response.body);
        } catch(error) {
            console.log('Error: ', error);
            throw new Error('Failed to decode VIN: ', error);
        }
    }
    res.send(toCar(responseBody));
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

function toCar(json) {
    var car = {};
    json.decode.forEach(element => {
        car[element['label']] = element['value'];
    });
    return car;
}

function isAuthorized(req) {
    // TODO proper validation with auth server
    if (config.JWT != null) {
        return `Bearer ${config.JWT}` === req.headers['authorization'];
    }
    return true;
}

function logRequest(message, request) {
    const { rawHeaders, httpVersion, method, socket, url } = request;
    const { remoteAddress, remoteFamily } = socket;

    console.log(message,
        JSON.stringify({
            timestamp: Date.now(),
            rawHeaders,
            httpVersion,
            method,
            remoteAddress,
            remoteFamily,
            url
        })
    );
}

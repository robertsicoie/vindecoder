# Node.JS VIN Decoder

This is a simple wrapper over [vindecoder.eu](https://vindecoder.eu/)'s VIN decode API.

### Prerequisites
To use this script you first need your own API key and secret key from [vindecoder.eu](https://vindecoder.eu/)

### Build
Clone this repository and then build it with `npm install`

### Run
The simplest way to run this script
`API_KEY=yourKey SECRET_KEY=yourSecret PORT=5000 node index.js`. If omitted, default port is 3000.

To check a vin number call the `/decode/<yourVIN>` endpoint. For example:
`curl --location --request GET 'http://localhost:3000/vin/WVGZZZ5NZJM131395'`

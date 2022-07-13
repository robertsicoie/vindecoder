# Node.JS VIN Decoder

This is a simple wrapper over [vindecoder.eu](https://vindecoder.eu/)'s VIN decode API.

### Prerequisites
To use this script you first need your own API key and secret key from [vindecoder.eu](https://vindecoder.eu/)

### Build
Clone this repository and then build it with `npm install`

### Run
TODO This runs on GCP Functions

To check a vin number call the `/decode/<yourVIN>` endpoint. For example:
```curl --location --request GET 'http://localhost:5000/vin/decode/WVGZZZ5NZJM131395'```

// Weather app using promises and promise chaining

const request = require('request');
const yargs = require('yargs');

const defaultAddress = 'Obafemi Awolowo University';
const argv = yargs
  .options({
    address:{
      demand: true,
      describe: 'Address to fetch weather for',
      alias:'a',
      string: true,
      default: encodeURIComponent(defaultAddress) 
    }
  })
  .help()
  .alias('help','h')
  .argv

const geocodeAddress = (address)=>{
    return new Promise((resolve,reject)=>{
        let encodedAddress = encodeURIComponent(address);
        request({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
            json: true
        },(err,res,body)=>{
            if (body.status === 'ZERO_RESULTS'){
                throw new Error('Unable to find address')
            }else if (body.status === 'OK'){
                resolve({
                    address: body.results[0].formatted_address,
                    latitude: body.results[0].geometry.location.lat,
                    longitude: body.results[0].geometry.location.lng
                });
            }
        });
    })
};

geocodeAddress(argv.address).then((result)=>{
    return  new Promise((resolve,reject)=>{
        let lat = result.latitude;
        let lng = result.longitude;
        request({
            url: `https://api.darksky.net/forecast/24f7f941a65a47948985284ce71b8a69/${lat},${lng}`,
            json: true
        },(err,body,res)=>{
            resolve({
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
              });
        }) 
    });
}).then((result)=>{
    console.log(JSON.stringify(result,undefined,2));
}).catch((err)=>{
        if (err.code === 'ENOTFOUND'){
            console.log('Unable to connect to API server');
          }else{
            console.log(err.message);
          }
    });

// Weather app using the axios library and promise chaining

const yargs = require('yargs');
const axios = require('axios');

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

let encodedAddress = encodeURIComponent(argv.address) ;
console.log(encodedAddress);
let geocodeUrl =  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response)=>{
  if (response.data.status === 'ZERO_RESULTS'){
    throw new Error('Unable to find address');
  }
  let lat = response.data.results[0].geometry.location.lat;
  let lng = response.data.results[0].geometry.location.lng;
  let weatherUrl = `https://api.darksky.net/forecast/24f7f941a65a47948985284ce71b8a69/${lat},${lng}`
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl)
}).then((response)=>{
  console.log({
    temperature: response.data.currently.temperature,
    apparentTemperature: response.data.currently.apparentTemperature
  });
}).catch((err)=>{
  if (err.code === 'ENOTFOUND'){
    console.log('Unable to connect to API server');
  }else{
    console.log(err.message);
  }
});

// Todo
// 1. Load in more information from the response object of the weather api

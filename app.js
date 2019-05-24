// Weather app using callbacks and callback chaining

const yargs = require('yargs');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

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

geocode.geocodeAddress(argv.address,(errorMessage,result)=>{
  if (errorMessage){
    console.log(errorMessage);
  }else{
    console.log(result.address);
    weather.getWeather(result.latitude,
                          result.longitude,
                            (errorMessage,weatherResult)=>{
      if (errorMessage){
        console.log(errorMessage);
      }else{
        console.log(JSON.stringify(weatherResult,undefined,2));
      }
    });
  }
});



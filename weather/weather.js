const request = require('request');

const getWeather = (lat,lng,callback)=>{
    request({
        url: `https://api.darksky.net/forecast/24f7f941a65a47948985284ce71b8a69/${lat},${lng}`,
        json: true
      },(err,body,res)=>{
        if (!err && body.statusCode===200){
          callback(undefined,{
              temperature: body.currently.temperature,
              apparentTemperature: body.currently.apparentTemperature
            });
        }else{
          callback('Unable to fetch weather');
        }
      });    
};

module.exports.getWeather = getWeather;
  
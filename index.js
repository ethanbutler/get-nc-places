const express   = require('express');
const app       = express();
const https     = require('https')
const server    = require('http').Server(app);
const cityBase  = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const coordBase = 'https://maps.googleapis.com/maps/api/geocode/json';

const getCities = (key, input, type) => {
  let endpoint = `${cityBase}?key=${key}&input=${input}&type=${type}`;
  return new Promise(resolve => {
    https.get(endpoint, res => {
      let body = '';
      res.on('data', d => {body += d} ).on('end', () =>{
        let data    = JSON.parse(body);
        let results = [];
        for(let city of data.predictions){
          if(city.terms[1].value === 'NC'){
            let name = `${city.terms[0].value}, ${city.terms[1].value}`;
            results.push(name);
          }
        }
        resolve(results);
      });
    });
  });
}

const getLatLng = (city) => {
  let endpoint = `${coordBase}?address=${city}&sensor=false`;
  return new Promise(resolve => {
    https.get(endpoint, res => {
      let body = '';
      res.on('data', d => {body += d} ).on('end', () =>{
        let data = JSON.parse(body);
        let coords = data.results[0].geometry.location;
        resolve(coords);
      });
    });
  });
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/v1/places', (req, res) => {
  let key     = req.query.key;
  let input   = req.query.q;
  let type    = req.query.type;
  getCities(key, input, type).then(cities => {
    let results = [];
    for(let city of cities){
      getLatLng(city).then(coords => {
        results.push({
          name: city,
          coords: coords
        });
        if( results.length === cities.length ){
          res.send(results);
        }
      });
    }
  });
});

server.listen(3000, () => {
  console.log('listening');
});

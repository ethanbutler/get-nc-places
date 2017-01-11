const express = require('express');
const app     = express();
const https   = require('https')
const server  = require('http').Server(app);
const base    = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const getCity = (key, input, type) => {
  let endpoint = `${base}?key=${key}&input=${input}&type=${type}`;
  return new Promise(resolve => {
    https.get(endpoint, res => {
      let body = '';
      res.on('data', d => {body += d} ).on('end', () =>{
        resolve(body)
      });
    })
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
  getCity(key, input, type).then(data => {
    let _data = JSON.parse(data);
    let results = [];
    for(let city of _data.predictions){
      if(city.terms[1].value === 'NC'){
        results.push(`${city.terms[0].value}, ${city.terms[1].value}`)
      }
    }
    res.send(results);
  })
});

server.listen(3000, () => {
  console.log('listening');
});

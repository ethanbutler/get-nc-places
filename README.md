# get-nc-places

A simple Node wrapper to query the Google Places Autocomplete API to return a list of city names in North Carolina.

## Usage

Running:

```
node index.js
```

Querying:

```
http://localhost:3000/api/v1/places?key=KEY&q=QUERY&type=TYPE
```

* KEY: Google Maps API Key
* QUERY: Search term
* TYPE: Type of results to return. Should always be `(cities`

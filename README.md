# node-sql

  A simple node-style callback wrapper for the wonderful [Tedious](https://www.npmjs.com/package/tedious) driver.

```js
var nodeSQL = require('node-sql')
//standard tedious config object : http://tediousjs.github.io/tedious/api-connection.html#function_newConnection
var config = {
  userName: process.env.USERNAME,
  password: process.env.PASSWORD,
  server: 'MyServer',
  domain: 'DOMAIN'
}
//result has data as an Array of JSON objects with column name => column value
app.get('/', function (req, res) {
  nodeSQL.exec(`Select FirstName From tbl Where FirstName='Moshe'`, config, function(err, result){
    if(err) res.status(500).json(err);
    res.status(200).json(result);// [{FirstName: 'Moshe'}, {FirstName: 'Moshe'}]
  });
})
```

## Installation

```bash
$ npm install node-sql --save
```

## License

  [MIT](LICENSE)

# [node-sql](https://www.npmjs.com/package/node-sql)

  A simple node-style callback wrapper for the wonderful [Tedious](https://www.npmjs.com/package/tedious) driver.

  Just call the `exec` function with a query, or `sproc` with a stored procedure, and get back an Array of JSON objects.
  Query in, JSON out.

## exec(query, config, callback)
**query**: String - standard SQL query e.g. `'Select * From tbl'`.

**config**: Object - standard [tedious config object](http://tediousjs.github.io/tedious/api-connection.html#function_newConnection).

**callback**: Function - standard node callback, returns `(err, result)`. Where err = Error, and result = the query results.

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
  nodeSQL.exec(`Select FirstName, LastName From tbl Where FirstName='Moshe'`, config, function(err, result){
    if(err) return res.sendStatus(500);
    res.status(200).json(result);// [{FirstName: 'Moshe', LastName: 'Karmel'}]
  });
})
```

## sproc(name, params, config, callback)
**name**: String - stored procedure name e.g. `MyDB.dbo.GetDataById`.

**params**: Object - Key Value pairs of parameter name to parameter value, e.g. `{ ID : 4 }` (the type is inferred).

**config**: Object - standard [tedious config object](http://tediousjs.github.io/tedious/api-connection.html#function_newConnection).

**callback**: Function - standard node callback, returns `(err, result)`. Where err = Error, and result = the query results.

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
app.get('/:Id', function (req, res) {
  var params = { ID: req.params.Id };
  nodeSQL.sproc(`MyDB.dbo.GetDataById`, params, config, function(err, result){
    if(err) return res.sendStatus(500);
    res.status(200).json(result);// [{FirstName: 'Moshe', LastName: 'Karmel'}]
  });
})
```

## tvp(name, params, config, callback)
**name**: String - stored procedure name e.g. `MyDB.dbo.GetDataById`.

**paramName**: String - Name of the Table-Value Parameter, e.g. `Todos`.

**table**: Array of Objects - Follow the pattern here [tedious tvp object](http://tediousjs.github.io/tedious/parameters.html).

**config**: Object - standard [tedious config object](http://tediousjs.github.io/tedious/api-connection.html#function_newConnection).

**callback**: Function - standard node callback, returns `(err, result)`. Where err = Error, and result = the query results.

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
app.post('/:Id', function (req, res) {
  var body = req.body;
  var rows = [];
  // use the index to match the metadata in the table variable
  rows.push(body.Id, body.Text, etc.. );

  var table = {
    columns: [
      {name: 'Id', type: nodeSQL.TYPES.BigInt},
      {name: 'Text', type: nodeSQL.TYPES.VarChar, length: 13},
      ...
    ],
    rows: rows
  };

  nodeSQL.sproc(`MyDB.dbo.SaveTVPRows`, 'Stuff', table, config, function(err, result){
    if(err) return res.sendStatus(500);
    res.status(200).json(result);// [{Id: 1, Text: 'Hello'}, {Id: 2, Text: 'World'}]
  });
})
```

## getColumnNames(query, config, callback)
**query**: String - standard SQL query e.g. `'Select * From tbl'`.

**config**: Object - standard [tedious config object](http://tediousjs.github.io/tedious/api-connection.html#function_newConnection).

**callback**: Function - standard node callback, returns `(err, result)`. Where err = Error, and result = the query results.

```js
var nodeSQL = require('node-sql')
//standard tedious config object : http://tediousjs.github.io/tedious/api-connection.html#function_newConnection
var config = {
  userName: process.env.USERNAME,
  password: process.env.PASSWORD,
  server: 'MyServer',
  domain: 'DOMAIN'
}
//result has data as an Array of column names
app.get('/', function (req, res) {
  nodeSQL.exec(`Select TOP 1 * From tbl Where FirstName='Moshe'`, config, function(err, result){
    if(err) return res.sendStatus(500);
    res.status(200).json(result);// ['FirstName', 'LastName', etc...]
  });
})
```

## Installation

```bash
$ npm install node-sql --save
```

## License

  [MIT](LICENSE)

'use strict';

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

module.exports = {
  exec: exec
};
/**
 * Executes a sql query
 * @param {Object} config -- standard tedious config object
 * @param {string} query  -- good old query string
 * @param {Function} done -- standard node callback
 */
function exec(config, query, done) {
  var connection = new Connection(config);
  connection.on('connect', function(err) {
  // If no error, then good to proceed.
    var request = new Request(query, function(err) {
      if (err) {
        done(err, null);
      }
    });
    var result = [];
    request.on('row', function(columns) {
      var row = {};
      columns.forEach(function(column) {
        row[column.metadata.colName] = column.value;
      });
      result.push(row);
    });
    request.on('doneProc', function(rowCount, more) {
      done(null, result);
    });
    connection.execSql(request);
  });
};
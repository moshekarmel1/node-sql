'use strict';

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

module.exports = {
  exec: exec,
  sproc: sproc,
  tvp: tvp,
  TYPES: TYPES
};
/**
 * Executes a sql query
 * @param {string} query  -- good old query string
 * @param {Object} config -- standard tedious config object
 * @param {Function} done -- standard node callback
 */
function exec(query, config, done) {
  if(!query || (typeof query != 'string')){
    throw new Error('Node-SQL: query was not in the correct format.');
    return;
  }
  if(!config || (typeof config != 'object')){
    throw new Error('Node-SQL: config was not in the correct format.');
    return;
  }
  if(!done || (typeof done != 'function')){
    done = function(a, b){};
  }
  var connection = new Connection(config);
  connection.on('connect', function(err) {
    if(err){
      done(err, null);
      return;
    }
    var request = new Request(query, function(_err) {
      if (_err) {
        done(_err, null);
        return;
      }
      connection.close();
    });
    var result = [];
    request.on('row', function(columns) {
      var row = {};
      columns.forEach(function(column) {
        row[column.metadata.colName] = column.value;
      });
      result.push(row);
    });
    request.on('doneProc', function(rowCount, more, returnStatus) {
      if(returnStatus == 0) done(null, result);
    });
    connection.execSql(request);
  });
};

/**
 * Calls a sql stored proc
 * @param {string} sproc -- stored procedure name string
 * @param {Object} params -- key value pair of paramName => Value object
 * @param {Object} config -- standard tedious config object
 * @param {Function} done -- standard node callback
 */
function sproc(name, params, config, done) {
  if(!name || (typeof name != 'string')){
    throw new Error('Node-SQL: stored procedure name was not in the correct format.');
    return;
  }
  if(!config || (typeof config != 'object')){
    throw new Error('Node-SQL: config was not in the correct format.');
    return;
  }
  if(!done || (typeof done != 'function')){
    done = function(a, b){};
  }
  var connection = new Connection(config);
  connection.on('connect', function(err) {
    if(err){
      done(err, null);
      return;
    }
    var request = new Request(name, function(_err) {
      if (_err) {
        done(_err, null);
        return;
      }
      connection.close();
    });

    if(params && (typeof params == 'object')){
      for(var prop in params){
        request.addParameter(prop, determineType(params[prop]), params[prop]);
      }
    }

    var result = [];
    request.on('row', function(columns) {
      var row = {};
      columns.forEach(function(column) {
        row[column.metadata.colName] = column.value;
      });
      result.push(row);
    });
    request.on('doneProc', function(rowCount, more, returnStatus) {
      if(returnStatus == 0) done(null, result);
    });
    connection.callProcedure(request);
  });
};

/**
 * Calls a sql stored proc
 * @param {string} sproc -- stored procedure name string
 * @param {string} tvpParamName -- parameter name
 * @param {Object} tvpParams -- standard tedious table-value parameter object
 * @param {Object} config -- standard tedious config object
 * @param {Function} done -- standard node callback
 */
function tvp(name, tvpParamName, tvpParams, config, done) {
  if(!name || (typeof name != 'string')){
    throw new Error('Node-SQL: stored procedure name was not in the correct format.');
    return;
  }
  if(!tvpParamName || (typeof tvpParamName != 'string')){
    throw new Error('Node-SQL: stored procedure tvpParamName was not in the correct format.');
    return;
  }
  if(!config || (typeof config != 'object')){
    throw new Error('Node-SQL: config was not in the correct format.');
    return;
  }
  if(!done || (typeof done != 'function')){
    done = function(a, b){};
  }
  var connection = new Connection(config);
  connection.on('connect', function(err) {
    if(err){
      done(err, null);
      return;
    }
    var request = new Request(name, function(_err) {
      if (_err) {
        done(_err, null);
        return;
      }
      connection.close();
    });

    request.addParameter(tvpParamName, TYPES.TVP, tvpParams);

    var result = [];
    request.on('row', function(columns) {
      var row = {};
      columns.forEach(function(column) {
        row[column.metadata.colName] = column.value;
      });
      result.push(row);
    });
    request.on('doneProc', function(rowCount, more, returnStatus) {
      if(returnStatus == 0) done(null, result);
    });
    connection.callProcedure(request);
  });
};

function determineType(val){
  switch(typeof val){
    case 'string':
      return TYPES.VarChar;
    case 'boolean':
      return TYPES.Bit;
    case 'number':
      return TYPES.Int;
    case 'date':
      return TYPES.DateTime;
    default:
      return TYPES.VarChar;
  }
}

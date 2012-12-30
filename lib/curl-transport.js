"use strict";
var exec = require('child_process').exec;
var qs = require('querystring');

exports.connect = function (connOptions) {
  function run(command, cb) {
    exec(command, function (error, stdout, stderr) {
        try {
          if (connOptions.json) {
            cb(null, JSON.parse(stdout));
          } else {
            cb(null, stdout);
          }
        } catch (e) {
          cb(e, null);
        }
    })
      .on('error', function (err) {
        cb(err, null);
      });
  }

  function getCredentials(connOptions) {
    if (connOptions.username && connOptions.password) {
      return " --user " + connOptions.username + ":" + connOptions.password;
    }
    return "";
  }

  function getData(options) {
    if (options.data) {
      if (options.data.toLowerCase) {
        return " --data \"" + options.data + "\"";
      } else {
        return " --data '" + JSON.stringify(options.data) + "'";
      }
    }
    return "";
  }

  function getHeaders(options) {
    if (options.headers) {
      var headers = "";
      Object.keys(options.headers).forEach(function (key) {
        headers +=  " -H " + key + ":\"" + options.headers[key] + "\"";
      });
      return headers;
    }
    return "";
  }

  function getUrlForCommand(url, connOptions) {
    return getCredentials(connOptions) + " " + url;
  }

  return {
    get: function (url, options, cb) {
      var command = "curl --GET" + getUrlForCommand(url, connOptions) + getHeaders(options) + getData(options);
      run(command, cb);
    },

    post: function (url, options, cb) {
      var command = "curl" + getUrlForCommand(url, connOptions) + getHeaders(options) + getData(options);
      run(command, cb);
    },

    put: function (url, options, cb) {
      var command = "curl --request PUT" + getUrlForCommand(url, connOptions) + getHeaders(options) + getData(options);
      run(command, cb);
    },

    del: function (url, options, cb) {
      var command = "curl --include --request DELETE" + getUrlForCommand(url, connOptions) + getHeaders(options);
      run(command, cb, true);
    }
  };
};

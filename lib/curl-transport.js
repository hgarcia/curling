"use strict";
var exec = require('child_process').exec;

function parseStats(stderr) {
  var lines = [];
  var items = [];
  var stats = {};
  var propMap = [
    {index: 1,  name: 'totalSize', val: 0},
    {index: 3,  name: 'received', val: 0},
    {index: 5,  name: 'xferd', val: 0},
    {index: 6,  name: 'averageDownloadSpeed', val: 0},
    {index: 7,  name: 'averageUploadSpeed', val: 0},
    {index: 8,  name: 'totalTime', val: "--:--:--"},
    {index: 9,  name: 'timeSpent', val: "--:--:--"},
    {index: 10, name: 'timeLeft', val: "--:--:--"},
    {index: 11, name: 'currentSpeed', val: 0}
  ];

  if (stderr) {
    try {
      lines = stderr.split("\r");
      items = lines[2].replace("\n", "").split(" ").filter(function (item) { return item; });
    } catch (e) {}
  }

  function getValue(prop) {
    if (items.length > prop.index) {
      var val = items[prop.index];
      if (isNaN(val)) {
        if (val.indexOf(':') !== -1) {
          if (val === '--:--:--') {
            return 0;
          }
          var parts = val.split(':');
          if (parts.length === 3) {
            return (parts[0] * 24) + (parts[1] * 60) + (parts[2] * 3600);
          }
        }
        return val;
      }
      return Number(items[prop.index]);
    }
    return prop.val;
  }

  propMap.forEach(function (prop) {
    stats[prop.name] = getValue(prop);
  });

  return stats;
}


exports.run = function (command, cb) {
  exec("curl " + command, { maxBuffer : 2048 * 1024 }, function (error, stdout, stderr) {
    cb(null, {payload: stdout, stats: parseStats(stderr)});
  })
    .on('error', function (err) {
      cb(err, null);
    });
};

exports.connect = function (connOptions) {

  var ctx = this;

  function getEmptyOption(option) {
    if (option.length === 1) {
      return " -" + option;
    }
    return " --" + option;
  }

  function getStringOption(option, value) {
    return getEmptyOption(option) + " \"" + value + "\"";
  }

  function processOptions(options) {
    var tmp = "";
    if (options) {
      Object.keys(options).forEach(function (option) {
        var values = options[option];
        if (!values) {
          tmp += getEmptyOption(option);
        } else if (values.toLowerCase) {
          tmp += getStringOption(option, values);
        } else if (Array.isArray(values)) {
          values.forEach(function (value) {
            tmp += getStringOption(option, value);
          });
        }
      });
    }
    return tmp;
  }

  function getOptions(options) {
    return processOptions(connOptions) + processOptions(options);
  }

  function getCommand(url, options) {
    return url + getOptions(options);
  }

  return {
    head: function (url, options, cb) {
      var command = "--HEAD " + getCommand(url, options);
      ctx.run(command, cb);
    },

    get: function (url, options, cb) {
      var command = "--GET " + getCommand(url, options);
      ctx.run(command, cb);
    },

    post: function (url, options, cb) {
      var command = getCommand(url, options);
      ctx.run(command, cb);
    },

    put: function (url, options, cb) {
      var command = "--request PUT " + getCommand(url, options);
      ctx.run(command, cb);
    },

    del: function (url, options, cb) {
      var command = "--include --request DELETE" + getCommand(url, options);
      ctx.run(command, cb, true);
    }
  };
};

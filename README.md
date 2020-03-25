curling
=======

[![Build Status](https://travis-ci.org/hgarcia/curling.png?branch=master)](https://travis-ci.org/hgarcia/curling)

A node wrapper for curl with a very simple api.

History:

1.0.0 Removes curl.run because of a possible security issue reported by the Snyk team

0.3.0: Increase max buffer size for curl response. By [romansky](https://github.com/romansky) - [pull request](https://github.com/hgarcia/curling/pull/1)
0.2.0: First release

## API

Exports only one methods `connect`

### connect(options)

This method takes an `options` object with general options that will be re-used in each command.

    var options = {user: "hernan:secret"};

It returns a connection object.

### Connection object API

It has five methods, each corresponding to an HTTP verb. They all have the same signature: `method(url, options, cb)`. The method are:

    head();
    get();
    post();
    put();
    del();  //DELETE

The callback takes two parameters `cb(err, result)` where the result is a `curl-result` object.


### curl-result

It has two properties, `payload` and `stats`. The payload contains the data returned in the stdout by curl while the stats is an object that parse as the content of stderr.

Stats is of the form:

    {
      totalSize: 0,
      received: 0,
      xferd: 0,
      averageDownloadSpeed: 0,
      averageUploadSpeed: 0,
      totalTime: 0,
      timeSpent: 0,
      timeLeft: 0,
      currentSpeed: '0 Kb'
    }

The time properties are converted to milliseconds, the rest of the properties are of type `Number` in the same units as returned by curl except for the `currentSpeed` that is a string with the unit at the end (again as returned by curl).

## Passing options.

There are two ways to pass options and data to a request.
You can use the `options` for the `connect` method and this options will be used in each and every request.
You can also use the `options` object in each of the verb methods.

The `options` object is actually a hash where the keys should be the name of the flag in a curl command, for example to set an Accept header and pass some data you could pass an `options` as the following.

    var options = {
      header: "Accept: text/html",
      data: ["name=hernan", "last=garcia"]
    };

The keys in an `options` object can be one of the following types, String, Array or null.

Strings are useful when you only need to set a single value, arrays are used to pass multiple values, like data, header and so. Null is a special case and is used for empty flags, like `--false`.

curling
=======

A node wrapper for curl with a very simple api.

History:

0.3.0: Increase max buffer size for curl response. By [romansky](https://github.com/romansky) - [pull request](https://github.com/hgarcia/curling/pull/1)
0.2.0: First release

## API

Exports only two methods `connect` and `run`

### run(command, cb)

You shouldn't have to use `run` but is in there just as a convenience or if you need to do something crazy that is not possible to do via the connection object.

It pretty much allow you to send any command with any option to curl. It used internally by connect and the connection object.

Ex:

    var curl = require('curling');
    curl.run("--GET http://www.cnn.com", function (err, result) {
      console.log(result.payload); // should output the html for the cnn page to console.
      console.log(result.stats);   // should output some of the statistics on downloading the page
    });

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

Strings are useful when you only need to set a single value, arrays are used to pass multiple values, like data, header and so. Null is a specialcase and is used for empty flags, like `--false`.

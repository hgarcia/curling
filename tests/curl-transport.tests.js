var should = require("should");
var curl = require('../index');
var sinon = require('sinon');

describe('curl', function() {
  describe('.run(command, cb)', function () {
    it('should run a command', function (done) {
      curl.run("--GET http://www.google.ca", function (err, result) {
        result.payload.should.be.ok;
        console.log(result.stats);
        done(err);
      });
    });
  });

  describe('.connect(null)', function () {
    it('should return a connection object', function () {
      var connection = curl.connect(null);
      connection.should.have.property('head');
      connection.should.have.property('get');
      connection.should.have.property('post');
      connection.should.have.property('put');
      connection.should.have.property('del');
    });
  });

  describe('.connect(options)', function () {
    it('should return a connection object', function () {
      var connection = curl.connect({user: 'hernan:secret'});
      connection.should.have.property('head');
      connection.should.have.property('get');
      connection.should.have.property('post');
      connection.should.have.property('put');
      connection.should.have.property('del');
    });
  });


  describe('.connect({header: [], user: ""})', function () {
    var connection;
    beforeEach(function () {
      connection = curl.connect({header: ["Accept: text/html"], user: 'hernan:secret'});
      sinon.stub(curl, 'run', function (command, cb) { cb(null, true); });
    });

    afterEach(function () {
      connection = null;
      curl.run.restore();
    });

    describe('.head(url, null, cb)', function () {
      it('should combine options in command', function (done) {
        connection.head('http://www.dynamicprogrammer.com', null, function (err, result) {
          curl.run.calledOnce.should.be.ok;
          curl.run.args[0][0].should.eql("--HEAD http://www.dynamicprogrammer.com --header \"Accept: text/html\" --user \"hernan:secret\"");
          done(err);
        });
      });
    });
  });


  describe('.connect(options)', function () {
    var connection;
    beforeEach(function () {
      connection = curl.connect({user: 'hernan:secret'});
      sinon.stub(curl, 'run', function (command, cb) { cb(null, true); });
    });

    afterEach(function () {
      connection = null;
      curl.run.restore();
    });

    describe('.head(url, null, cb)', function () {
      it('should build a proper command', function (done) {
        connection.head('http://www.dynamicprogrammer.com', null, function (err, result) {
          curl.run.calledOnce.should.be.ok;
          curl.run.args[0][0].should.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\"");
          done(err);
        });
      });
    });

    describe('.head(url, {header: string}, cb)', function () {
      it('should build a proper command with some args', function (done) {
        connection.head('http://www.dynamicprogrammer.com', {header: "Accept: text/html"}, function (err, result) {
          curl.run.calledOnce.should.be.ok;
          curl.run.args[0][0].should.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" --header \"Accept: text/html\"");
          done(err);
        });
      });
    });


    describe('.head(url, {header: string, fail: null}, cb)', function () {
      it('should build a proper command with some args', function (done) {
        connection.head('http://www.dynamicprogrammer.com', {header: "Accept: text/html", fail: null}, function (err, result) {
          curl.run.calledOnce.should.be.ok;
          curl.run.args[0][0].should.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" --header \"Accept: text/html\" --fail");
          done(err);
        });
      });
    });

    describe('.head(url, {header: []}, cb)', function () {
      it('should build a proper command with some args', function (done) {
        connection.head('http://www.dynamicprogrammer.com', {header: ["Accept: text/html", "X-Custom: \"Hernan\""]}, function (err, result) {
          curl.run.calledOnce.should.be.ok;
          curl.run.args[0][0].should.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" --header \"Accept: text/html\" --header \"X-Custom: \"Hernan\"\"");
          done(err);
        });
      });
    });

    describe('.head(url, {H: []}, cb)', function () {
      it('should build a proper command with some args', function (done) {
        connection.head('http://www.dynamicprogrammer.com', {H: ["Accept: text/html", "X-Custom: \"Hernan\""]}, function (err, result) {
          curl.run.calledOnce.should.be.ok;
          curl.run.args[0][0].should.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" -H \"Accept: text/html\" -H \"X-Custom: \"Hernan\"\"");
          done(err);
        });
      });
    });
  });
})

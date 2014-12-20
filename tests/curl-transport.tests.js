/*jshint expr: true*/
"use strict";

describe("curl", function() {

  var curl = require("../index");
  var sinon = require("sinon");
  var expect = require("chai").expect;

  describe(".run(command, cb)", function () {
    it("should run a command", function (done) {
      curl.run("--GET http://www.google.ca", function (err, result) {
        expect(result.payload).to.not.be.null;
        console.log(result.stats);
        done(err);
      });
    });
  });

  describe(".connect(null)", function () {
    it("should return a connection object", function () {
      var connection = curl.connect(null);
      expect(connection).to.have.property("head");
      expect(connection).to.have.property("get");
      expect(connection).to.have.property("post");
      expect(connection).to.have.property("put");
      expect(connection).to.have.property("del");
    });
  });

  describe(".connect(options)", function () {
    it("should return a connection object", function () {
      var connection = curl.connect({user: "hernan:secret"});
      expect(connection).to.have.property("head");
      expect(connection).to.have.property("get");
      expect(connection).to.have.property("post");
      expect(connection).to.have.property("put");
      expect(connection).to.have.property("del");
    });
  });


  describe(".connect({header: [], user: \"\"})", function () {
    var connection;
    beforeEach(function () {
      connection = curl.connect({header: ["Accept: text/html"], user: "hernan:secret"});
      sinon.stub(curl, "run", function (command, cb) { cb(null, true); });
    });

    afterEach(function () {
      connection = null;
      curl.run.restore();
    });

    describe(".head(url, null, cb)", function () {
      it("should combine options in command", function (done) {
        connection.head("http://www.dynamicprogrammer.com", null, function (err) {
          expect(curl.run.calledOnce).to.be.true;
          expect(curl.run.args[0][0]).to.be.eql("--HEAD http://www.dynamicprogrammer.com --header \"Accept: text/html\" --user \"hernan:secret\"");
          done(err);
        });
      });
    });
  });


  describe(".connect(options)", function () {
    var connection;
    beforeEach(function () {
      connection = curl.connect({user: "hernan:secret"});
      sinon.stub(curl, "run", function (command, cb) { cb(null, true); });
    });

    afterEach(function () {
      connection = null;
      curl.run.restore();
    });

    describe(".head(url, null, cb)", function () {
      it("should build a proper command", function (done) {
        connection.head("http://www.dynamicprogrammer.com", null, function (err) {
          expect(curl.run.calledOnce).to.be.true;
          expect(curl.run.args[0][0]).to.be.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\"");
          done(err);
        });
      });
    });

    describe(".head(url, {header: string}, cb)", function () {
      it("should build a proper command with some args", function (done) {
        connection.head("http://www.dynamicprogrammer.com", {header: "Accept: text/html"}, function (err) {
          expect(curl.run.calledOnce).to.be.true;
          expect(curl.run.args[0][0]).to.be.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" --header \"Accept: text/html\"");
          done(err);
        });
      });
    });


    describe(".head(url, {header: string, fail: null}, cb)", function () {
      it("should build a proper command with some args", function (done) {
        connection.head("http://www.dynamicprogrammer.com", {header: "Accept: text/html", fail: null}, function (err) {
          expect(curl.run.calledOnce).to.be.true;
          expect(curl.run.args[0][0]).to.be.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" --header \"Accept: text/html\" --fail");
          done(err);
        });
      });
    });

    describe(".head(url, {header: []}, cb)", function () {
      it("should build a proper command with some args", function (done) {
        connection.head("http://www.dynamicprogrammer.com", {header: ["Accept: text/html", "X-Custom: \"Hernan\""]}, function (err, result) {
          expect(curl.run.calledOnce).to.be.true;
          expect(curl.run.args[0][0]).to.be.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" --header \"Accept: text/html\" --header \"X-Custom: \"Hernan\"\"");
          done(err);
        });
      });
    });

    describe(".head(url, {H: []}, cb)", function () {
      it("should build a proper command with some args", function (done) {
        connection.head("http://www.dynamicprogrammer.com", {H: ["Accept: text/html", "X-Custom: \"Hernan\""]}, function (err) {
          expect(curl.run.calledOnce).to.be.true;
          expect(curl.run.getCall(0).args[0]).to.be.eql("--HEAD http://www.dynamicprogrammer.com --user \"hernan:secret\" -H \"Accept: text/html\" -H \"X-Custom: \"Hernan\"\"");
          done(err);
        });
      });
    });
  });
});

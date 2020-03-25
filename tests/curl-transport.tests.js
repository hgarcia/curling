/*jshint expr: true*/
"use strict";

describe("curl", function() {

  var curl = require("../index");
  var sinon = require("sinon");
  var expect = require("chai").expect;

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
});

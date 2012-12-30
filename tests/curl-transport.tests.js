var should = require("should");
var curl = require('../index');

function catchCreateException(options) {
  return function () {
    try {
      bitbucket.createClient(options);
    } catch (e) {
      return;
    }
    throw new Error('No error throw by class with options: ' + JSON.stringify(options));
  };
}

function catchCreateRepoException(options, cb, done) {
  return function (done) {
    try {
      bitbucket.createClient(goodOptions)
      .getRepository(options, cb);
    } catch (e) {
      return done();
    }
    done(Error('No error throw by class with options: ' + JSON.stringify(options)));
  };
}

describe('BitBucket', function() {
  describe('.createClient()', function () {
    it('should throw when no options passed', catchCreateException());
    it('should throw when empty options passed', catchCreateException({}));
    it('should throw when options with no username or password', catchCreateException({username: '', password: ''}));
    it('should create a client', function () {
      var client = bitbucket.createClient(goodOptions);
      client.username.should.eql(goodOptions.username);
      client.password.should.eql(goodOptions.password);
    });
  });

  describe(".repositories()", function () {
    it('should return a list of repositories for the user', function (done) {
      var client = bitbucket.createClient(goodOptions);
      client.repositories(function (err, repositories) {
        Array.isArray(repositories).should.be.ok;
        done();
      });
    });
  });

  describe(".getRepository()", function () {
    it('should throw if no options passed', catchCreateRepoException(null, null));
    it('should throw if empty options passed', catchCreateRepoException({}, null));
    it('should throw if options with no username and password passed', catchCreateRepoException({slug: '', owner: ''}, null));
    it('should throw if no cb passed', catchCreateRepoException({slug: 'app', owner: 'inline'}, null));
    it('should return a Repository object', function (done) {
      var client = bitbucket.createClient(goodOptions);
      client.getRepository(repoData, function (err, repository) {
        repository.should.have.property('provider');
        repository.should.have.property('resourceURI');
        repository.resourceURI.should.eql('/1.0/repositories/inline/app');
        done();
      });
    });
  });

});

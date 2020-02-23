var request = require('supertest');

describe('Testing app workflow', function () {
  let server;

  beforeEach(async function () {
    const models  = require('./models');
    await models.sequelize.sync()
    server = require('./server');
    let port = 3666;
    server = server.listen(port, () => console.log(`Memory server for tests listening on port ${port}!`))
  });
  afterEach(function () {
    server.close();
  });


  it('responds to /scores', function testGetScores(done) {
  request(server)
    .get('/scores')
    .expect(200, [], done);
  });

  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

  it('should create a score', function(done) {
    request(server)
      .post('/scores')
      .send({
        duration: 42
      })
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body.createdAt = '2020-02-22T19:25:00Z';
        res.body.updatedAt = '2020-02-22T19:25:00Z';
      })
      .expect(200, {
        id: 1,
        duration: 42,
        createdAt: '2020-02-22T19:25:00Z',
        updatedAt: '2020-02-22T19:25:00Z'
      }, done);
  });

  it('should now have one score', function(done) {
    request(server)
      .get('/scores')
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body[0].createdAt = '2020-02-22T19:25:00Z';
        res.body[0].updatedAt = '2020-02-22T19:25:00Z';
      })
      .expect(200, [{
        id: 1,
        duration: 42,
        createdAt: '2020-02-22T19:25:00Z',
        updatedAt: '2020-02-22T19:25:00Z'
      }], done);
  });

  it('should create a second better score', function(done) {
    request(server)
      .post('/scores')
      .send({
        duration: 21
      })
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body.createdAt = '2020-02-22T19:25:00Z';
        res.body.updatedAt = '2020-02-22T19:25:00Z';
      })
      .expect(200, {
        id: 2,
        duration: 21,
        createdAt: '2020-02-22T19:25:00Z',
        updatedAt: '2020-02-22T19:25:00Z'
      }, done);
  });

  it('should now have two scores, ordered by best first', function(done) {
    request(server)
      .get('/scores')
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body[0].createdAt = '2020-02-22T19:25:00Z';
        res.body[0].updatedAt = '2020-02-22T19:25:00Z';
        res.body[1].createdAt = '2020-02-22T19:25:00Z';
        res.body[1].updatedAt = '2020-02-22T19:25:00Z';
      })
      .expect(200, [
        {
          id: 2,
          duration: 21,
          createdAt: '2020-02-22T19:25:00Z',
          updatedAt: '2020-02-22T19:25:00Z'
        },
        {
          id: 1,
          duration: 42,
          createdAt: '2020-02-22T19:25:00Z',
          updatedAt: '2020-02-22T19:25:00Z'
        },
      ], done);
  });

  it('should limit returned scores', function(done) {
    request(server)
      .get('/scores?limit=1')
      .set('Accept', 'application/json')
      .expect(function(res) {
        res.body[0].createdAt = '2020-02-22T19:25:00Z';
        res.body[0].updatedAt = '2020-02-22T19:25:00Z';
      })
      .expect(200, [
        {
          id: 2,
          duration: 21,
          createdAt: '2020-02-22T19:25:00Z',
          updatedAt: '2020-02-22T19:25:00Z'
        },
      ], done);
  });


});

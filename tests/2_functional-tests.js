/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */
  let id = 0; // for future tests
  
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      //#1
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post("/api/books")
          .send({
            "title": "TestTitle1"
          })
          .end(function(err, res) {
            id = res.body._id;
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.title, "TestTitle1")
            assert.isNotNull(res.body._id)
            console.log("id has been set as " + id)
            done();
          });
      });
      
      //#2
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post("/api/books")
          .send({
            "comment": "with no title"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      //#3
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      //#4
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/" + "with id not in db")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
      //#5
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/" + id) // valid id
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'commentcount');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.isArray(res.body.comments);
            done();
          });
      });  
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      //#6
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .keepOpen()
          .post("/api/books/" + id) //valid id
          .send({
            comment: "TestComment1"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'commentcount');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.isArray(res.body.comments);
            done();
          });
      });
      
      //#7
      test('Test POST /api/books/[id] without comment field', function(done){
        chai 
          .request(server)
          .keepOpen()
          .post("/api/books/" + id) //valid id
          .send({
            nocomment: "without comment field"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body, 'missing required field comment');
            done();
          });
      });
      
      //#8
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai 
          .request(server)
          .keepOpen()
          .post("/api/books/" + "id not in db") //id not in db
          .send({
            comment: "TestComment2"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      //#9
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai 
          .request(server)
          .keepOpen()
          .delete("/api/books/" + id) // valid id
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body, 'delete successful');
            done();
          });
      });
      //#10
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai  
          .request(server)
          .keepOpen()
          .delete("/api/books/" + "id not in db") // id not in db
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

  });

});

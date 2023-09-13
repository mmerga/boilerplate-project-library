/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected successfully...'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Schema = mongoose.Schema;

const LibrarySchema = new Schema({
  "title": { type: String, required: true },
  "commentcount": { type: Number, default: 0},
  "comments": { type: [] }
});

const Books = mongoose.model("Book", LibrarySchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Books.find({}, (err, books) =>{
        if(err){
          res.json({ error: err.message});
        }else if(!books){
          res.json('no book exists');
        }else{
          let array = [];
          array = books.map( x => ({
            "_id": x._id,
            "title": x.title,
            "commentcount": x.commentcount
          }));
          res.json(array);
        }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.json('missing required field title');
      }else{
        const book = new Books({
          "title": title
        });
        book.save((err, newBook) => {
          if (err) {
             res.json({ error: err.message });
          }else{
           res.json({
             "title": newBook.title,
             "_id": newBook._id
           });
          }
        });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Books.deleteMany({}, (err, manyBooks) => {
        if(err){
          res.json({error: err.message});
        }else if(!manyBooks){
          res.json('something went wrong')
        }else{
          res.json('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;  
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Books.findById(bookid, (err, book) => {
        if(err || !book){
          res.json('no book exists');
        }else{
          res.json(book);
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        res.json('missing required field comment');
      }else{
        Books.findById(bookid, (err, book) => {
          if(err){
            res.json({error: err.message});
          }else if(!book){
            res.json('no book exists');
          }else{
            book.comments.push(comment);
            book.commentcount+=1;
            book.save((err, newBook) => {
              if (err) {
                 res.json({ error: err.message });
              }else{
               res.json(newBook);
              }
            });
          }
        });
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id; 
      //if successful response will be 'delete successful'
      Books.findByIdAndDelete(bookid, (err, book) => {
        if(err){
          res.json({error: err.message});
        }else if(!book){
          res.json('no book exists');
        }else{
          res.json('delete successful');
        }
      });
    });
  
};

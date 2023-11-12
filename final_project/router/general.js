const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password){
      if (!isValid(username)) {
          users.push({"username": username, "password": password})
          res.send("Customer successfully registered. Now you can login.")
      } 
      else {
          return res.status(400).json({message: "User already exists."})
      }
  }
  else{
      return res.status(400).json({message: "Couldn't register user."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reqBook = books[isbn];
    
    if(reqBook){
        res.send(reqBook);
    } 
    else {
        return res.status(404).json({message: `Book with isbn ${isbn} not found.`})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const reqBooks = [];

  for (let key of keys) {
      let book = books[key];
      if (author == book["author"]) {
          reqBooks.push(book);
      }
  }

  if (reqBooks.length){
      res.send({"booksbyauthor": reqBooks});
  }
  else {
      return res.status(404).json({message: `Books with author ${author} were not found`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const reqBooks = [];

    for (let key of keys) {
        let book = books[key];
        if (title == book["title"]) {
            reqBooks.push(book);
        }
    }

    if (reqBooks.length){
        res.send({"booksbytitle": reqBooks});
    }
    else {
        return res.status(404).json({message: `Book with title ${title} was not found`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reqBook = books[isbn];

    if(reqBook){
        res.send(reqBook['reviews']);
    }
    else {
        return res.status(400).json({message: `Book with isbn ${isbn} was not found.`})
    }
});

module.exports.general = public_users;

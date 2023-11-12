const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let filtered = users.filter(user => {
        return user.username === username;
    })

    if (filtered.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let filtered = users.filter((user) => {
        return (username === user.username) && (password === user.password);
    })

    if (filtered.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
      if (authenticatedUser(username, password)) {
          let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
          req.session.authorization = {
              accessToken, username
          }

          res.send("Customer successfully logged in")
      }
      else {
          return res.status(403).json({message: "Incorrect username or password."})
      }
  }
  else {
      return res.status(403).json({message: "Couldn't login."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username']
    
    if (books[isbn]){
        books[isbn]["reviews"][username] = review;
        console.log(books[isbn])
        res.send(`The review for the book with ISBN ${isbn} has been added/updated.`)
    }
    else {
        return res.status(404).json({message: `Book with ISBN ${isbn} was not found.`})
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username']
    
    if (books[isbn]){
        if ( books[isbn]["reviews"][username]) {
            delete books[isbn]["reviews"][username]
            console.log(books[isbn])
            res.send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`)
        }
        else{
            return res.status(404).json({message: "Review not found."})
        }
    }
    else {
        return res.status(404).json({message: `Book with ISBN ${isbn} was not found.`})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

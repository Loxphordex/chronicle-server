const express = require('express');
const BooksRouter = express.Router();
const bodyParser = express.json();
const BookServices = require('./books-services');
const path = require('path');

BooksRouter
  .route('/:keyword')
  .get((req, res) => {
    const keyword = req.params.keyword;

    if (!keyword) {
      return res.status(400).json({ error: 'Missing keyword in request params' });
    }

    BookServices.getAllByKeyword(req.app.get('db'), req.user.id, keyword)
      .then(books => {
        if (!books) {
          return res.status(200).json({ books: {} });
        }
        return res.status(200).json(books);
      });
  });

BooksRouter
  .route('/newBook')
  .post(bodyParser, (req, res, next) => {
    if (typeof req.body === 'object') {
      // Submit new book into database
      const { 
        user_id,
        title,
        author,
        genre,
        price,
        num_in_stock,
        publisher,
        year_published,
        print_edition,
        text_language,
      } = req.body;

      if (!title) {
        return res.status(404).json({ error: 'Missing title in request body' });
      }
      if (!author) {
        return res.status(404).json({ error: 'Missing author in request body' });
      }

      const newBook = {
        user_id,
        title,
        author,
        genre,
        price,
        num_in_stock,
        publisher,
        year_published,
        print_edition,
        text_language,
      };

      newBook.user_id = req.user.id;

      BookServices.insertBook(req.app.get('db'), newBook)
        .then(book => {
          return res.status(201)
            .location(path.posix.join(req.originalUrl, `/${book.id}`))
            .json(book);
        })
        .catch(next);
    }
    else {
      return res.status(404).json({ error: 'Invalid request body' });
    }
  });

module.exports = BooksRouter;
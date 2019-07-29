const BooksServices = {
  getById(db, id) {
    return db('books')
      .select('*')
      .where('books.id', id)
      .first();
  },
  insertBook(db, newBook) {
    return db
      .insert(newBook)
      .into('books')
      .returning('*')
      .then(([book]) => book)
      .then(book => BooksServices.getById(db, book.id));
  },
  getAllByKeyword(db, id, keyword) {
    return db('books')
      .select('*')
      .where('user_id', id)
      .andWhere('title', 'like', `%${keyword}%`)
      .orWhere('author', 'like', `%${keyword}%`);
  },
};

module.exports = BooksServices;
class Book {
  constructor(
    title,
    author,
    publisher,
    cover,
    pubdate,
    isbn,
    seriesName,
    categoryName,
    like,
    have,
    link,
  ) {
    this.title = title
    this.author = author
    this.publisher = publisher
    this.cover = cover
    this.pubdate = pubdate
    this.isbn = isbn
    this.seriesName = seriesName
    this.categoryName = categoryName
    this.like = false
    this.have = false
    this.link = link
  }
}

export default Book

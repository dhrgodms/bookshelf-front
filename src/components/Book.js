class Book {
  constructor(
    title,
    author,
    publisher,
    cover,
    pubDate,
    isbn13,
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
    this.pubDate = pubDate
    this.isbn13 = isbn13
    this.seriesName = seriesName
    this.categoryName = categoryName
    this.like = false
    this.have = false
    this.link = link
  }
}

export default Book

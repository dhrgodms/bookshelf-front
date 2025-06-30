class MemberBookNew {
  constructor(
    id,
    title,
    author,
    publisher,
    cover,
    pubdate,
    isbn,
    seriesName,
    categoryName,
    link,
    memberId,
    bookId,
    bookshelfId,
    shelfId,
  ) {
    this.id = id
    this.title = title
    this.author = author
    this.publisher = publisher
    this.cover = cover
    this.pubdate = pubdate
    this.isbn = isbn
    this.seriesName = seriesName
    this.categoryName = categoryName
    this.link = link
    this.memberId = memberId
    this.bookId = bookId
    this.bookshelfId = bookshelfId
    this.shelfId = shelfId
  }
}

export default MemberBookNew

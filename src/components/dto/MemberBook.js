class MemberBook {
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
    memberId,
    memberbookId,
    bookId,
    aladinUrl,
  ) {
    this.title = title
    this.author = author
    this.publisher = publisher
    this.cover = cover
    this.pubdate = pubdate
    this.isbn = isbn
    this.seriesName = seriesName
    this.categoryName = categoryName
    this.like = like
    this.have = have
    this.memberId = memberId
    this.memberbookId = memberbookId
    this.bookId = bookId
    this.aladinUrl = aladinUrl
  }
}

export default MemberBook

class ShelfDto {
  constructor(id, shelfName, shelfMemo, creator, savedDate) {
    ;(this.id = id),
      (this.shelfName = shelfName),
      (this.shelfMemo = shelfMemo),
      (this.shelfCreator = creator?.username)
    this.savedDate = savedDate
  }
}

export default ShelfDto

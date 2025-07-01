class MemberShelfDto {
  constructor(id, memberDto, shelfDto, savedDate) {
    ;(this.id = id),
      (this.memberId = memberDto?.username),
      (this.shelfId = shelfDto?.id),
      (this.shelfName = shelfDto?.shelfName),
      (this.shelfMemo = shelfDto?.shelfMemo),
      (this.shelfCreator = shelfDto?.creator?.username)
    this.savedDate = savedDate
  }
}

export default MemberShelfDto

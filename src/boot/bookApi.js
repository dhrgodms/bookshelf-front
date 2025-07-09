import { api } from './axios'

export async function own(book, user, bookshelfId, shelfId) {
  return await api.post(`/api/v1/memberbooksnew`, {
    bookDto: book,
    bookshelfId: bookshelfId,
    shelfId: shelfId,
  })
}

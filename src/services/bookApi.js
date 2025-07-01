import axios from 'axios'

const API_URL = 'http://localhost:8080/api/v1'

export const getBookByIsbn = async (isbn) => {
  try {
    const response = await axios.get(`${API_URL}/books/isbn/${isbn}`)
    return response.data
  } catch (error) {
    // API에서 책을 찾지 못한 경우 기본 객체 반환
    if (error.response && error.response.status === 404) {
      return {
        isbn: isbn,
        title: '',
        author: '',
        publisher: '',
        publishDate: '',
        coverImageUrl: '',
        description: '',
        status: '새 책',
        location: '',
        purchaseInfo: '',
      }
    }
    throw error
  }
}

export const saveBookToLibrary = async (book) => {
  try {
    const response = await axios.post(`${API_URL}/books/scan`, book)
    return response.data
  } catch (error) {
    console.error('책 저장 중 오류 발생:', error)
    throw error
  }
}

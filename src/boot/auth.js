import axios from 'axios'

export async function login(email, password) {
  return axios.post(`${process.env.SPRING_SERVER}/login`, {
    email,
    password,
  })
}

export async function logout() {
  return axios.post(
    axios.post(
      `${process.env.SPRING_SERVER}/logout`,
      {},
      {
        headers: {
          access: localStorage.getItem('access'),
          refresh: localStorage.getItem('refresh'),
        },
      },
    ),
  )
}

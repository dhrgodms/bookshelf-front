export const editLength = (str, limit) => {
  if (str && str.length > limit) {
    return str.substr(str, limit) + '...'
  }
  return str
}
export const editDate = (str, limit) => {
  if (str && str.length > limit) {
    return str.substr(str, limit)
  }
  return str
}

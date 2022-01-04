export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const seed = '0123456789abcdef'
export const getRandomColor = () => {
  let hex = '#'
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * seed.length)
    hex += seed.slice(index, index + 1)
  }
  return hex
}

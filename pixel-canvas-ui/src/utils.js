export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const seed = '0123456789abcdef'
export const getRandomColor = () => {
  const choices = []
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * seed.length)
    choices.push(seed.slice(index, index + 1))
  }
  let hex = '#'
  for (const h of choices) {
    hex += h
  }
  return hex
}

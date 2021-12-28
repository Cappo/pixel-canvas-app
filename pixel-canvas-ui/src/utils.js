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
const rAtt = [
  'tired',
  'happy',
  'hungry',
  'omniscient',
  'imposter',
  'friendly',
  'powerful',
  'super',
  'diabolical',
  'clever',
  'scared',
  'secret',
  'spotted',
  'grounded',
  'purple',
]
const rNoun = [
  'penguin', // 🐧
  'tiger', // 🐯
  'airplane', // ✈️
  'firefly', // 🪰
  'pupper', // 🐶
  'llama', // 🦙
  'parrot', // 🦜
  'flower', // 🌸
  'bird', // 🕊
  'apple', // 🍎
  'pepper', // 🌶
  'dinosaur', // 🦖
  'alligator', // 🐊
  'wolf', // 🐺
  'spider', // 🕷
]

export const emoji = {
  penguin: '🐧',
  tiger: '🐯',
  airplane: '🛩',
  firefly: '🪰',
  pupper: '🐶',
  llama: '🦙',
  parrot: '🦜',
  flower: '🌸',
  bird: '🕊',
  apple: '🍎',
  pepper: '🌶',
  dinosaur: '🦖',
  alligator: '🐊',
  wolf: '🐺',
  spider: '🕷',
}

const randomNumber = Math.floor(Math.random() * 1000)
export const randomNameObj = {
  attribute: rAtt[Math.floor(Math.random() * rAtt.length)],
  noun: rNoun[Math.floor(Math.random() * rNoun.length)],
  number: String(randomNumber).padStart(3, '0'),
}
export const randomName = Object.values(randomNameObj).join('-')

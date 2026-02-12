export function getRandomTags(arr) {
  const randomNumber = Math.floor(Math.random() * arr.length)
  const shuffled = arr.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, randomNumber)
}

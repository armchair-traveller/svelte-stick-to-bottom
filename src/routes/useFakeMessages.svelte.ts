import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum()

export function useFakeMessages(speed = 1) {
  let messages = $state<string[][]>([])

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getInterval = () => getRandomInt(2 * (1 - speed), 120 * (1 - speed))
  const getWordCount = () => getRandomInt(10, 150)
  const getWords = () => Math.round(50 * speed)

  $effect(() => {
    let wordCount = 0
    let timer: ReturnType<typeof setTimeout>

    const update = () => {
      if (wordCount <= 0) {
        wordCount = getWordCount()
        messages = [...messages, []]
      }

      const Tag = Math.random() < 0.1 ? 'h1' : null

      let words = getWords()
      if (words > wordCount) {
        words = wordCount
      }

      const newMessages = [...messages]
      const text = lorem.generateWords(words)
      const lastMessage = newMessages[newMessages.length - 1]

      lastMessage.push(Tag ? `<${Tag}>${text}</${Tag}>` : text)
      messages = newMessages

      wordCount -= words

      timer = setTimeout(update, getInterval())
    }

    timer = setTimeout(update, getInterval())

    return () => clearTimeout(timer)
  })

  return {
    get messages() {
      return messages
    },
  }
}

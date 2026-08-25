type CleanTextOptions = {
  words?: string[]
  substrings?: string[]
  removeLinks?: boolean
  removeEmojis?: boolean
}

export function cleanText(
  text?: string,
  {
    words = [],
    substrings = [],
    removeLinks = true,
    removeEmojis = true,
  }: CleanTextOptions = {}
): string {
  if (!text || text.length === 0) {
    return ""
  }

  let result = text

  // Remove links
  if (removeLinks) {
    result = result.replace(/(?:https?:\/\/|www\.)[^\s]+/gi, "")
  }

  // Remove emojis
  if (removeEmojis) {
    result = result.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      ""
    )
  }

  // Remove exact words
  if (words.length > 0) {
    const escapedWords = words.map(escapeRegExp).join("|")

    result = result.replace(new RegExp(`\\b(?:${escapedWords})\\b`, "gi"), "")
  }

  // Remove words containing any of the provided substrings
  if (substrings.length > 0) {
    const escapedSubstrings = substrings.map(escapeRegExp).join("|")

    result = result.replace(
      new RegExp(`\\S*(?:${escapedSubstrings})\\S*`, "gi"),
      ""
    )
  }

  // Normalize whitespace
  return result.replace(/\s+/g, " ").trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

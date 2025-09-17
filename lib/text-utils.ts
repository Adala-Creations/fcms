// Text utility functions for better text handling in cards and components

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const truncateTextWithTooltip = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return { text, showTooltip: false }
  return { text: text.substring(0, maxLength) + '...', showTooltip: true }
}

// CSS classes for common text truncation patterns
export const textTruncateClasses = {
  singleLine: 'truncate',
  twoLines: 'line-clamp-2',
  threeLines: 'line-clamp-3',
  multiLine: 'line-clamp-3 overflow-hidden'
}

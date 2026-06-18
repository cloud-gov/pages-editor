export function formatFileSize(
  bytes?: number | null,
): string {
  if (!bytes || bytes <= 0) {
    return '0B'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']

  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${Math.floor(size)}${units[unitIndex]}`
}

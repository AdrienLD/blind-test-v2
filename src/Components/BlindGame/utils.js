export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function cancelableSleep(duration, signal) {
  return new Promise(resolve => {
    const timeoutId = setTimeout(() => resolve({ ok: true }), duration)
    signal.onabort = () => {
      clearTimeout(timeoutId)
      resolve({ ok: false })
    }
  })
}

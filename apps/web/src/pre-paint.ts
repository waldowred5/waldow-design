/**
 * The mode's storage key and system-preference rule, and the inline script that applies them
 * before first paint (stored choice, else the system preference), so there is no flash of the
 * wrong colours. vite.config.ts injects the script into index.html; theme-mode.ts takes over
 * once the app loads. The script is a fixed string, so a CSP can allow it by its sha256 hash.
 */
export const MODE_STORAGE_KEY = 'waldow-design:mode'
export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)'

export const prePaintScript = `(function () {
  var mode
  try {
    mode = localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)})
  } catch (e) {}
  if (mode !== 'light' && mode !== 'dark') mode = matchMedia(${JSON.stringify(SYSTEM_DARK_QUERY)}).matches ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', mode)
})()`

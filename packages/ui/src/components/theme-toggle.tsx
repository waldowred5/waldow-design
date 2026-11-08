import { MoonIcon, SunIcon } from 'lucide-react'
import { Button, type ButtonProps } from './button'

export type Theme = 'light' | 'dark'

export type ThemeToggleProps = Omit<ButtonProps, 'onClick' | 'children' | 'size'> & {
  /** The theme the page shows now. */
  theme: Theme
  /** Called with the other theme when the person presses the toggle. */
  onThemeChange: (theme: Theme) => void
}

/**
 * Switches between the light and dark theme. It only reports the choice: the app applies it
 * (for example by setting `data-theme` on `<html>`) and remembers it.
 *
 * ```tsx
 * const theme = useTheme()
 * <ThemeToggle theme={theme} onThemeChange={setTheme} />
 * ```
 *
 * **Accessibility**
 * - An icon button whose name is the action, "Switch to dark mode", rather than a pressed
 *   state: a toggle named "Dark mode" that reads "not pressed" in light mode is easy to misread.
 * - The icon shows the theme you will switch to, matching the name.
 */
export function ThemeToggle({ theme, onThemeChange, variant = 'ghost', ...props }: ThemeToggleProps) {
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const Icon = next === 'dark' ? MoonIcon : SunIcon
  return (
    <Button data-slot="theme-toggle" variant={variant} size="icon" aria-label={`Switch to ${next} mode`} onClick={() => onThemeChange(next)} {...props}>
      <Icon aria-hidden="true" />
    </Button>
  )
}

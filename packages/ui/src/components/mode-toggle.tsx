import { MoonIcon, SunIcon } from 'lucide-react'
import { Button, type ButtonProps } from './button'

export type Mode = 'light' | 'dark'

export type ModeToggleProps = Omit<ButtonProps, 'onClick' | 'children' | 'size'> & {
  /** The mode the page shows now. */
  mode: Mode
  /** Called with the other mode when the person presses the toggle. */
  onModeChange: (mode: Mode) => void
}

/**
 * Switches between light and dark mode. It only reports the choice: the app applies it
 * (for example by setting `data-theme` on `<html>`) and remembers it.
 *
 * ```tsx
 * const mode = useMode()
 * <ModeToggle mode={mode} onModeChange={setMode} />
 * ```
 *
 * **Accessibility**
 * - An icon button whose name is the action, "Switch to dark mode", rather than a pressed
 *   state: a toggle named "Dark mode" that reads "not pressed" in light mode is easy to misread.
 * - The icon shows the mode you will switch to, matching the name.
 */
export function ModeToggle({ mode, onModeChange, variant = 'ghost', ...props }: ModeToggleProps) {
  const next: Mode = mode === 'dark' ? 'light' : 'dark'
  const Icon = next === 'dark' ? MoonIcon : SunIcon
  return (
    <Button data-slot="mode-toggle" variant={variant} size="icon" aria-label={`Switch to ${next} mode`} onClick={() => onModeChange(next)} {...props}>
      <Icon aria-hidden="true" />
    </Button>
  )
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { buttonVariantOptions } from './button'
import { type Theme, ThemeToggle } from './theme-toggle'

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  args: { theme: 'light', onThemeChange: fn() },
  argTypes: {
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
    variant: { control: 'inline-radio', options: buttonVariantOptions.variant },
  },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

const themes: Theme[] = ['light', 'dark']

/** Every state: rows are the visual variants (`ghost` is the default), columns the current theme. */
export const States: Story = {
  render: (args) => (
    <table className="text-sm text-muted-foreground">
      <thead>
        <tr>
          <th scope="col" className="px-3 py-2 text-start font-medium">
            variant
          </th>
          {themes.map((theme) => (
            <th key={theme} scope="col" className="px-3 py-2 font-medium">
              theme: {theme}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {buttonVariantOptions.variant.map((variant) => (
          <tr key={variant}>
            <th scope="row" className="px-3 py-2 text-start font-normal">
              {variant}
            </th>
            {themes.map((theme) => (
              <td key={theme} className="px-3 py-2 text-center">
                <ThemeToggle {...args} theme={theme} variant={variant as NonNullable<typeof args.variant>} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

/** Controlled by state: press it and the printed value follows. In an app the theme lives on `<html data-theme>`. */
export const Interactive: Story = {
  render: function Render(args) {
    const [theme, setTheme] = useState<Theme>('light')
    return (
      <div className="flex items-center gap-3">
        <ThemeToggle
          {...args}
          theme={theme}
          onThemeChange={(next) => {
            setTheme(next)
            args.onThemeChange(next)
          }}
        />
        <output className="font-mono text-sm text-foreground">theme: {theme}</output>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveTextContent('theme: light')
    await userEvent.click(canvas.getByRole('button', { name: 'Switch to dark mode' }))
    await expect(args.onThemeChange).toHaveBeenCalledWith('dark')
    await expect(canvas.getByRole('status')).toHaveTextContent('theme: dark')
    await userEvent.click(canvas.getByRole('button', { name: 'Switch to light mode' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('theme: light')
  },
}

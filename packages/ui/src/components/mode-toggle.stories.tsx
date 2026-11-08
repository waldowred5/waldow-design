import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { type Mode, ModeToggle } from './mode-toggle'

const meta = {
  title: 'Components/ModeToggle',
  component: ModeToggle,
  args: { mode: 'light', onModeChange: fn() },
  argTypes: { mode: { control: 'inline-radio', options: ['light', 'dark'] } },
} satisfies Meta<typeof ModeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {}
export const Dark: Story = { args: { mode: 'dark' } }
export const Outline: Story = { args: { variant: 'outline' } }

/** Controlled by state here; in an app the mode lives on `<html data-theme>`. */
export const Toggles: Story = {
  render: function Render(args) {
    const [mode, setMode] = useState<Mode>('light')
    return (
      <ModeToggle
        {...args}
        mode={mode}
        onModeChange={(next) => {
          setMode(next)
          args.onModeChange(next)
        }}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Switch to dark mode' }))
    await expect(args.onModeChange).toHaveBeenCalledWith('dark')
    await expect(canvas.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
  },
}

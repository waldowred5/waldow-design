import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ActionBar } from './action-bar'
import { Button } from './button'
import { CardFooter } from './card'
import { DialogFooter } from './dialog'

// Below `sm` the group stacks. It must be a plain column (not reversed, no `order-*`),
// so the primary action stays last both on screen and in Tab order.
describe.each([
  ['ActionBar', ActionBar],
  ['CardFooter', CardFooter],
  ['DialogFooter', DialogFooter],
])('%s', (_, Group) => {
  it('stacks in DOM order with the primary action last', () => {
    render(
      <Group data-testid="group">
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </Group>,
    )
    const group = screen.getByTestId('group')
    expect(group).toHaveClass('flex-col', 'sm:flex-row')
    expect(group.className).not.toMatch(/reverse|order-/)
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Cancel', 'Save'])
  })
})

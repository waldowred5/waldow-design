import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { cn } from '../lib/cn'
import { Stack } from './stack'

describe('Stack', () => {
  it('maps props to token-scale classes', () => {
    render(<Stack data-testid="s" direction="horizontal" gap={2} justify="between" />)
    expect(screen.getByTestId('s')).toHaveClass('flex', 'flex-row', 'gap-2', 'justify-between')
  })

  it('renders a semantic element with asChild', () => {
    render(
      <Stack asChild>
        <ul>
          <li>One</li>
        </ul>
      </Stack>,
    )
    expect(screen.getByRole('list')).toHaveClass('flex', 'flex-col')
  })
})

describe('cn', () => {
  it('resolves conflicts between token utilities', () => {
    expect(cn('h-control-md', 'h-control-lg')).toBe('h-control-lg')
    expect(cn('rounded-control', 'rounded-pill')).toBe('rounded-pill')
    expect(cn('p-surface-inset', 'p-4')).toBe('p-4')
  })

  it('keeps size and colour text utilities together', () => {
    expect(cn('text-sm', 'text-muted-foreground')).toBe('text-sm text-muted-foreground')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './checkbox'
import { Field } from './field'
import { Input } from './input'

describe('Field', () => {
  it('labels the control', () => {
    render(<Field label="Email"><Input /></Field>)
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
  })

  it('links description and error with aria-describedby', () => {
    render(
      <Field label="Email" description="Work address" error="Required">
        <Input />
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toHaveAccessibleDescription('Work address Required')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('is valid without an error', () => {
    render(<Field label="Email"><Input /></Field>)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('marks required controls without announcing the asterisk', () => {
    render(<Field label="Email" required><Input /></Field>)
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-required', 'true')
  })

  it('wires checkboxes too', () => {
    render(<Field label="Subscribe" orientation="horizontal"><Checkbox /></Field>)
    expect(screen.getByRole('checkbox', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('lets controls work standalone', () => {
    render(<Input aria-label="Search" />)
    expect(screen.getByRole('textbox', { name: 'Search' })).not.toHaveAttribute('id')
  })
})

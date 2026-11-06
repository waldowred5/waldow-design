import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './select'

const meta = {
  title: 'Components/Select',
  component: Select,
  decorators: [(Story) => <div className="w-64"><Story /></div>],
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruit</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry" disabled>
            Cherry (out of season)
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Placeholder: Story = {}
export const WithValue: Story = { args: { defaultValue: 'banana' } }
export const Disabled: Story = { args: { disabled: true } }
/** Open by default so visual tests capture the menu. */
export const Open: Story = { args: { defaultOpen: true, defaultValue: 'apple' }, parameters: { layout: 'padded' } }

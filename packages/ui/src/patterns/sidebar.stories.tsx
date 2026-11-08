import type { Meta, StoryObj } from '@storybook/react-vite'
import { withWidth } from '../../.storybook/decorators'
import { sampleNav } from './sample-data'
import { Sidebar, SidebarGroup, SidebarLink } from './sidebar'

const meta = {
  title: 'Patterns/Sidebar',
  component: Sidebar,
  decorators: [withWidth('w-64')],
  args: { 'aria-label': 'Docs' },
  render: (args) => (
    <Sidebar {...args}>
      {sampleNav.map((group) => (
        <SidebarGroup key={group.title} title={group.title}>
          {group.pages.map((page) => (
            <SidebarLink key={page} href="#top" current={page === 'Colour'}>
              {page}
            </SidebarLink>
          ))}
        </SidebarGroup>
      ))}
    </Sidebar>
  ),
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/** "Colour" is the current page: an edge bar, weight and the link colour mark it. */
export const Default: Story = {}

/** One group, as on a small site. */
export const SingleGroup: Story = {
  render: (args) => (
    <Sidebar {...args}>
      <SidebarGroup title="Guides">
        <SidebarLink href="#top" current>
          Getting started
        </SidebarLink>
        <SidebarLink href="#top">Theming</SidebarLink>
      </SidebarGroup>
    </Sidebar>
  ),
}

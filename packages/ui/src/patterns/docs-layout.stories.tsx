import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../components/button'
import { type Theme, ThemeToggle } from '../components/theme-toggle'
import { DocsLayout } from './docs-layout'
import { Hero } from './hero'
import { NavbarBrand } from './navbar'
import { Outline } from './outline'
import { Prose } from './prose'
import { sampleNav, sampleOutline, sampleSearchItems } from './sample-data'
import { Search } from './search'
import { Sidebar, SidebarGroup, SidebarLink } from './sidebar'

function Example() {
  const [theme, setTheme] = useState<Theme>('light')
  return (
    <DocsLayout
      brand={<NavbarBrand href="#top">waldow.design</NavbarBrand>}
      actions={
        <>
          <Search items={sampleSearchItems} shortcut={false} />
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
        </>
      }
      sidebar={
        <Sidebar aria-label="Docs">
          {sampleNav.map((group) => (
            <SidebarGroup key={group.title} title={group.title}>
              {group.pages.map((page) => (
                <SidebarLink key={page} href="#top" current={page === 'Introduction'}>
                  {page}
                </SidebarLink>
              ))}
            </SidebarGroup>
          ))}
        </Sidebar>
      }
      outline={<Outline items={sampleOutline} activeId="what-is-a-design-system" />}
    >
      <Hero title="Waldow.Design" tagline="An exploration into design systems in the age of agents">
        <Button asChild>
          <a href="#top">Get started</a>
        </Button>
      </Hero>
      <Prose className="mt-12">
        {sampleOutline.map((item) =>
          item.level === 3 ? (
            <h3 key={item.id} id={item.id}>
              {item.title}
            </h3>
          ) : (
            <h2 key={item.id} id={item.id}>
              {item.title}
            </h2>
          ),
        )}
      </Prose>
    </DocsLayout>
  )
}

const meta = {
  title: 'Patterns/DocsLayout',
  component: DocsLayout,
  parameters: { layout: 'fullscreen' },
  render: () => <Example />,
} satisfies Meta<typeof DocsLayout>

export default meta
type Story = StoryObj<typeof meta>

/** The whole shell: navbar, sidebar, page and outline. Narrow the viewport to see the drawer. */
export const Default: Story = {
  // Every prop is supplied by the example; these satisfy the component's required props.
  args: { brand: null, sidebar: null, children: null },
}

/** Opens the navigation drawer from the menu button, as on a phone. */
export const NavigationDrawer: Story = {
  args: Default.args,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open navigation' }))
    const drawer = await within(document.body).findByRole('dialog', { name: 'Navigation' })
    await expect(within(drawer).getByRole('link', { name: 'Introduction' })).toHaveAttribute('aria-current', 'page')
  },
}

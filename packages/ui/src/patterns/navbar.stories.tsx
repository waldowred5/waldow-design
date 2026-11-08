import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../components/button'
import { type Theme, ThemeToggle } from '../components/theme-toggle'
import { Navbar, NavbarActions, NavbarBrand, NavbarLink, NavbarNav } from './navbar'
import { Search } from './search'
import { sampleSearchItems } from './sample-data'

const meta = {
  title: 'Patterns/Navbar',
  component: Navbar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

function Actions() {
  const [theme, setTheme] = useState<Theme>('light')
  return (
    <NavbarActions>
      <Search items={sampleSearchItems} shortcut={false} />
      <ThemeToggle theme={theme} onThemeChange={setTheme} />
    </NavbarActions>
  )
}

/** Brand at the leading edge; search and the theme toggle at the trailing edge. */
export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand href="#top">waldow.design</NavbarBrand>
      <Actions />
    </Navbar>
  ),
}

/** A link-button among the actions, for a site with a call to action. */
export const WithLink: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand href="#top">waldow.design</NavbarBrand>
      <NavbarActions>
        <Button variant="ghost" asChild>
          <a href="#top">GitHub</a>
        </Button>
        <Button asChild>
          <a href="#top">Get started</a>
        </Button>
      </NavbarActions>
    </Navbar>
  ),
}

/** A landing page: content kept to the page width, and the site's top-level links before search. */
export const Landing: Story = {
  render: () => <LandingNavbar />,
}

function LandingNavbar() {
  const [theme, setTheme] = useState<Theme>('light')
  return (
    <Navbar contained>
      <NavbarBrand href="#top">waldow.design</NavbarBrand>
      <NavbarActions>
        <NavbarNav aria-label="Main">
          <NavbarLink href="#top">Docs</NavbarLink>
          <NavbarLink href="#top">Components</NavbarLink>
        </NavbarNav>
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </NavbarActions>
    </Navbar>
  )
}

/** Inside the docs, the "Docs" link is the current section. */
export const CurrentLink: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand href="#top">waldow.design</NavbarBrand>
      <NavbarActions>
        <NavbarNav aria-label="Main">
          <NavbarLink href="#top" current>
            Docs
          </NavbarLink>
        </NavbarNav>
      </NavbarActions>
    </Navbar>
  ),
}

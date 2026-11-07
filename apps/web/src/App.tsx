import { Button, Stack } from '@waldow-design/ui'
import { lazy, Suspense } from 'react'
import { currentRoute, type Route, routes, useRoute } from './hash-route'
import { ComponentsDemo } from './pages/components-demo'
import { setMode, useMode } from './theme-mode'

// The playground carries the colour maths (culori), so it loads only when someone opens it.
const loadThemeKnobs = () => import('./pages/theme-knobs/theme-knobs-page')
const ThemeKnobsPage = lazy(loadThemeKnobs)
if (currentRoute() === 'theme-knobs') void loadThemeKnobs()

const nav: Array<{ route: Route; label: string; preload?: () => unknown }> = [
  { route: 'home', label: 'Components' },
  { route: 'theme-knobs', label: 'Theme knobs', preload: loadThemeKnobs },
]

function App() {
  const route = useRoute()

  return (
    <Stack gap={8} className="mx-auto max-w-6xl p-6">
      <Stack direction="horizontal" justify="between" align="center" gap={4} wrap asChild>
        <header>
          <Stack gap={1}>
            <h1 className="font-display text-3xl font-bold">waldow.design</h1>
            <p className="text-muted-foreground">Phase 1 components, built on tokens.</p>
          </Stack>
          <Stack direction="horizontal" align="center" gap={2} wrap>
            <Stack direction="horizontal" gap={1} asChild>
              <nav aria-label="Pages">
                {nav.map((item) => (
                  <Button key={item.route} variant={route === item.route ? 'secondary' : 'ghost'} asChild>
                    <a
                      href={routes[item.route]}
                      aria-current={route === item.route ? 'page' : undefined}
                      onPointerEnter={item.preload}
                      onFocus={item.preload}
                    >
                      {item.label}
                    </a>
                  </Button>
                ))}
              </nav>
            </Stack>
            <ModeToggle />
          </Stack>
        </header>
      </Stack>

      <main>
        {route === 'theme-knobs' ? (
          <Suspense fallback={<p className="text-muted-foreground">Loading theme knobs…</p>}>
            <ThemeKnobsPage />
          </Suspense>
        ) : (
          <ComponentsDemo />
        )}
      </main>
    </Stack>
  )
}

/** Only this button subscribes to the mode, so switching never re-renders (or remounts) a page. */
function ModeToggle() {
  const mode = useMode()
  const next = mode === 'dark' ? 'light' : 'dark'
  return (
    <Button variant="outline" onClick={() => setMode(next)}>
      {next === 'dark' ? 'Dark' : 'Light'} mode
    </Button>
  )
}

export default App

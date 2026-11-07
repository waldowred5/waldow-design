/**
 * Every story is a test: it must render, its play function (if any) must pass,
 * and it must have no axe violations. New stories are covered automatically.
 */
import { composeStories } from '@storybook/react-vite'
import { describe, expect, it } from 'vitest'
import { axeViolations } from './axe'

type StoryModule = Parameters<typeof composeStories>[0]
type RunnableStory = { run: () => Promise<void> }
const modules = import.meta.glob<StoryModule>(['../**/*.stories.tsx', '../../../../prototypes/**/*.stories.tsx'], {
  eager: true,
})

for (const [path, mod] of Object.entries(modules)) {
  const name = path.replace(/^.*\/(.*)\.stories\.tsx$/, '$1')
  describe(name, () => {
    for (const [storyName, Story] of Object.entries(composeStories(mod)) as Array<[string, RunnableStory]>) {
      it(`${storyName} renders without a11y violations`, async () => {
        await Story.run()
        // Portalled content (dialogs, menus) renders into document.body.
        expect(await axeViolations(document.body)).toEqual([])
      })
    }
  })
}

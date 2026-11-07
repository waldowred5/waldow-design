import type { Decorator } from '@storybook/react-vite'

/** Wraps a story in a fixed-width box, for components that fill their container. */
export const withWidth =
  (className: string): Decorator =>
  (Story) => (
    <div className={className}>
      <Story />
    </div>
  )

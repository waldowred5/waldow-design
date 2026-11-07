/** Each cva variant's option names, such as `{ size: ['sm', 'md'] }`, for Storybook controls. */
export function variantOptions<T extends Record<string, object>>(variants: T) {
  return Object.fromEntries(Object.entries(variants).map(([name, options]) => [name, Object.keys(options)])) as {
    [K in keyof T]: string[]
  }
}

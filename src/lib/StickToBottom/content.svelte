<script lang="ts" module>
import type { Snippet } from 'svelte'
import type { SvelteHTMLElements } from 'svelte/elements'
export interface ContentProps extends Omit<SvelteHTMLElements['div'], 'children'> {
  children?: Snippet<[StickToBottomContext]>
}
</script>

<script lang="ts">
import { useStickToBottomContext, type StickToBottomContext } from './index.js'

const { children, ...props }: ContentProps = $props()
const context = useStickToBottomContext()
</script>

<div
  {@attach context.scrollable}
  {@attach (element) => {
    if (getComputedStyle(element).overflow === 'visible') element.style.overflow = 'auto'
  }}
  style="height: 100%; width: 100%;"
>
  <div {...props} {@attach context.content}>
    {@render children?.(context)}
  </div>
</div>

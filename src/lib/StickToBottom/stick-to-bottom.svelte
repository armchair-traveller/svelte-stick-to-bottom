<script lang="ts" module>
export interface StickToBottomProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, StickToBottomOptions {
  context?: StickToBottomContext
  instance?: StickToBottomInstance
  children?: Snippet<[StickToBottomContext]>
}
export const STICK_TO_BOTTOM_CONTEXT = Symbol('stick-to-bottom')
</script>

<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
import type { GetTargetScrollTop, StickToBottomInstance, StickToBottomOptions } from '$lib/useStickToBottom.svelte.js'
import { useStickToBottom } from '$lib/useStickToBottom.svelte.js'
import { setContext, type Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { StickToBottomContext } from './index.js'

let {
  instance,
  children,
  resize,
  initial,
  mass,
  damping,
  stiffness,
  targetScrollTop: currentTargetScrollTop,
  context = $bindable(),
  ...props
}: StickToBottomProps = $props()

let customTargetScrollTop: GetTargetScrollTop | null = $state(null)

const targetScrollTop = (target: number, elements: any) => {
  const get = context?.targetScrollTop ?? currentTargetScrollTop
  return get?.(target, elements) ?? target
}

const defaultInstance = $derived(
  useStickToBottom({
    mass,
    damping,
    stiffness,
    resize,
    initial,
    targetScrollTop,
  })
)

const {
  scrollable,
  content,
  scrollToBottom,
  stopScroll,
  isAtBottom,
  escapedFromLock,
  state: stickToBottomState,
} = $derived(instance ?? defaultInstance)

context = {
  scrollable,
  content,
  scrollToBottom,
  stopScroll,
  get isAtBottom() {
    return isAtBottom
  },
  get escapedFromLock() {
    return escapedFromLock
  },
  get state() {
    return stickToBottomState
  },
  get targetScrollTop() {
    return customTargetScrollTop
  },
  set targetScrollTop(targetScrollTop: GetTargetScrollTop | null) {
    customTargetScrollTop = targetScrollTop
  },
}

setContext(STICK_TO_BOTTOM_CONTEXT, context)
</script>

<div {...props}>{@render children?.(context)}</div>

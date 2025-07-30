<script lang="ts" module>
export interface StickToBottomProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, StickToBottomOptions {
  context?: StickToBottomContext
  instance?: StickToBottomInstance
  children?: Snippet<[StickToBottomContext]>
}
</script>

<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'
import type { StickToBottomContext } from './index.js'
import type { StickToBottomInstance, StickToBottomOptions, GetTargetScrollTop } from '$lib/useStickToBottom.svelte.js'
import type { Snippet } from 'svelte'
import { setContext } from 'svelte'
import { useStickToBottom } from '$lib/useStickToBottom.svelte.js'
import { STICK_TO_BOTTOM_CONTEXT } from './index.js'

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

const derivedContext = $derived({
  scrollToBottom,
  stopScroll,
  scrollable,
  isAtBottom,
  escapedFromLock,
  content,
  state: stickToBottomState,
  get targetScrollTop() {
    return customTargetScrollTop
  },
  set targetScrollTop(targetScrollTop: GetTargetScrollTop | null) {
    customTargetScrollTop = targetScrollTop
  },
})

// TODO: Same issue as below, needs checking if it receives updates, For example, check if isAtBottom changes
context = (() => derivedContext)()

// TODO: unsure if this is the right way to handle context updates, either use getters, or a proxy
// find a way to test it
setContext(STICK_TO_BOTTOM_CONTEXT, (() => derivedContext)())
</script>

<div {...props}>{@render children?.(derivedContext)}</div>

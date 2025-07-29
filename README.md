# `useStickToBottom` for Svelte 5

> Designed with AI chat bots in mind, unofficial port of [`use-stick-to-bottom`](https://www.npmjs.com/package/use-stick-to-bottom)

[![npm version](https://img.shields.io/npm/v/svelte-stick-to-bottom.svg?style=flat-square)](https://www.npmjs.com/package/svelte-stick-to-bottom)
[![npm downloads](https://img.shields.io/npm/dm/svelte-stick-to-bottom.svg?style=flat-square)](https://www.npmjs.com/package/svelte-stick-to-bottom)

<!-- TODO:
[![Demo](https://img.shields.io/badge/StackBlitz-Demo-blue.svg?style=flat-square)](https://stackblitz.com/~/github.com/samdenty/svelte-stick-to-bottom?file=demo/Demo.svelte)
-->

A lightweight **zero-dependency** Svelte 5 rune + Component that automatically sticks to the bottom of container and smoothly animates the content to keep it's visual position on screen whilst new content is being added.

## Features

- Does not require [`overflow-anchor`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor) browser-level CSS support which Safari does not support.
- Can be connected up to any existing component using a rune with element bindings. Or simply use the provided component, which handles the bindings for you plus provides context - so child components can check `isAtBottom` & programmatically scroll to the bottom.
- Uses the modern, yet well-supported, [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API to detect when content resizes.
  - Supports content shrinking without losing stickiness - not just getting taller.
- Correctly handles [Scroll Anchoring](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring). This is where when content above the viewport resizes, it doesn't cause the content currently displayed in viewport to jump up or down.
- Allows the user to cancel the stickiness at any time by scrolling up.
  - Clever logic distinguishes the user scrolling from the custom animation scroll events (without doing any debouncing which could cause some events to be missed).
  - Mobile devices work well with this logic too.
- Uses a custom implemented smooth scrolling algorithm, featuring velocity-based spring animations (with configurable parameters).
  - Other libraries use easing functions with durations instead, but these doesn't work well when you want to stream in new content with variable sizing - which is common for AI chatbot use cases.
  - `scrollToBottom` returns a `Promise<boolean>` which will resolve to `true` as soon as the scroll was successful, or `false` if the scroll was cancelled.

# Usage

## `<StickToBottom>` Component

```svelte
<script>
  import { StickToBottom, getStickToBottomContext } from 'svelte-stick-to-bottom';

  let { messages } = $props();
</script>

<StickToBottom class="h-[50vh] relative" resize="smooth" initial="smooth">
  <StickToBottom.Content class="flex flex-col gap-4">
    {#each messages as message (message.id)}
      <Message {message} />
    {/each}
  </StickToBottom.Content>

  <ScrollToBottom />

  <!-- This component uses `getStickToBottomContext` to scroll to bottom when the user enters a message -->
  <ChatBox />
</StickToBottom>
```

```svelte
<!-- ScrollToBottom.svelte -->
<script>
  import { getStickToBottomContext } from 'svelte-stick-to-bottom';

  const { isAtBottom, scrollToBottom } = getStickToBottomContext();
</script>

{#if !$isAtBottom}
  <button
    class="absolute i-ph-arrow-circle-down-fill text-4xl rounded-lg left-[50%] translate-x-[-50%] bottom-0"
    onclick={() => scrollToBottom()}
  >
    Scroll to bottom
  </button>
{/if}
```

## `stickToBottom` Rune

```svelte
<script>
  import { stickToBottom } from 'svelte-stick-to-bottom';

  let { messages } = $props();

  let scrollElement = $state();
  let contentElement = $state();

  const { isAtBottom, scrollToBottom } = stickToBottom(() => ({
    scrollRef: scrollElement,
    contentRef: contentElement
  }));
</script>

<div style="overflow: auto" bind:this={scrollElement}>
  <div bind:this={contentElement}>
    {#each messages as message (message.id)}
      <Message {message} />
    {/each}
  </div>
</div>
```

## Key Differences from React Version

- **Runes instead of Hooks**: Uses Svelte 5's rune system (`$state`, `$derived`, `$effect`) instead of React hooks
- **Context API**: Uses Svelte's context system with `getStickToBottomContext()` instead of `useStickToBottomContext()`
- **Element Bindings**: Uses `bind:this` for element references instead of `useRef()`
- **Reactive Values**: Returns runes that can be accessed with `$` syntax for reactivity
- **Props Syntax**: Uses Svelte 5's new `$props()` syntax instead of component props destructuring

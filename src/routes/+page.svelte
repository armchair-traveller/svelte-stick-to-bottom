<script lang="ts">
import { StickToBottom, useStickToBottomContext } from '$lib/index.js'
import Message from './message.svelte'
import { useFakeMessages } from './useFakeMessages.svelte.js'

interface MessageSegment {
  text: string
  tag?: 'h1'
}

let speed = $state(0.2)
</script>

{#snippet MessagesContent(messages: MessageSegment[][])}
  {@const { stopScroll } = useStickToBottomContext()}

  <div class="relative w-full flex flex-col overflow-hidden">
    <StickToBottom.Content class="flex flex-col gap-4 p-6">
      {#each Array(10) as _, i (i)}
        <Message>
          <h1>This is a test</h1>
          more testing text...
        </Message>
      {/each}

      {#each messages as message, i (i)}
        <Message>
          {#each message as segment}
            {#if segment.tag}
              <h1>{segment.text}</h1>
            {:else}
              {segment.text}
            {/if}
          {/each}
        </Message>
      {/each}
    </StickToBottom.Content>
    {@render ScrollToBottom()}
  </div>

  <div class="flex justify-center pt-4">
    <button class="rounded bg-slate-600 text-white px-4 py-2" onclick={() => stopScroll()}> Stop Scroll </button>
  </div>
{/snippet}

{#snippet Messages(animation: ScrollBehavior, speed: number)}
  {@const fakeMessages = useFakeMessages(speed)}

  <div class="prose flex flex-col gap-2 w-full overflow-hidden">
    <h2 class="flex justify-center">{animation}:</h2>

    <StickToBottom
      class="h-[50vh] flex flex-col"
      resize={animation}
      initial={animation === 'instant' ? 'instant' : { mass: 10 }}
    >
      {@render MessagesContent(fakeMessages.messages)}
    </StickToBottom>
  </div>
{/snippet}

<div class="flex flex-col gap-10 p-10 items-center w-full">
  <input class="w-full max-w-screen-lg" type="range" bind:value={speed} min={0} max={1} step={0.01} />

  <div class="flex gap-6 w-full max-w-screen-lg">
    {@render Messages('smooth', speed)}
    {@render Messages('instant', speed)}
  </div>
</div>

{#snippet ScrollToBottom()}
  {@const { isAtBottom, scrollToBottom } = useStickToBottomContext()}

  {#if !isAtBottom}
    <button
      aria-hidden="true"
      class="absolute i-ph-arrow-circle-down-fill text-4xl rounded-lg left-[50%] translate-x-[-50%] bottom-0"
      onclick={() => scrollToBottom()}
    ></button>
  {/if}
{/snippet}

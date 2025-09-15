/*!---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { GetTargetScrollTop, ScrollToBottom, StickToBottomState, StopScroll } from '$lib/useStickToBottom.svelte'
import { getContext } from 'svelte'
import type { Attachment } from 'svelte/attachments'
import _Content, { type ContentProps as _ContentProps } from './content.svelte'
import _StickToBottom, { STICK_TO_BOTTOM_CONTEXT } from './stick-to-bottom.svelte'

export interface StickToBottomContext {
  content: Attachment<HTMLElement>
  scrollable: Attachment<HTMLElement>
  scrollToBottom: ScrollToBottom
  stopScroll: StopScroll
  isAtBottom: boolean
  escapedFromLock: boolean
  get targetScrollTop(): GetTargetScrollTop | null
  set targetScrollTop(targetScrollTop: GetTargetScrollTop | null)
  state: StickToBottomState
}

export type { StickToBottomProps } from './stick-to-bottom.svelte'
export const StickToBottom = Object.assign(_StickToBottom, { Content: _Content })

export namespace StickToBottom {
  export type ContentProps = _ContentProps
}

/**
 * Use this function inside a <StickToBottom> component to gain access to whether the component is at the bottom of the scrollable area.
 */
export function useStickToBottomContext(): StickToBottomContext {
  const context = getContext<StickToBottomContext>(STICK_TO_BOTTOM_CONTEXT)
  if (!context) {
    throw new Error('use-stick-to-bottom component context must be used within a StickToBottom component')
  }

  return context
}

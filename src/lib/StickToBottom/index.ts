/*!---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { setContext, getContext, onMount } from 'svelte'
import type { Component, Snippet } from 'svelte'
import type { Attachment } from 'svelte/attachments'
import type { HTMLAttributes } from 'svelte/elements'
import {
  type GetTargetScrollTop,
  type ScrollToBottom,
  type StickToBottomState,
  type StopScroll,
} from '../useStickToBottom.svelte'
import _Content, { type ContentProps as _ContentProps } from './content.svelte'

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

const STICK_TO_BOTTOM_CONTEXT = Symbol('stick-to-bottom')

export { STICK_TO_BOTTOM_CONTEXT }

export namespace StickToBottom {
  export type ContentProps = _ContentProps
  export const Content = _Content
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

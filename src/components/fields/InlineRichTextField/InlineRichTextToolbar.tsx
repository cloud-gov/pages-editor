'use client'

import React, { useEffect, useState } from 'react'

import {
  $createHeadingNode,
  $isHeadingNode,
} from '@lexical/rich-text'

import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'

import { $setBlocksType } from '@lexical/selection'

import { $findMatchingParent, $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'

import {
  $isLinkNode,
  $toggleLink
} from '@lexical/link'
import { LinkEditModal, LinkValues } from './LinkEditModal'
import { registerBlockCommands } from './blocks/blockCommands'
import { BlocksMenu } from './blocks/BlocksMenu'

type BlockFormat = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4'| 'h5' | 'h6' | 'unordered_list' | 'ordered_list'

type Props = {
  showBlocksMenu?: boolean
}

export function InlineRichTextToolbar({
  showBlocksMenu = true,
}: Props) {
  const [editor] = useLexicalComposerContext()

  const [blockFormat, setBlockFormatState] =
    useState<BlockFormat>('paragraph')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStruckthrough, setIsStruckthrough] = useState(false)
  const [isSuperScript, setIsSuperScript] = useState(false)
  const [isSubScript, setIsSubScript] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isInlineCode, setIsInlineCode] = useState(false)

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkValues, setLinkValues] = useState<LinkValues>({
    text: '',
    linkType: 'custom',
    url: '',
    newTab: false,
  })

  const updateToolbarState = () => {
    
    const selection = $getSelection()

    if (!$isRangeSelection(selection)) {
      setIsBold(false)
      setIsItalic(false)
      return
    }

    setIsBold(selection.hasFormat('bold'))
    setIsItalic(selection.hasFormat('italic'))
    setIsUnderline(
      selection.hasFormat('underline')
    )
    setIsStruckthrough(
      selection.hasFormat('strikethrough')
    )
    setIsSuperScript(
      selection.hasFormat('superscript')
    )
    setIsSubScript(
      selection.hasFormat('subscript')
    )
    setIsInlineCode(
      selection.hasFormat('code')
    )

    const anchorNode = selection.anchor.getNode()

    const linkNode = $findMatchingParent(
      anchorNode,
      (node) => $isLinkNode(node)
    )

    setIsLink($isLinkNode(linkNode))

    const listNode = $findMatchingParent(anchorNode, (node) =>
      $isListNode(node),
    )

    if ($isListNode(listNode)) {
      const listType = listNode.getListType()

      if (listType === 'bullet') {
        setBlockFormatState('unordered_list')
        return
      }

      if (listType === 'number') {
        setBlockFormatState('ordered_list')
        return
      }
    }

    const topLevelElement = anchorNode.getTopLevelElementOrThrow()

    if ($isHeadingNode(topLevelElement)) {
      const tag = topLevelElement.getTag()

      if (
        tag === 'h1' ||
        tag === 'h2' ||
        tag === 'h3' ||
        tag === 'h4' ||
        tag === 'h5' ||
        tag === 'h6'
      ) {
        setBlockFormatState(tag)
      } else {
        setBlockFormatState('paragraph')
      }
    } else {
      setBlockFormatState('paragraph')
    }
  }

  const removeLink = () => {
    editor.update(() => {
      $toggleLink(null)
    })
  }

  const handleLinkChange = (
    name: keyof LinkValues,
    value: any,
  ) => {
    setLinkValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLinkSave = () => {
    editor.update(() => {
      const selection = $getSelection()

      if (!$isRangeSelection(selection)) {
        return
      }

      const selectedText = selection.getTextContent()

      if (
        linkValues.text &&
        linkValues.text !== selectedText
      ) {
        selection.insertText(linkValues.text)
      }

      $toggleLink(linkValues.url)

      const anchorNode = selection.anchor.getNode()

      const linkNode = $findMatchingParent(
        anchorNode,
        (node) => $isLinkNode(node),
      )

      if ($isLinkNode(linkNode)) {
        linkNode.setTarget(
          linkValues.newTab ? '_blank' : null,
        )

        linkNode.setRel(
          linkValues.newTab
            ? 'noopener noreferrer'
            : null,
        )
      }
    })

    setIsLinkModalOpen(false)
  }

  const openLinkModal = () => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()

      if (!$isRangeSelection(selection)) {
        return
      }

      let url = ''
      let newTab = false

      const anchorNode = selection.anchor.getNode()

      const linkNode = $findMatchingParent(
        anchorNode,
        (node) => $isLinkNode(node),
      )

      if ($isLinkNode(linkNode)) {
        url = linkNode.getURL()

        if (
          typeof linkNode.getTarget === 'function'
        ) {
          newTab =
            linkNode.getTarget() === '_blank'
        }
      }

      setLinkValues({
        text: selection.getTextContent(),
        linkType: 'custom',
        url,
        newTab,
      })
    })

    setIsLinkModalOpen(true)
  }

  useEffect(() => {
    return mergeRegister(
      registerBlockCommands(editor),
      editor.registerUpdateListener(({ editorState }) => {
        
        editorState.read(() => {
          updateToolbarState()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbarState()
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  const setBlockFormat = (format: BlockFormat) => {
    editor.update(() => {
      const selection = $getSelection()

      if (!selection) {
        return
      }

      switch (format) {
        case 'paragraph':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createParagraphNode())
          break

        case 'h1':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createHeadingNode('h1'))
          break

        case 'h2':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createHeadingNode('h2'))
          break

        case 'h3':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createHeadingNode('h3'))
          break

        case 'h4':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createHeadingNode('h4'))
          break

        case 'h5':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createHeadingNode('h5'))
          break

        case 'h6':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
          $setBlocksType(selection, () => $createHeadingNode('h6'))
          break

        case 'unordered_list':
          editor.dispatchCommand(
            INSERT_UNORDERED_LIST_COMMAND,
            undefined,
          )
          break

        case 'ordered_list':
          editor.dispatchCommand(
            INSERT_ORDERED_LIST_COMMAND,
            undefined,
          )
          break

        default:
          break
      }
    })
  }

  return (
    <div className="custom-blocks-field__rich-text-toolbar">
      <label
        className="usa-sr-only"
        htmlFor="inline-rich-text-block-format"
      >
        Text style
      </label>

      {showBlocksMenu && <BlocksMenu editor={editor} />}

      <div className="custom-blocks-field__rich-text-toolbar-group fixed-toolbar__group">
        <svg aria-hidden="true" className="icon" fill="currentColor" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M11.708 14.5H7.79785V13.9414H8.01367C9.00391 13.9414 9.15625 13.9033 9.15625 13.6113V6.70508H8.07715C6.82031 6.70508 6.73145 7.08594 6.28711 8.67285H5.80469L5.91895 6.12109H13.5869L13.7012 8.67285H13.2188C12.7744 7.08594 12.6855 6.70508 11.4287 6.70508H10.3496V13.6113C10.3496 13.9033 10.502 13.9414 11.4922 13.9414H11.708V14.5Z" fill="currentColor"></path></svg>
        <select
          id="inline-rich-text-block-format"
          className="usa-select custom-blocks-field__rich-text-format-select"
          value={blockFormat}
          onChange={(event) => {
            setBlockFormat(event.target.value as BlockFormat)
          }}
        >
          <option value="paragraph">Normal Text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="unordered_list">Unordered List</option>
          <option value="ordered_list">Ordered List</option>
        </select>
        <div className="divider"></div>
      </div>

      <div className="custom-blocks-field__rich-text-toolbar-group fixed-toolbar__group">
        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isBold &&
              'custom-blocks-field__rich-text-toolbar-button--active',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Bold"
          aria-pressed={isBold}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
          }}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isItalic &&
              'custom-blocks-field__rich-text-toolbar-button--active',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Italic"
          aria-pressed={isItalic}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
          }}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isUnderline &&
              'custom-blocks-field__rich-text-toolbar-button--active'
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Underline"
          aria-pressed={isUnderline}
          onMouseDown={(event) => {
            editor.dispatchCommand(
              FORMAT_TEXT_COMMAND,
              'underline',
            )
          }}
        >
          <u>U</u>
        </button>

        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isStruckthrough &&
              'custom-blocks-field__rich-text-toolbar-button--active'
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Strikethrough"
          aria-pressed={isStruckthrough}
          onMouseDown={(event) => {
            editor.dispatchCommand(
              FORMAT_TEXT_COMMAND,
              'strikethrough',
            )
          }}
        >
          <s>S</s>
        </button>

        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isSubScript &&
              'custom-blocks-field__rich-text-toolbar-button--active'
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Subscript"
          aria-pressed={isSubScript}
          onMouseDown={(event) => {
            editor.dispatchCommand(
              FORMAT_TEXT_COMMAND,
              'subscript',
            )
          }}
        >
          <svg aria-hidden="true" className="icon" fill="currentColor" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10.167 15L7.45002 11.36L4.73302 15H2.91302L6.55302 10.177L3.23802 5.718H5.20102L7.54102 8.89L9.89402 5.718H11.714L8.43802 10.06L12.13 15H10.167ZM16.7768 13.258C16.7768 14.155 16.1398 14.532 15.2038 15C14.5538 15.325 14.2808 15.546 14.2418 15.78H16.7898V16.82H12.7208V16.339C12.7208 15.286 13.5918 14.675 14.3588 14.233C15.0868 13.83 15.4378 13.635 15.4378 13.232C15.4378 12.894 15.2038 12.686 14.8268 12.686C14.3848 12.686 14.1248 13.024 14.1118 13.427H12.7468C12.8248 12.426 13.5528 11.633 14.8398 11.633C15.9448 11.633 16.7768 12.257 16.7768 13.258Z" fill="currentColor"></path></svg>
        </button>

        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isSuperScript &&
              'custom-blocks-field__rich-text-toolbar-button--active'
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Superscript"
          aria-pressed={isSuperScript}
          onMouseDown={(event) => {
            editor.dispatchCommand(
              FORMAT_TEXT_COMMAND,
              'superscript',
            )
          }}
        >
          <svg aria-hidden="true" className="icon" fill="currentColor" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10.167 15L7.45002 11.36L4.73302 15H2.91302L6.55302 10.177L3.23802 5.718H5.20102L7.54102 8.89L9.89402 5.718H11.714L8.43802 10.06L12.13 15H10.167ZM16.7768 7.252C16.7768 8.149 16.1398 8.526 15.2038 8.994C14.5538 9.319 14.2808 9.54 14.2418 9.774H16.7898V10.814H12.7208V10.333C12.7208 9.28 13.5918 8.669 14.3588 8.227C15.0868 7.824 15.4378 7.629 15.4378 7.226C15.4378 6.888 15.2038 6.68 14.8268 6.68C14.3848 6.68 14.1248 7.018 14.1118 7.421H12.7468C12.8248 6.42 13.5528 5.627 14.8398 5.627C15.9448 5.627 16.7768 6.251 16.7768 7.252Z" fill="currentColor"></path></svg>
        </button>
        
        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isInlineCode &&
              'custom-blocks-field__rich-text-toolbar-button--active'
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Superscript"
          aria-pressed={isInlineCode}
          onMouseDown={(event) => {
            editor.dispatchCommand(
              FORMAT_TEXT_COMMAND,
              'code',
            )
          }}
        >
          <svg aria-hidden="true" className="icon" fill="none" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.76465 6L3.76465 10L7.76465 14" stroke="currentColor"></path><path d="M12.2354 6L16.2354 10L12.2354 14" stroke="currentColor"></path></svg>
        </button>
        <div className="divider"></div>
        <button
          type="button"
          className={[
            'custom-blocks-field__rich-text-toolbar-button',
            isLink &&
              'custom-blocks-field__rich-text-toolbar-button--active',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Link"
          aria-pressed={isLink}
          title="Link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            openLinkModal()
          }}
        >
          🔗
        </button>
        {isLink && (
          <button
            type="button"
            aria-label="Remove Link"
            onClick={removeLink}
          >
            ⛓️‍💥
          </button>
        )}
      </div>
      <LinkEditModal 
        isOpen={isLinkModalOpen}
        values={linkValues}
        onChange={handleLinkChange}
        onSave={handleLinkSave}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </div>
  )
}

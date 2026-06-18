'use client'

import React from 'react'

import type { LexicalEditor } from 'lexical'

import {
  INSERT_INLINE_BLOCK_COMMAND,
} from './blockCommands'

type Props = {
  editor: LexicalEditor
}

export function BlocksMenu({
  editor,
}: Props) {
  return (
    <div className="custom-blocks-field__rich-text-toolbar-group fixed-toolbar__group">
      <select
        onChange={(e) => {
          switch (e.target.value) {
            case 'accordion':
              editor.dispatchCommand(
                INSERT_INLINE_BLOCK_COMMAND,
                'accordion',
              )
              break
            case 'processList':
              editor.dispatchCommand(
                INSERT_INLINE_BLOCK_COMMAND,
                'processList'
              )
          }

          e.target.value = ''
        }}
      >
        <option value="">
          Insert
        </option>

        <option value="accordion">
          Accordion
        </option>
        <option value="processList">
          Process List
        </option>
      </select>
      <div className="divider"></div>
    </div>
  )
}

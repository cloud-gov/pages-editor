import { $createInlinePayloadBlockNode } from "../InlinePayloadBlockNode";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { COMMAND_PRIORITY_EDITOR, createCommand } from "node_modules/lexical";

export const INSERT_INLINE_BLOCK_COMMAND =
  createCommand<string>()

export const registerBlockCommands = (
  editor: any,
) => {
  return editor.registerCommand(
    INSERT_INLINE_BLOCK_COMMAND,
    (blockType) => {
      editor.update(() => {
        const block = $createInlinePayloadBlockNode({
          fields: {
            id: crypto.randomUUID(),
            blockName: '',
            blockType,
          },
        })

        $insertNodeToNearestRoot(block)
      })

      return true
    },
    COMMAND_PRIORITY_EDITOR,
  )
}

'use client'

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type CustomContentEditableProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'contentEditable' | 'style'
> & {
  'data-testid'?: string
  style?: never
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current =
          value
      }
    })
  }
}

export const CustomContentEditable = forwardRef<
  HTMLDivElement,
  CustomContentEditableProps
>(function CustomContentEditable(
  {
    className,
    id,
    role = 'textbox',
    spellCheck = true,
    tabIndex,
    'data-testid': testId,

    'aria-activedescendant': ariaActiveDescendant,
    'aria-autocomplete': ariaAutoComplete,
    'aria-controls': ariaControls,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-expanded': ariaExpanded,
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-multiline': ariaMultiline,
    'aria-owns': ariaOwns,
    'aria-required': ariaRequired,

    ...rest
  },
  ref,
) {
  const [editor] = useLexicalComposerContext()

  const [isEditable, setEditable] = useState(() =>
    editor.isEditable(),
  )

  const handleRootElementRef = useCallback(
    (rootElement: HTMLDivElement | null) => {
      
      if (
        rootElement &&
        rootElement.ownerDocument.defaultView
      ) {
        editor.setRootElement(rootElement)

        rootElement.style.cssText = ''

        if (rootElement.getAttribute('style') === '') {
          rootElement.removeAttribute('style')
        }

        
        
      } else {
        editor.setRootElement(null)
      }

    },
    [editor],
  )

  const mergedRef = useMemo(
    () => mergeRefs(ref, handleRootElementRef),
    [ref, handleRootElementRef],
  )

  useEffect(() => {
    setEditable(editor.isEditable())

    return editor.registerEditableListener(
      (currentIsEditable) => {
        setEditable(currentIsEditable)
      },
    )
  }, [editor])

  return (
    <div
      {...rest}
      aria-activedescendant={
        isEditable ? ariaActiveDescendant : undefined
      }
      aria-autocomplete={
        isEditable ? ariaAutoComplete : 'none'
      }
      aria-controls={isEditable ? ariaControls : undefined}
      aria-describedby={ariaDescribedBy}
      aria-errormessage={ariaErrorMessage}
      aria-expanded={
        isEditable && role === 'combobox'
          ? Boolean(ariaExpanded)
          : undefined
      }
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiline={ariaMultiline}
      aria-owns={isEditable ? ariaOwns : undefined}
      aria-readonly={isEditable ? undefined : true}
      aria-required={ariaRequired}
      className={className}
      contentEditable={isEditable}
      data-testid={testId}
      id={id}
      ref={mergedRef}
      role={role}
      spellCheck={spellCheck}
      tabIndex={tabIndex}
    />
  )
})

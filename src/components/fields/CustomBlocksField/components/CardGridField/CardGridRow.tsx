'use client'

import { useField } from '@payloadcms/ui'

import { FieldWrapper } from '@/components/fields/FieldWrapper'
import { UploadField } from '@/components/fields/CustomBlocksField/components/UploadField'

type Props = {
  cardPath: string
  fieldId: string
  index: number
  disabled?: boolean
}

export function CardGridRowFields({
  cardPath,
  fieldId,
  index,
  disabled,
}: Props) {
  const {
    value: title,
    setValue: setTitle,
  } = useField<string>({
    path: `${cardPath}.title`,
  })

  const {
    value: description,
    setValue: setDescription,
  } = useField<string>({
    path: `${cardPath}.description`,
  })

  const {
    value: image,
    setValue: setImage,
  } = useField<string | null>({
    path: `${cardPath}.image`,
  })

  const {
    value: linkUrl,
    setValue: setLinkUrl,
  } = useField<string>({
    path: `${cardPath}.link.url`,
  })

  const {
    value: linkText,
    setValue: setLinkText,
  } = useField<string>({
    path: `${cardPath}.link.text`,
  })

  const titleId =
    `${fieldId}-${index}-title`

  const descriptionId =
    `${fieldId}-${index}-description`

  const imageId =
    `${fieldId}-${index}-image`

  const linkUrlId =
    `${fieldId}-${index}-url`

  const linkTextId =
    `${fieldId}-${index}-linktext`

  return (
    <div className="array-field__row-content">
      <FieldWrapper
        id={titleId}
        label="Card Title"
        required
        type="text"
        variant="default"
      >
        <input
          id={titleId}
          className="usa-input"
          type="text"
          value={title ?? ''}
          disabled={disabled}
          autoComplete="off"
          onChange={(event) => {
            setTitle(event.target.value)
          }}
        />
      </FieldWrapper>

      <FieldWrapper
        id={descriptionId}
        label="Card Description"
        type="textarea"
        variant="default"
      >
        <textarea
          id={descriptionId}
          className="usa-textarea"
          value={description ?? ''}
          disabled={disabled}
          onChange={(event) => {
            setDescription(event.target.value)
          }}
        />
      </FieldWrapper>

      <FieldWrapper
        id={imageId}
        type="upload"
        variant="default"
      >
        <UploadField
          label="Card Image"
          value={image ?? null}
          relationTo="media"
          disabled={disabled}
          onChange={(mediaId) => {
            setImage(mediaId)
          }}
        />
      </FieldWrapper>

      <FieldWrapper
        id={linkUrlId}
        label="Link URL"
        type="text"
        variant="default"
      >
        <input
          id={linkUrlId}
          className="usa-input"
          type="text"
          value={linkUrl ?? ''}
          disabled={disabled}
          autoComplete="off"
          onChange={(event) => {
            setLinkUrl(event.target.value)
          }}
        />
      </FieldWrapper>

      <FieldWrapper
        id={linkTextId}
        label="Link Text"
        type="text"
        variant="default"
      >
        <input
          id={linkTextId}
          className="usa-input"
          type="text"
          value={linkText ?? ''}
          disabled={disabled}
          autoComplete="off"
          onChange={(event) => {
            setLinkText(event.target.value)
          }}
        />
      </FieldWrapper>
    </div>
  )
}

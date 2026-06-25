import React from 'react'

import './index.scss'

type ChevronIconProps = {
  ariaLabel?: string
  className?: string
  direction?: 'down' | 'left' | 'right' | 'up'
  size?: 'large' | 'small'
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({
  ariaLabel,
  className,
  direction,
  size,
}) => (
  <svg
    aria-label={ariaLabel}
    className={[
      'icon icon--chevron',
      direction ? `icon--chevron--${direction}` : '',
      size ? `icon--size-${size}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    height="100%"
    viewBox="0 0 20 20"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="stroke" d="M14 8L10 12L6 8" strokeLinecap="square" />
  </svg>
)

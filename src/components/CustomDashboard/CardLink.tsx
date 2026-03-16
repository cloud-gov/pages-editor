import React from 'react'
import Link from 'next/link'

export default function CardLink({
  action,
  href,
  title,
  description,
  label,
}: {
  href: string
  title: string
  description?: string
  label: string
  action?: React.ReactNode
}) {
  return (
    <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
      <div className="usa-card">
        <div className="usa-card__container">
          <div className="usa-card__header">
            <div className="grid-row flex-justify-between flex-align-center">
              {action && (
                <div className="grid-col-row">
                  <div className="display-flex flex-justify-end">{action}</div>
                </div>
              )}
              <Link href={href} className="usa-card__link">
                <h3 className="usa-card__heading margin-0 grid-col-fill">{title}</h3>
              </Link>
            </div>
          </div>
          <div className="usa-card__body">
            <span className="usa-sr-only">Description: </span>
            <p>{description ? description : 'No description available.'}</p>
          </div>
          <div className="usa-card__body">
            <Link href={href} className="usa-card__link">
              <span className="usa-sr-only">{label}</span>
              <p className="text-underline text-bold">{label}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

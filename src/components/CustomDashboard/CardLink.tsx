import Link from 'next/link'

export default function CardLink({
  href,
  title,
  description,
  label,
}: {
  href: string
  title: string
  description?: string
  label: string
}) {
  return (
    <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
      <Link href={href} className="usa-card__link">
        <div className="usa-card">
          <div className="usa-card__container">
            <div className="usa-card__header">
              <div className="display-flex flex-justify-between flex-align-center">
                <h3 className="usa-card__heading margin-0">{title}</h3>
              </div>
            </div>
            <div className="usa-card__body">
              <span className="usa-sr-only">Description: </span>
              <p>{description ? description : 'No description available.'}</p>
            </div>
            <div className="usa-card__body">
              <span className="usa-sr-only">{label}</span>
              <p className="text-underline">{label}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="margin-bottom-4">
      <div className="grid-row margin-bottom-2 grid-gap">
        <div className="grid-col-12 tablet:grid-col-auto">
          <h2 className="font-sans-xl text-normal">{title}</h2>
        </div>
        {action && (
          <div className="grid-col-12 margin-top-2 tablet:margin-top-0 tablet:grid-col-fill display-flex flex-justify-end flex-align-start">
            <div>{action}</div>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

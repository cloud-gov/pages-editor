export const SlimAlert = ({
  children,
  type,
}: {
  children: React.ReactNode
  type: 'info' | 'warning' | 'error' | 'success' | 'emergency'
}) => {
  const role = type === 'error' || type === 'emergency' ? 'alert' : 'status'

  return (
    <div className={`usa-alert usa-alert--${type} usa-alert--slim`} role={role}>
      <div className="usa-alert__body">
        <p className="usa-alert__text">{children}</p>
      </div>
    </div>
  )
}

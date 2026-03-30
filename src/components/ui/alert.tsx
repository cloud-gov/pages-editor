export const SlimAlert = ({
  className = '',
  children,
  type,
}: {
  className?: string
  children: React.ReactNode
  type: 'info' | 'warning' | 'error' | 'success' | 'emergency'
}) => {
  const role = type === 'error' || type === 'emergency' ? 'alert' : 'status'

  return (
    <div className={`usa-alert usa-alert--${type} usa-alert--slim ${className}`} role={role}>
      <div className="usa-alert__body">
        <p className="usa-alert__text">{children}</p>
      </div>
    </div>
  )
}

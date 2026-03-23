interface CalloutProps {
  children: React.ReactNode
  className?: string
  backgroundColorClass?: string
}

const Callout = ({ children, className, backgroundColorClass }: CalloutProps) => {
  return (
    <div
      className={`padding-2 margin-bottom-2 ${backgroundColorClass || 'bg-base-lightest'} text-ink ${className || ''}`}
    >
      {children}
    </div>
  )
}

export default Callout

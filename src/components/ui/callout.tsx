interface CalloutProps {
  children: React.ReactNode
  backgroundColorClass?: string
}

const Callout = ({ children, backgroundColorClass }: CalloutProps) => {
  return (
    <div
      className={`padding-2 margin-bottom-2 ${backgroundColorClass || 'bg-base-lighter'} text-ink`}
    >
      {children}
    </div>
  )
}

export default Callout

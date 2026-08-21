export const H2 = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h2
    className={`${className || ''} prose__h2`}
  >
    {children}
  </h2>
)
export const H3 = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3
    className={`${className} prose__h3`}
  >
    {children}
  </h3>
)
export const H4 = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h4 className={`${className || ''} prose__h4`}>
    {children}
  </h4>
)

const Headings = {
  h2: H2,
  h3: H3,
  h4: H4,
}

export default Headings

export const H2 = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h2
    className={`${className || ''}`}
    style={{ margin: '.5rem 0 .2rem 0', fontSize: '1.40rem', fontWeight: '700' }}
  >
    {children}
  </h2>
)
export const H3 = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3
    className={className}
    style={{ margin: '.5rem 0 .2rem 0', fontSize: '1.20rem', fontWeight: '600' }}
  >
    {children}
  </h3>
)
export const H4 = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h4 className={`${className || ''}`} style={{ margin: '.5rem 0 .2rem 0', fontSize: '1.10rem' }}>
    {children}
  </h4>
)

const Headings = {
  h2: H2,
  h3: H3,
  h4: H4,
}

export default Headings

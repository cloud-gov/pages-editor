export const H2 = ({ children }) => <h2 className="source-sans-pro">{children}</h2>
export const H3 = ({ children }) => (
  <h3>
    <strong>{children}</strong>
  </h3>
)
export const H4 = ({ children }) => <h4 className="source-sans-pro">{children}</h4>

const Headings = {
  h2: H2,
  h3: H3,
  h4: H4,
}

export default Headings

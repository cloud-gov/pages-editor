const Accordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const accordionId = `accordion-${title.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div className="usa-accordion usa-accordion--multiselectable" data-allow-multiple>
      <h4 className="usa-accordion__heading">
        <button
          type="button"
          className="usa-accordion__button bg-primary"
          aria-expanded="true"
          aria-controls={accordionId}
        >
          {title}
        </button>
      </h4>
      <div id={accordionId} className="usa-accordion__content usa-prose">
        {children}
      </div>
    </div>
  )
}

export default Accordion

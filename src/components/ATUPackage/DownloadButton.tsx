import React from 'react'

const PrintSection = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => {
  const handlePrint = () => {
    const printContents = ref?.current?.innerHTML
    const printWindow = window.open('', '_blank')

    if (!printWindow || !printContents) {
      console.error('Failed to open print window')
      return
    }

    printWindow.document.write(`
            <html>
                <head>
                    <title>Print Section</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                    </style>

                    <link rel="stylesheet" href="/_next/static/css/app/(payload)/layout.css" />
                    <link rel="stylesheet" href="/_next/static/css/app/(payload)/custom.scss" />
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
        `)

    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <div>
      <div id="printable-section">
        <h2>This is the section to print</h2>
        <p>This content will be printable.</p>
      </div>
      <button className="usa-button usa-button--big" onClick={handlePrint}>
        Download ATU Document
      </button>
    </div>
  )
}

export default PrintSection

import React from 'react'

interface TableProps {
  columns?: string[]
  rows: {
    column: string
    value: string | number | boolean | React.ReactNode
  }[][]
  showHeader?: boolean
  scrollable?: boolean
}

const Table = ({ columns, rows, showHeader = true, scrollable = false }: TableProps) => {
  return (
    <div className={`${scrollable ? 'usa-table-container--scrollable' : ''}`}>
      <table className="usa-table usa-table--borderless">
        {showHeader && columns && (
          <thead className="bg-base-lighter">
            <tr>
              {columns.map((column) => (
                <th scope="col" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

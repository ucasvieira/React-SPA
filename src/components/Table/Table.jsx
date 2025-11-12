import React from 'react'
import './Table.css'
function Table({ data, columns }) {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return <p>Sem dados para exibir.</p>;
  }

  return (
    <table className="styled-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
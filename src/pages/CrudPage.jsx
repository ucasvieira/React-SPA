import React, { useState } from 'react'

import dadosIniciais from '../data/conteudo.json' 
import Table from '../components/Table/Table'

function CrudPage() {
  const [registos, setRegistos] = useState(dadosIniciais)

  const colunasDaTabela = [
    {
      header: 'Nome do Produto',
      accessor: 'nome',
    },
    {
      header: 'Categoria',
      accessor: 'categoria',
    },
    {
      header: 'Stock',
      accessor: 'stock',
    }
  ]

  return (
    <div>
      <h1>Página de CRUD ({registos.length} registos)</h1>
      <Table data={registos} columns={colunasDaTabela} />
    </div>
  )
}

export default CrudPage
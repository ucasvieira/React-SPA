import React from 'react';
import RentalTable from '../components/RentalTable/RentalTable.jsx';

const Rentals = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-tight">Gestão de Locações</h1>
        <p className="text-gray-600 font-medium">Crie, atualize e remova registros de locação.</p>
      </div>
      <RentalTable />
    </div>
  );
};

export default Rentals;
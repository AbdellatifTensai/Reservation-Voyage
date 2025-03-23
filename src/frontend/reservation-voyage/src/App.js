import React from 'react';
import TrainView from './view/TrainView';
import ReservationView from './view/ReservationView';

function App() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Train Reservation System</h1>
      <div className="grid grid-cols-2 gap-8">
        <TrainView />
        <ReservationView />
      </div>
    </div>
  );
}

export default App;
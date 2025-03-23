import React, { useState } from 'react';
import { addTrain } from '../services/TrainService';

function TrainView() {
  const [trainName, setTrainName] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTrain({ name: trainName, capacity: parseInt(capacity) });
      alert('Train added successfully!');
    } catch (error) {
      console.error('Error adding train:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add a New Train</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Train Name"
          value={trainName}
          onChange={(e) => setTrainName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Train
        </button>
      </form>
    </div>
  );
}

export default TrainView;
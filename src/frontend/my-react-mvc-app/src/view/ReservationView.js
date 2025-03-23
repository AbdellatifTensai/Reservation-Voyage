import React, { useState, useEffect } from 'react';
import { getTrains, makeReservation } from '../services/TrainService';

function ReservationView() {
  const [trains, setTrains] = useState([]);
  const [selectedTrainId, setSelectedTrainId] = useState('');
  const [passengerName, setPassengerName] = useState('');

  useEffect(() => {
    const fetchTrains = async () => {
      const data = await getTrains();
      setTrains(data);
    };
    fetchTrains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await makeReservation({ train: { id: selectedTrainId }, passengerName});
      alert('Reservation made successfully!');
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <select
          value={selectedTrainId}
          onChange={(e) => setSelectedTrainId(e.target.value)}
          className="p-2 border rounded"
          required
        >
          <option value="">Select a Train</option>
          {trains.map((train) => (
            <option key={train.id} value={train.id}>
              {train.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Passenger Name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Make Reservation
        </button>
      </form>
    </div>
  );
}

export default ReservationView;
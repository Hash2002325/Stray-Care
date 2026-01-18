import { useEffect, useState } from "react";
function RecommendedMedicinePage() {
  const [medicines, setMedicines] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/medicines")
      .then(res => res.json())
      .then(data => setMedicines(data));
  }, []);
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Recommended Medicines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map(med => (
          <div key={med._id} className="border rounded p-4">
            <div className="font-bold">{med.medicine}</div>
            <div className="text-sm text-gray-500">{med.notes}</div>
            <div className="text-xs text-gray-400">{new Date(med.date).toLocaleString()}</div>
            {med.description && (
              <div className="mt-2 text-sm text-green-700">
                <span className="font-semibold">Report Description: </span>{med.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default RecommendedMedicinePage;

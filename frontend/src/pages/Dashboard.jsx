import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h2>
      <div className="flex flex-col gap-4 max-w-xs mx-auto">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/report')}>Report Animal</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/vets')}>Vet Registration</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/reported')}>Reported Animals</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/medicines')}>Recommended Medicines</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/vet-login')}>Vet Login</button>
      </div>
    </div>
  );
}
export default Dashboard;

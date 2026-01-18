import React, { useEffect, useState } from 'react';
function ReportedAnimalsPage() {
  const [reports, setReports] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [savedRecommendations, setSavedRecommendations] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});

  const fetchRecommendations = async () => {
    const res = await fetch("http://localhost:5000/api/medicines");
    const data = await res.json();
    const recs = {};
    data.forEach(med => {
      if (!recs[med.animalReportId]) recs[med.animalReportId] = [];
      recs[med.animalReportId].push(med.medicine);
    });
    setSavedRecommendations(recs);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/animalReports")
      .then(res => res.json())
      .then(data => setReports(data));
    fetchRecommendations();
  }, []);

  const handleEditClick = (id, description, location) => {
    setEditMode({ ...editMode, [id]: true });
    setEditValues({ ...editValues, [id]: { description, location } });
  };

  const handleEditChange = (id, field, value) => {
    setEditValues({
      ...editValues,
      [id]: {
        ...editValues[id],
        [field]: value
      }
    });
  };

  const handleEditSave = async (id) => {
    const { description, location } = editValues[id];
    const res = await fetch(`http://localhost:5000/api/animalReports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, location })
    });
    const updated = await res.json();
    setReports(reports.map(r => r._id === id ? { ...r, description: updated.description, location: updated.location } : r));
    setEditMode({ ...editMode, [id]: false });
  };

  const handleEditCancel = (id) => {
    setEditMode({ ...editMode, [id]: false });
  };

  const handleRecommendationChange = (id, value) => {
    setRecommendations({ ...recommendations, [id]: value });
  };

  const handleRecommendationSubmit = async (id) => {
    const medicine = recommendations[id];
    if (!medicine) return;
    await fetch("http://localhost:5000/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animalReportId: id, medicine })
    });
    setRecommendations({ ...recommendations, [id]: "" });
    fetchRecommendations();
  };

  const handleDeleteReport = async (id) => {
    await fetch(`http://localhost:5000/api/animalReports/${id}`, {
      method: "DELETE"
    });
    setReports(reports.filter(r => r._id !== id));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Reported Animals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(report => (
          <div key={report._id} className="border rounded p-4 relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
              onClick={() => handleDeleteReport(report._id)}
            >Delete</button>
            {report.image && <img src={`http://localhost:5000/uploads/${report.image}`} alt="Animal" className="w-full h-48 object-cover mb-2" />}
            {editMode[report._id] ? (
              <div className="mb-2">
                <input
                  type="text"
                  value={editValues[report._id]?.description || ""}
                  onChange={e => handleEditChange(report._id, "description", e.target.value)}
                  className="mb-1 p-2 border rounded w-full"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={editValues[report._id]?.location || ""}
                  onChange={e => handleEditChange(report._id, "location", e.target.value)}
                  className="mb-1 p-2 border rounded w-full"
                  placeholder="Location"
                />
                <button className="bg-green-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEditSave(report._id)}>Save</button>
                <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => handleEditCancel(report._id)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="font-bold mb-1">Description: {report.description}</div>
                <div className="text-sm text-gray-500 mb-1">Location: {report.location}</div>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mb-2" onClick={() => handleEditClick(report._id, report.description, report.location)}>Edit</button>
              </>
            )}
            {report.image && (
              <div className="text-xs text-gray-600 mb-1">Uploaded file: {typeof report.image === 'string' ? report.image.split('/').pop() : ''}</div>
            )}
            <div className="text-xs text-gray-400 mb-1">Reported on: {new Date(report.date).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Report ID: {report._id}</div>
            {!editMode[report._id] && (
              <div className="mt-4">
                <label htmlFor={`recommendation-${report._id}`} className="block font-semibold mb-1">Doctor Recommendation</label>
                <textarea
                  id={`recommendation-${report._id}`}
                  className="w-full p-2 border rounded"
                  placeholder="Enter recommendation here..."
                  value={recommendations[report._id] || ""}
                  onChange={e => handleRecommendationChange(report._id, e.target.value)}
                />
                <button
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleRecommendationSubmit(report._id)}
                >Submit</button>
              {savedRecommendations[report._id] && (
                <div className="mt-2 text-blue-600">
                  <div className="font-semibold">Previous Recommendations:</div>
                  <ul className="list-disc ml-5">
                    {savedRecommendations[report._id].map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default ReportedAnimalsPage;

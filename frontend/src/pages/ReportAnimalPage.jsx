import { useState } from "react";
function ReportAnimalPage() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", image);
    await fetch("http://localhost:5000/api/animalReports", {
      method: "POST",
      body: formData,
    });
    // Show success message or redirect
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Report Animal Issue</h2>
      <input type="file" onChange={e => setImage(e.target.files[0])} required className="mb-2" />
      <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required className="mb-2 p-2 border rounded w-full" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="mb-2 p-2 border rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
export default ReportAnimalPage;

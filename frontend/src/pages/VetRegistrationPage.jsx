import { useState } from "react";

function VetRegistrationPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/vets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, specialization, availability, username, password })
    });
    if (res.ok) {
      setMessage("Registration successful!");
      setName("");
      setContact("");
      setSpecialization("");
      setAvailability("");
      setUsername("");
      setPassword("");
    } else {
      setMessage("Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Vet Registration</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="mb-2 p-2 border rounded w-full" />
      <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact Info" required className="mb-2 p-2 border rounded w-full" />
      <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Specialization" required className="mb-2 p-2 border rounded w-full" />
      <input type="text" value={availability} onChange={e => setAvailability(e.target.value)} placeholder="Availability" required className="mb-2 p-2 border rounded w-full" />
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="mb-2 p-2 border rounded w-full" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="mb-2 p-2 border rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      {message && <div className="mt-2 text-green-500">{message}</div>}
    </form>
  );
}
export default VetRegistrationPage;

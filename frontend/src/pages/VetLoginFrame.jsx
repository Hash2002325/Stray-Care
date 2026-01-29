import API_URL from '../config';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VetLoginFrame() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/vets/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      setIsSuccess(true);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        setMessage("");
        setIsSuccess(false);
        navigate('/reported');
      }, 1000);
    } else {
      setIsSuccess(false);
      const data = await res.json();
      setMessage(data.message || "Invalid username or password.");
    }
  };

  return (
    <form className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8" onSubmit={handleLogin}>
      <h2 className="text-xl font-bold mb-4 text-blue-600">Vet Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      {message && (
        <div className={`mt-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>{message}</div>
      )}
    </form>
  );
}
export default VetLoginFrame;

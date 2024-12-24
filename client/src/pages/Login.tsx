import  { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        // Backend'e login isteği gönderiyoruz
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
          email,
          password,
        });
  
        // Eğer başarılıysa, token'ı ve kullanıcıyı aldıktan sonra token'ı localStorage'a kaydedebiliriz
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful! You are being directed...");
        // Kullanıcıyı anasayfaya yönlendiriyoruz
        setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
      } catch (err) {   
        toast.error("Invalid credentials"); 
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      <p className="text-center text-gray-600 mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
      </p>
    </div>
  </div>
  );
}

export default Login;

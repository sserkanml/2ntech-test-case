import  { useState, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
   

    try {
      await axios.post( 
        `${import.meta.env.VITE_SERVER_URL}/api/todos`,
        {
          title,
          description,
          completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Todo başarıyla eklendi!");
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Error adding todo", error);
      toast.error("Todo eklerken hata oluştu.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Todo Ekle</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Başlık</label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Açıklama</label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
            
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span className="ml-2">Tamamlandı</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Todo Ekle
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodo;

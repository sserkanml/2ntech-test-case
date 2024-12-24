import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const UpdateTodo = () => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current todo item from the backend
    const token = localStorage.getItem("token");
    if (token && id) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/todos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const todoData = response.data;
          setTodo(todoData);
          setTitle(todoData.title);
          setDescription(todoData.description);
          setCompleted(todoData.completed);
        })
        .catch((err) => {
          console.error("Error fetching todo", err);
          toast.error("Todo verisi alınırken hata oluştu");
        });
    }
  }, [id]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (token && todo) {
      axios
        .put(
          `${import.meta.env.VITE_SERVER_URL}/api/todos/${id}`,
          { title, description, completed },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          toast.success("Todo başarıyla güncellendi");
          navigate("/dashboard"); // Navigate back to dashboard
        })
        .catch((err) => {
          console.error("Error updating todo", err);
          toast.error("Todo güncellenirken hata oluştu");
          navigate("/dashboard");
        });
    }
  };

  if (!todo) {
    return <p>Yükleniyor...</p>; // Loading state
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Todo Düzenle</h1>
      <form onSubmit={handleUpdate} className="mt-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold">
            Başlık
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold">
            Açıklama
          </label>
          <textarea
            id="description"
            className="w-full p-2 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={completed}
              onChange={() => setCompleted(!completed)}
            />
            <span className="ml-2">Tamamlandı</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
};  

export default UpdateTodo;

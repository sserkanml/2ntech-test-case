import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

interface User {
    name: string;
    email: string;
}

interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}

const Dashboard = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        navigate("/login"); 
        toast.success("Çıkış yapıldı");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`${import.meta.env.VITE_SERVER_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setUser(response.data);
                    console.log(response.data)
                })
                .catch((err) => {
                    console.error("Error fetching user", err);
                    toast.error("Hata oluştu");
                });


            axios
                .get(`${import.meta.env.VITE_SERVER_URL}/api/todos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setTodos(response.data);
                })
                .catch((err) => {
                    console.error("Error fetching todos", err);
                    toast.error("Hata oluştu");
                });
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleEdit = (id: string) => {
        
        navigate(`/edit-todo/${id}`);
    };

    const handleDelete = (id: string) => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .delete(`${import.meta.env.VITE_SERVER_URL}/api/todos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setTodos(todos.filter((todo) => todo._id !== id));
                    toast.success("Todo başarıyla silindi");
                })
                .catch((err) => {
                    console.error("Error deleting todo", err);
                    toast.error("Hata oluştu");
                });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                {user && (
                    <div className="text-lg">
                        Merhaba, <span className="font-semibold">{user.name}</span>
                        <button
                    onClick={handleLogout}
                    className="bg-red-500 ml-4 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                >
                    Çıkış Yap
                </button>
                    </div>
                )}
                
            </div>

            <div className="mt-6">
                {todos.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-500">Henüz bir todo eklemediniz.</p>
                        <Link
                            to="/add-todo"
                            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                            Todo Ekle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {todos.map((todo) => (
                            <div
                                key={todo._id}
                                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl relative"
                            >
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(todo._id)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit size={20} /> {/* Edit icon */}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(todo._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash size={20} /> {/* Trash icon */}
                                    </button>
                                </div>
                                <h3 className="text-lg font-semibold">{todo.title}</h3>
                                <p className="text-gray-500">{todo.description}</p>
                                <div className="mt-2">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-white ${todo.completed ? "bg-green-500" : "bg-red-500"
                                            }`}
                                    >
                                        {todo.completed ? "Tamamlandı" : "Tamamlanmadı"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

           
            <Link
                to="/add-todo"
                className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
                <span className="text-2xl">+</span>
            </Link>
        </div>
    );
};

export default Dashboard;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from "react-toastify";
import PrivateRoute from './components/PrivateRoute';
import AddTodo from './pages/AddTodo';
import UpdateTodo from './pages/UpdateTodo';

function App() {

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={<Dashboard />} 
              />
            }
          />
            <Route
            path="/add-todo"
            element={
              <PrivateRoute
                element={<AddTodo />} 
              />
            }
          />
          <Route
            path="/edit-todo/:id"
            element={
              <PrivateRoute
                element={<UpdateTodo />} 
              />
            }
          />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>


  )
}

export default App

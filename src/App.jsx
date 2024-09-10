import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AssignTenant from './pages/AssignTenant';
import AssignedPropertyDetails from './components/AssignedPropertyDetails';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <>
      <Router>
        <div className="flex ">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content area */}
          <div className="flex-1 ml-32 "> {/* Add ml-64 to offset the sidebar width */}
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />
              <Route exact path="/properties/:propertyId" element={<ProtectedRoute element={<AssignedPropertyDetails />} />}/>
              <Route path="/properties/:id/assign" element={<ProtectedRoute element={<AssignTenant />} />}  />
            </Routes>

            {/* Footer */}
            {/* <Footer /> */}
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;


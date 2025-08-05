import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DocumentSearch } from "./Components/DocumentSearch";
import LoginPage from "./Components/loginPage";
import { Navbar } from "./Components/navbarPage";
import { UploadDocument } from "./Components/uploadFile";
import Admin from './Components/adminPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/search" element={<DocumentSearch />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
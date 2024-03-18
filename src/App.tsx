import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.scss';
import Game from './pages/Game';
import Home from './pages/Home';


function App() {
    return (
        <Router>
            <ToastContainer position="top-center"/>
            <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/game" element={<Game/>} />
            </Routes>
        </Router>
    );
}

export default App;

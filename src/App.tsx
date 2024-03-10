import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.scss';
import Game from './components/Game';
import WebSocketComponent from './WebSocketComponent';

function Home() {
  return (
    <>
      <div>Strona Główna</div>
      <WebSocketComponent />
      <Link to="/game">Rozpocznij grę</Link>
    </>
  );
}

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;

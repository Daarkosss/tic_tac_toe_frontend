import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketComponent from '../WebSocketComponent';

const Home: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/game', { state: { username } });
  };

  return (
    <>
      <h1>Strona Główna</h1>
      <WebSocketComponent />
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nazwa użytkownika:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Rozpocznij grę</button>
      </form>
    </>
  );
}

export default Home;

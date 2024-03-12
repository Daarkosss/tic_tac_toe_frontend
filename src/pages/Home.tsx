import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketComponent from '../WebSocketComponent';
import '../styles/Home.scss';

const Home: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate('/game', { state: { username } });
    };

    return (
        <div className="Home">
            <h1>Strona Główna</h1>
            <WebSocketComponent />
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="username">Nazwa użytkownika:</label>
                <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={5}
                />
                <button type="submit">Rozpocznij grę</button>
            </form>
        </div>
    )}

export default Home;

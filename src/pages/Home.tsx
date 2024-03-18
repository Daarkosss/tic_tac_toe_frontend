import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.scss';
import { store } from '../store/Store';

const Home: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        store.resetStore();
        console.log('XD');
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        store.username = username;
        navigate('/game');
    };

    return (
        <div className="Home">
            <h1>Strona Główna</h1>
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
                <button className="btn btn-light">Rozpocznij grę</button>
            </form>
        </div>
    )}

export default Home;

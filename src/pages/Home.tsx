import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.scss';
import { store } from '../store/Store';

interface HomeProps {
    user?: { username: string };
    onSignOut?: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onSignOut }) => {
    const navigate = useNavigate();

    useEffect(() => {
        store.resetStore();
        if (user?.username) {
            store.username = user.username;
        }
    }, [user?.username]);

    const startGame = () => {
        navigate('/game');
    };

    return (
        <div className="Home">
            <h1>Welcome, {user?.username}</h1>
            <button className="btn btn-light" onClick={startGame}>Start game</button>
            <button className="btn btn-warning" onClick={onSignOut}>Sign out</button>
        </div>
    )}

export default Home;

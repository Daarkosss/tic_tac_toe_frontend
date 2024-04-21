import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './styles/App.scss';
import Game from './pages/Game';
import Home from './pages/Home';

Amplify.configure(awsExports);

function App() {
    return (
        <Router>
            <ToastContainer position="top-center"/>
            <Authenticator signUpAttributes={['email']}>
                {({ signOut, user }) => (
                    <Routes>
                        <Route path="/" element={<Home user={user} onSignOut={signOut} />} />
                        <Route path="/game" element={<Game />} />
                    </Routes>
                )}
            </Authenticator>
        </Router>
    );
}

export default App;

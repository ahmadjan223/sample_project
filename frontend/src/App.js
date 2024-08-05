import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import DrawableMap from './components/drawableMap';

const App = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const name = query.get('name');
        const id = query.get('id');
        const image = query.get('image');

        if (name && id && image) {
            setUser({ displayName: name, id, image });
        }
    }, []);

    if (user) {
        return <DrawableMap user={user} />;
    }

    return <LandingPage></LandingPage>;
}

export default App;

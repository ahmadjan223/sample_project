import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './components/LandingPage';


const App = () => {
    const [user, setUser] = useState({
        displayName: "Ahmad Jan",
        id: "66afae5f5f3f07e8eb7826f6",
        image: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
      });
    // useEffect(() => {
    //     const query = new URLSearchParams(window.location.search);
    //     const name = query.get('name');
    //     const id = query.get('id');
    //     const image = query.get('image');
    //     if (name && id && image) {
    //         setUser({ displayName: name, id, image });
    //     }
    // }, []);
    // useEffect(() => {
    //     if(user){
    //         console.log("dummy data",user)
    //     }
    // },[user])
    if (user) {
        return <Dashboard user={user} />;
        // return <DashboardLayout></DashboardLayout>
        // return <BasicButtons></BasicButtons>;
    }

    return <LandingPage></LandingPage>;
}

export default App;

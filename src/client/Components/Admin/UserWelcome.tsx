import React from 'react';
import './styles.css';

const UserWelcome = () => {
    const username = localStorage.username;
    const greetings = `Welcome, ${username}`;

    return (
        <div id = 'welcome-banner'>
            {greetings}
        </div>
    );
};

export default UserWelcome;
import React, {useEffect} from 'react';
import './styles.css';

const UserWelcome = () => {
    // const userReducer = useSelector((state: IReducers) => state.userReducer)
    // console.log(userReducer.username);
    const username = localStorage.username;
    // useEffect(() => {
    //     const name = useSelector((state: IUserReducer) => state.username)
    // }, [userReducer])
    const greetings = `Welcome, ${username}`;

    return (
        <div id = 'welcome-banner'>
            {greetings}
        </div>
    );
};

export default UserWelcome;
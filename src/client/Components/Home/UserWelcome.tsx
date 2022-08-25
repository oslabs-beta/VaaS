import React, {useEffect} from 'react';
import './styles.css';

const UserWelcome = () => {
    // const userReducer = useSelector((state: IReducers) => state.userReducer)
    // console.log(userReducer.username);
    const username = localStorage.username;
    // useEffect(() => {
    //     const name = useSelector((state: IUserReducer) => state.username)
    // }, [userReducer])
    const greetings = `Welcome to VaaS, ${username} - here is your overview`;

    return (
        <div id = 'welcomeBanner'>
            {greetings}
        </div>
    );
};

export default UserWelcome;
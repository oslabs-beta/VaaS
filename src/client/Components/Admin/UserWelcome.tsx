import React from 'react';
import './styles.css';

type UserWelcomeProps = {
  user: string;
};

const UserWelcome = ({ user }: UserWelcomeProps) => {
  return <div id="welcome-banner">{`Welcome, ${user}`}</div>;
};

export default UserWelcome;

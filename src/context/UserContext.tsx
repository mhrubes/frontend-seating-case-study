import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
	const [isLoggedIn, setIsLogedIn] = useState(false);
	const [isHost, setIsHost] = useState();

  	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');

  // Login User
  const userLogin = (item: any) => {
		setEmail(item?.user?.email);
		setFirstname(item?.user?.firstName);
		setLastname(item?.user?.lastName);

		setIsLogedIn(true);
	};

  // Register User
	const userRegister = (item: any) => {
    	setEmail(item?.email);
		setPassword(item?.email);
		setFirstname(item?.firstname);
		setLastname(item?.lastname);

		setIsLogedIn(true);
	};

  // Logout User
  const userLogout = () => {
		setEmail('');
		setFirstname('');
		setLastname('');
		setIsLogedIn(false);
	}

  return (
    <UserContext.Provider value={{ isLoggedIn, isHost, email, password, firstname, lastname, setIsHost, userLogin, userRegister, userLogout, setEmail, setFirstname, setLastname }}>
      {children}
    </UserContext.Provider>
  );
};

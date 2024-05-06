import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

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
	const userLogin = async (item: any) => {
		let data = {}

		await axios.post('https://nfctron-frontend-seating-case-study-2024.vercel.app/login', item)
			.then(response => {
				if (response?.status === 200) {
					setEmail(response?.data?.user?.email);
					setFirstname(response?.data?.user?.firstName);
					setLastname(response?.data?.user?.lastName);

					setIsLogedIn(true);

					data.error = response?.status;
				}
			})
			.catch(error => {
				data.error = error.response?.status;
			});

		return data;
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
		<UserContext.Provider value={{
			isLoggedIn, isHost, email, password, firstname, lastname,
			setIsHost, userLogin, userRegister, userLogout, setEmail, setFirstname, setLastname
		}}>
			{children}
		</UserContext.Provider>
	);
};

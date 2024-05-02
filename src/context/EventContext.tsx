import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
	const [eventData, setEventData] = useState<any>(null);
	const [seatData, setSeatData] = useState<any>(null);
	const [seatTicketPrice, setSeatTicketPrice] = useState<any>(null);

	// Get Data from API
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Get Data about Event
				const responseEventData = await axios.get('https://nfctron-frontend-seating-case-study-2024.vercel.app/event');
				setEventData(responseEventData.data);

				// Get Data about Tickets for Event
				if (responseEventData) {
					const responseSeatData = await axios.get('https://nfctron-frontend-seating-case-study-2024.vercel.app/event-tickets?eventId=' + responseEventData.data?.eventId);
					setSeatData(responseSeatData.data);
					setSeatTicketPrice(responseSeatData.data.ticketTypes);
				}
			} catch (error) {
				console.error('Error fetching eventData:', error);
			}
		};

		fetchData();
	}, []);

	return (
		<EventContext.Provider value={{ eventData, seatData, seatTicketPrice }}>
			{children}
		</EventContext.Provider>
	);
};

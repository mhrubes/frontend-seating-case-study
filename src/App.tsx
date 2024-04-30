import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Seat } from '@/components/Seat.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import './App.css';

function App() {
	const isLoggedIn = false;
	
	const [eventData, setEventData] = useState<any>(null);
	const [seatData, setSeatData] = useState<any>(null);
	const [seatTicketPrice, setSeatTicketPrice] = useState<any>(null);

	const [cartItems, setCartItems] = useState<any[]>([]);
	const [totalPrice, setTotalPrice] = useState<any[]>(0);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const responseEventData = await axios.get('https://nfctron-frontend-seating-case-study-2024.vercel.app/event');
			setEventData(responseEventData.data);

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


	useEffect(() => {
		const newTotalPrice = cartItems.reduce((total, currentItem) => {
			return total + currentItem.price;
		  }, 0);
		
		setTotalPrice(newTotalPrice);
	}, [cartItems, seatTicketPrice]);
	  

	const addToCart = (item: any, price: number) => {
		setCartItems(prevItems => [...prevItems, {...item, price}]);
	};

	const removeFromCart = (item: any) => {
		setCartItems(prevItems => prevItems.filter(cartItem => cartItem.seatId !== item.data.seatId));
	};

	return (
		<div className="flex flex-col grow">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						<div className="bg-zinc-100 rounded-md size-12" />
					</div>
					{/* app/author title/name placeholder */}
					<div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
					{/* user menu */}
					<div className="max-w-[250px] w-full flex justify-end">
						{
							isLoggedIn ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost">
											<div className="flex items-center gap-2">
												<Avatar>
													<AvatarImage src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`} />
													<AvatarFallback>CN</AvatarFallback>
												</Avatar>
												
												<div className="flex flex-col text-left">
													<span className="text-sm font-medium">John Doe</span>
													<span className="text-xs text-zinc-500">john.doe@nfctron.com</span>
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[250px]">
										<DropdownMenuLabel>John Doe</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem disabled>
												Logout
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button variant="secondary">
									Login or register
								</Button>
							)
						}
					</div>
				</div>
			</nav>
			
			{/* main body (wrapper) */}
			<main className="grow flex flex-col justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
					{/* seating card */}
					<div className="bg-white rounded-md grow grid p-3 self-stretch shadow-sm" style={{
						gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
						gridAutoRows: '40px'
					}}>
						{/*	seating map */}
						{
							seatData?.seatRows.map((row) => (
								row.seats.map((seat) => (
									<Seat key={seat.seatId} data={seat} row={row.seatRow} ticketTypes={seatData.ticketTypes} addToCart={addToCart} removeFromCart={removeFromCart} />
								))
								))
						}
					</div>
					
					{/* event info */}
					<aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
						{/* event header image placeholder */}
						<div>
							<img src={eventData?.headerImageUrl} />
						</div>
						{/* event name */}
						<h1 className="text-xl text-zinc-900 font-semibold">{eventData?.namePub}</h1>
						{/* event description */}
						<p className="text-sm text-zinc-500">{eventData?.description}</p>
						{/* add to calendar button */}
						<Button variant="default">
							Detail
						</Button>
						<Button variant="secondary" disabled>
							Add to calendar
						</Button>
					</aside>
				</div>
			</main>
			
			{/* bottom cart affix (wrapper) */}
			<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
					{/* total in cart state */}
					<div className="flex flex-col">
						<span className='text-black'>Total for {cartItems.length} tickets</span>
						<span className="text-2xl text-black font-semibold"> {totalPrice} CZK</span>
					</div>
					
					{/* checkout button */}
					<Button disabled variant="default">
						Checkout now
					</Button>
				</div>
			</nav>
		</div>
	);
}

export default App;

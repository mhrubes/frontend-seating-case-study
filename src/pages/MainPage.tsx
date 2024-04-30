import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Seat } from '@/components/Seat.tsx';
import { CartDetail } from '@/components/cart/CartDetail';
import Login from '@/components/login/Login';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
// import '../App.css';

function MainPage() {
    const { t } = useTranslation();

	const [isLoggedIn, setIsLogedIn] = useState(false);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
  
	const [eventData, setEventData] = useState<any>(null);
	const [seatData, setSeatData] = useState<any>(null);
	const [seatTicketPrice, setSeatTicketPrice] = useState<any>(null);

	const [cartItems, setCartItems] = useState<any[]>([]);
	const [totalPrice, setTotalPrice] = useState<any[]>(0);

	const [cartModalIsOpen, setCartModalIsOpen] = useState(false);
	const [LoginModalIsOpen, setLoginModalIsOpen] = useState(false);

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

	const openCartModal = () => {
		if (cartItems.length > 0) {
			setCartModalIsOpen(true);
		}
	};

	const userLogin = (item: any) => {
		setEmail(item?.user?.email);
		setFirstname(item?.user?.firstName);
		setLastname(item?.user?.lastName);

		setIsLogedIn(true);
	};

	const userRegister = (item: any) => {
		setEmail(item?.email);
		setPassword(item?.email);
		setFirstname(item?.firstname);
		setLastname(item?.lastname);

		setIsLogedIn(true);
	};

	const logout = () => {
		setEmail('');
		setFirstname('');
		setLastname('');
		setIsLogedIn(false);
	}

	const closeCartModal = () => {
		setCartModalIsOpen(false);
	};

	const openLoginModal = () => {
		setLoginModalIsOpen(true);
	};

	const closeLoginModal = () => {
		setLoginModalIsOpen(false);
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
													<span className="text-sm font-medium"> {firstname} </span>
													<span className="text-xs text-zinc-500"> {email} </span>
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[250px]">
										<DropdownMenuLabel> {firstname} </DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem>
												<Button className='w-full' variant="outline" onClick={logout}>
													Logout
												</Button>
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button variant="secondary" onClick={openLoginModal}>
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
						{/* add to Detail button */}
						<Link to={'/eventDetail'}>
							<Button className='w-full' variant="default">
								Detail
							</Button>
						</Link>
						{/* add to calendar button */}
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

					{cartItems.length > 0 &&
						<Button variant="default" onClick={openCartModal}>
							Cart
						</Button>
					}

					{(cartModalIsOpen && cartItems.length > 0) && (
						<CartDetail closeCartModal={closeCartModal} />
					)}

					<Button variant="default" onClick={openLoginModal}>
						Checkout now
					</Button>

					{LoginModalIsOpen &&
						<Login closeLoginModal={closeLoginModal} userLogin={userLogin} userRegister={userRegister} />
					}

				</div>
			</nav>
		</div>
	);
}

export default MainPage;

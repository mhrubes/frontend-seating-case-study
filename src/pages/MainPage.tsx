import axios from 'axios';
import React, { useEffect, useState } from 'react';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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

import { Seat } from '@/components/Seat.tsx';
import { OrderModal } from '@/components/cart/OrderModal';
import { EventAside } from '@/components/EventAside';
import Login from '@/components/login/Login';

import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

function MainPage() {
    const { t, i18n } = useTranslation();
	const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const { cartItems, addToCart, removeFromCart } = useCart();
	const { isLoggedIn, isHost, email, password, firstname, lastname, setIsHost, userLogin, userRegister, userLogout } = useUser();
  
	const [eventData, setEventData] = useState<any>(null);
	const [seatData, setSeatData] = useState<any>(null);
	const [seatTicketPrice, setSeatTicketPrice] = useState<any>(null);

	const [totalPrice, setTotalPrice] = useState<any[]>(0);

	const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
	const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);

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

		const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
	  }, []);

	useEffect(() => {
		const newTotalPrice = cartItems.reduce((total, currentItem) => {
			return total + currentItem.price;
		  }, 0);
		
		setTotalPrice(newTotalPrice);
	}, [cartItems, seatTicketPrice]);

	// Cart Section
	// Add to Cart
	const handleAddToCart = (item: any, price: number, row: number) => {
		addToCart(item, price, row)
	};

	// Remove from Cart
	const handleRemoveFromCart = (item: any) => {
		removeFromCart(item.data.seatId);
	};
	// Cart Section

	// User Section
	// Login User
	const handleUserLogin = (item: any) => {
		userLogin(item);
	};

	// Register User
	const handleUserRegister = (item: any) => {
		userRegister(item);
	};

	// Logout User
	const logout = () => {
		userLogout()
	}
	// User Section

	const openLoginModal = () => {
		setLoginModalIsOpen(true);
	};

	const closeLoginModal = () => {
		setLoginModalIsOpen(false);
	};

	const openOrderModal = () => {
		setOrderModalIsOpen(true);
	}

	const closeOrderModal = (select: any) => {
		if (select === "user") {
			setOrderModalIsOpen(false);

			if (isLoggedIn) {
				navigate('/orderDetail');
			}
			else {
				setLoginModalIsOpen(true);
			}
		}
		else if (select === "host") {
			setOrderModalIsOpen(false);
			setIsHost(true);

			navigate('/orderDetail');
		}
		else {
			setOrderModalIsOpen(false);
		}
	}

	return (
		<div className="flex flex-col grow ">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						{windowWidth >= 450 &&
						<div className="bg-zinc-100 rounded-md">
						<Avatar>
							<AvatarImage src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						</div>
						}
					</div>
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
													<span className="text-sm font-medium text-black"> {firstname} </span>
													<span className="text-xs text-zinc-500"> {email} </span>
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[250px]">
										<DropdownMenuLabel> {firstname} {lastname} </DropdownMenuLabel>
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
		<main className="grow flex flex-col justify-center bg-white">
			{/* inner content */}
			<div className="max-w-screen-lg m-auto p-4 flex flex-col lg:flex-row gap-3">
				{/* seating card */}

				<div className="bg-white rounded-md grow shadow-sm lg:w-1/2">

				{windowWidth < 1024 && (
					<div>
						<EventAside data={eventData} />
						<br/>
					</div>
					)
				}


				{/* seating map */}
				<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10" style={{
						gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
						gridAutoRows: '40px'
					}}>
						{seatData?.seatRows.map((row) =>
						row.seats.map((seat) => (
							<Seat
							key={seat.seatId}
							data={seat}
							row={row.seatRow}
							ticketTypes={seatData.ticketTypes}
							addToCart={handleAddToCart}
							removeFromCart={handleRemoveFromCart}
							/>
						))
					)}
				</div>
			</div>

			{windowWidth >= 1024 &&
				<EventAside data={eventData} />
			}
			</div>
		</main>
			
			{/* bottom cart affix (wrapper) */}
			<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
					{/* total in cart state */}
					<div className="flex flex-col">
						<span className='text-black'>
							Celkově za {cartItems.length} {cartItems.length === 0 ? "vstupenek" 
							: cartItems.length === 1 ? "vstupenku" 
							: cartItems.length >= 5 ? "vstupenek" 
							: "vstupenky"}
						</span>
						<span className="text-2xl text-black font-semibold"> {totalPrice} {eventData?.currencyIso}</span>
					</div>
					
					{/* checkout button */}
					<Button variant="default" onClick={openOrderModal}>
						Checkout now
					</Button>

					{orderModalIsOpen &&
						<OrderModal closeOrderModal={closeOrderModal} />
					}

					{loginModalIsOpen &&
						<Login closeLoginModal={closeLoginModal} userLogin={handleUserLogin} userRegister={handleUserRegister} />
					}

				</div>
			</nav>
		</div>
	);
}

export default MainPage;

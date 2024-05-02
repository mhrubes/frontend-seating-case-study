import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';

import { useUser } from '../context/UserContext';
import { useEvent } from '../context/EventContext';
import { useCart } from '../context/CartContext';

const OrderDetail: React.FC = (props) => {
    const [eventData, setEventData] = useState<any>(null);

    const { cartItems, addToCart, removeFromCart } = useCart();
    const { seatTicketPrice } = useEvent();
    const { email, firstname, lastname, isHost, isLoggedIn, setEmail, setFirstname, setLastname, setIsHost } = useUser();

    const [totalPrice, setTotalPrice] = useState<any[]>(0);
    const [orderProccessAnswer, setOrderProccessAnswer] = useState();
    const [orderCompleted, setOrderCompleted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseEventData = await axios.get('https://nfctron-frontend-seating-case-study-2024.vercel.app/event');
                setEventData(responseEventData.data);

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

    const handleRemoveFromCart = (data: any) => {
        removeFromCart(data?.seatId)
    };

    const sortedCartItems = cartItems.sort((a, b) => {
        if (a.row !== b.row) {
            return a.row - b.row;
        }
        return a.place - b.place;
    });

    const groupedSeats = sortedCartItems.reduce((acc, seat) => {
        // If Row doesn't exist, create it
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        // Added seat
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const handleCreateOrder = () => {
        let data = {};
        let user;
        let tickets = [];

        if (isHost) {
            if ((email !== '' && email.includes('@')) && firstname !== '' && lastname !== '' && cartItems.length !== 0) {
                try {
                    user = { email: email, firstName: firstname, lastName: lastname };

                    data.user = user;
                    data.eventId = eventData.eventId;

                    cartItems.forEach((item) => {
                        tickets.push({ ticketTypeId: item.ticketTypeId, seatId: item.seatId })
                    });

                    data.tickets = tickets;

                    axios.post('https://nfctron-frontend-seating-case-study-2024.vercel.app/order', data)
                        .then(response => {
                            if (response?.status === 200) {
                                setOrderProccessAnswer(response?.status);
                                setOrderCompleted(true);
                            }
                        })
                        .catch(error => {
                            setOrderProccessAnswer(error?.response?.status)
                            return error;
                        });
                } catch (error) {
                    setOrderProccessAnswer(500)
                }
            }
            else {
                setOrderProccessAnswer(500);
            }
        }

        if (isLoggedIn) {
            try {
                user = { email: email, firstName: firstname, lastName: lastname };

                data.user = user;
                data.eventId = eventData.eventId;

                cartItems.forEach((item) => {
                    tickets.push({ ticketTypeId: item.ticketTypeId, seatId: item.seatId })
                });

                data.tickets = tickets;

                axios.post('https://nfctron-frontend-seating-case-study-2024.vercel.app/order', data)
                    .then(response => {
                        if (response?.status === 200) {
                            setOrderProccessAnswer(response?.status);
                            setOrderCompleted(true);
                        }
                    })
                    .catch(error => {
                        setOrderProccessAnswer(error?.response?.status)
                        return error;
                    });
            } catch (error) {
                setOrderProccessAnswer(500);
            }
        }
    }

    return (
        <div className='bg-white text-center h-full text-black'>
            <div className='flex flex-col min-h-screen justify-between container'>
                <div className='mt-8'>
                    <img className='h-10 mx-auto rounded-lg' style={{ height: "200px" }} src={eventData?.headerImageUrl} alt="Header" />
                    <h1 className='text-2xl pt-5'><strong>{eventData?.namePub}</strong></h1>

                    {/* seating map */}
                    <div className="text-center mt-2" style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                        gridAutoRows: '40px'
                    }}>
                        {cartItems.map((seat, index) => (
                            <Popover key={index}>
                                <PopoverTrigger>
                                    <div className={cn('size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-color m-1', props.className)}>
                                        <span className="text-lg text-black font-medium">[n]</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <pre>
                                        <p>Místo - {seat?.place}</p>
                                        <p>Řada - {seat?.row}</p>
                                        <p>Typ tiketu - {seatTicketPrice[0]?.id === seat?.ticketTypeId ? seatTicketPrice[1]?.name : seatTicketPrice[0]?.name}</p>
                                        <p>Cena tiketu - {seatTicketPrice[0]?.id === seat?.ticketTypeId ? seatTicketPrice[1].price : seatTicketPrice[0].price}</p>
                                    </pre>

                                    {!orderCompleted &&
                                        <footer className="flex flex-col">
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveFromCart(seat)}>
                                                Remove from cart
                                            </Button>
                                        </footer>
                                    }
                                </PopoverContent>
                            </Popover>
                        ))}
                    </div>

                    {cartItems.length !== 0 &&
                        <div className='mt-8 text-xl'>
                            <p>Celkový počet vstupenek: <strong>{cartItems.length}</strong> </p>
                            <p>Celková cena: <strong>{totalPrice}</strong> {eventData?.currencyIso}</p>
                        </div>
                    }

                    <hr className='mt-10' />

                    {isLoggedIn && !isHost && !orderCompleted && cartItems.length !== 0 &&
                        <Button onClick={handleCreateOrder} variant="default" className='mt-2'>
                            Odeslat objednávku
                        </Button>
                    }

                    {isHost && !orderCompleted && cartItems.length !== 0 && (
                        <div className='w-full text-center mt-10'>
                            <h3>Vyplňte objednávku</h3>
                            <form>
                                <div className="bg-gray-50 px-4 py-3 text-center">
                                    <input
                                        type="email"
                                        className="bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                                        placeholder="E-mail *"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                                        placeholder="Jméno *"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                                        placeholder="Příjmení *"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                    <p className='text-red-500 mt-2'></p>
                                    <Button className='mt-2' onClick={handleCreateOrder} variant="default" type='button'>
                                        Odeslat objednávku
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {orderCompleted && orderProccessAnswer === 200 &&
                        <div>
                            <p className='text-green-600'>
                                Objednávka byla <strong>úspěšně</strong> vytvořena.
                            </p>
                        </div>
                    }
                    {orderProccessAnswer === 400 &&
                        <div>
                            <p className='text-red-400'>
                                Nastala <strong>chyba</strong>. Zkontrolujte prosím vyplněná pole.
                            </p>
                        </div>
                    }
                    {orderProccessAnswer === 500 &&
                        <div>
                            <p className='text-red-400'>
                                Musíte vyplnit <strong>všechna</strong> pole.
                            </p>
                        </div>
                    }

                    {cartItems.length === 0 &&
                        <div className='mt-5 text-lg'>
                            Prozatím nemáte žádnou vstupenku v košíku
                        </div>
                    }

                </div>

                <div className='mb-10'>
                    <Link to='/'>
                        <Button className='w-40' variant="default" onClick={() => setIsHost(false)}>
                            Zpět
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

};

export default OrderDetail;

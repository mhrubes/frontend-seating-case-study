import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { useEvent } from '../context/EventContext';
import { useCart } from '../context/CartContext';

const OrderDetail: React.FC = (props) => {
    const { t } = useTranslation();

    const { cartItems, addToCart, removeFromCart } = useCart();
    const { eventData } = useEvent();
    const { seatTicketPrice } = useEvent();
    const { email, firstname, lastname, isHost, isLoggedIn, setIsHost } = useUser();

    const [totalPrice, setTotalPrice] = useState<any[]>(0);
    const [orderProccessAnswer, setOrderProccessAnswer] = useState();
    const [orderCompleted, setOrderCompleted] = useState(false);

    const [userEmail, setEmail] = useState(email);
    const [userFirstname, setFirstname] = useState(firstname);
    const [userLastname, setLastname] = useState(lastname);


    // Total Price of Tickets in Cart
    useEffect(() => {
        const newTotalPrice = cartItems.reduce((total, currentItem) => {
            return total + currentItem.price;
        }, 0);

        if (cartItems.length === 0) {
            setOrderCompleted(false);
            setOrderProccessAnswer();
        }

        setTotalPrice(newTotalPrice);
    }, [cartItems, seatTicketPrice]);

    // Remove from Cart
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

    // Order
    const handleCreateOrder = () => {
        let data = {};
        let user;
        let tickets = [];

        if (isHost) {
            if (((userEmail !== '' && userEmail.includes('@')) && userFirstname !== '' && userLastname !== '') && cartItems.length !== 0) {
                try {
                    user = { email: userEmail, firstName: userFirstname, lastName: userLastname };

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
            if (((userEmail !== '' && userEmail.includes('@')) || userFirstname !== '' || userLastname !== '') && cartItems.length !== 0) {
                try {
                    user = { email: userEmail, firstName: userFirstname, lastName: userLastname };

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
            } else {
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
                        {/* Mapping cartItems */}
                        {cartItems.map((seat, index) => (
                            <Popover key={index}>
                                <PopoverTrigger>
                                    <div className={cn('size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-color m-1', props.className)}>
                                        <span className="text-lg text-black font-medium">[n]</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <pre>
                                        <p>{t('seatPopover.place')} - {seat?.place}</p>
                                        <p>{t('seatPopover.row')} - {seat?.row}</p>
                                        <p>{t('seatPopover.ticketType')} - {seatTicketPrice[0]?.id === seat?.ticketTypeId ? seatTicketPrice[1]?.name : seatTicketPrice[0]?.name}</p>
                                        <p>{t('seatPopover.ticketPrice')} - {seatTicketPrice[0]?.id === seat?.ticketTypeId ? seatTicketPrice[1].price : seatTicketPrice[0].price}</p>
                                    </pre>

                                    {!orderCompleted &&
                                        <footer className="flex flex-col">
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveFromCart(seat)}>
                                                {t('seatPopover.removeFromCart')}
                                            </Button>
                                        </footer>
                                    }
                                </PopoverContent>
                            </Popover>
                        ))}
                    </div>

                    {/* Total Price and Count of Tickets in Cart */}
                    {cartItems.length !== 0 &&
                        <div className='mt-8 text-xl'>
                            <p dangerouslySetInnerHTML={{ __html: t('orderDetail.totalTickets', { total: cartItems.length }) }}></p>
                            <p dangerouslySetInnerHTML={{ __html: t('orderDetail.totalPrice', { price: totalPrice, type: eventData?.currencyIso }) }}></p>
                        </div>
                    }

                    <hr className='mt-10' />

                    {/* Send Order */}
                    {isLoggedIn && !isHost && !orderCompleted && cartItems.length !== 0 &&
                        <Button onClick={handleCreateOrder} variant="default" className='mt-2'>
                            {t('orderDetail.sendOrder')}
                        </Button>
                    }

                    {/* Host Section */}
                    {isHost && !orderCompleted && cartItems.length !== 0 && (
                        <div className='w-full text-center mt-10'>
                            <h3>{t('orderDetail.orderHostHeadline')}</h3>
                            <form>
                                <div className="bg-gray-50 px-4 py-3 text-center">
                                    <input
                                        type="userEmail"
                                        className="bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                                        placeholder={`${t('formValues.email')} *`}
                                        value={userEmail}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                                        placeholder={`${t('formValues.firstname')} *`}
                                        value={userFirstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                                        placeholder={`${t('formValues.lastname')} *`}
                                        value={userLastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                    <p className='text-red-500 mt-2'></p>
                                    <Button className='mt-2' onClick={handleCreateOrder} variant="default" type='button'>
                                        {t('orderDetail.sendOrder')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Error Messages */}
                    {orderCompleted && orderProccessAnswer === 200 &&
                        <div className='m-1'>
                            <p className='text-green-600' dangerouslySetInnerHTML={{ __html: t('customMessage.orderSuccess') }} />
                        </div>
                    }
                    {orderProccessAnswer === 400 &&
                        <div className='m-1'>
                            <p className='text-red-400' dangerouslySetInnerHTML={{ __html: t('customMessage.error400') }} />
                        </div>
                    }
                    {orderProccessAnswer === 500 &&
                        <div className='m-1'>
                            <p className='text-red-400' dangerouslySetInnerHTML={{ __html: t('customMessage.error500') }} />
                        </div>
                    }
                    {cartItems.length === 0 &&
                        <p className='mt-5 text-lg'>
                            {t('customMessage.emptyCart')}
                        </p>
                    }

                </div>

                {/* Back Button */}
                <div className='mb-10'>
                    <Link to='/'>
                        <Button className='w-40' variant="default" onClick={() => setIsHost(false)}>
                            {t('back')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default OrderDetail;

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
	const [isInCart, setIsInCart] = useState(false);

    const { cartItems, addToCart, removeFromCart } = useCart();
    const { seatTicketPrice } = useEvent();

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

    const handleRemoveFromCart = (data: any) => {
        removeFromCart(data?.seatId)
    
    // props.removeFromCart(data);
    // setIsInCart(false);
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

    return (
        <div className='bg-white text-center h-full text-black'>
            <div className='flex flex-col min-h-screen justify-between container'>
                <div className='mt-8'>
                    <img className='h-10 mx-auto rounded-lg' style={{height: "200px"}} src={eventData?.headerImageUrl} alt="Header" />
                    <h1 className='text-2xl pt-5'><strong>{eventData?.namePub}</strong></h1>
    
                    {/* seating map */}
                    <div className="text-center" style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                            gridAutoRows: '40px'
                        }}>
                        {cartItems.map((seat, index) => (
                            <Popover key={index}>
                                <PopoverTrigger>
                                    <div className={cn('size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-color m-1', props.className)}>
                                        <span className="text-xs text-zinc-400 font-medium">[n]</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <pre>
                                        <p>Místo - {seat?.place}</p>
                                        <p>Řada - {seat?.row}</p>
                                        <p>Typ tiketu - {seatTicketPrice[0]?.id === seat?.ticketTypeId ? seatTicketPrice[1]?.name : seatTicketPrice[0]?.name}</p>
                                        <p>Cena tiketu - {seatTicketPrice[0]?.id === seat?.ticketTypeId ? seatTicketPrice[1].price : seatTicketPrice[0].price}</p>
                                    </pre>
                        
                                    <footer className="flex flex-col">
                                        <Button variant="destructive" size="sm" onClick={() => handleRemoveFromCart(seat)}>
                                            Remove from cart
                                        </Button>
                                    </footer>
                                </PopoverContent>
                            </Popover>
                        ))}
                    </div>
                </div>
    
                <div className='mb-10'>
                    <Link to='/'>
                        <Button className='w-40' variant="default">
                            Zpět
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
};

export default OrderDetail;

import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		ticketTypes: {
		  id: string;
		  name: string;
		  price: number;
		}[];
		seatRows: {
		  seatRow: number;
		  seats: {
			seatId: string;
			place: number;
			ticketTypeId: string;
			row: number
		  }[];
		}[];
	  };	
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>((props, ref) => {
	const [isInCart, setIsInCart] = useState(false);

	let data = props;

	const addToCart = (item: any) => {
		let price = data?.ticketTypes[0].id === item?.ticketTypeId ? 1000 : 2000;

		props.addToCart(props?.data, price);
		setIsInCart(true);
	};

	const handleRemoveFromCart = () => {
		props.removeFromCart(data);
		setIsInCart(false);
	  };

	return (
		<Popover>
			<PopoverTrigger>
				<div className={cn('size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-color', props.className)}
				     ref={ref}>
					
					{isInCart ? (
						<span className="text-xl text-red-500 text-zinc-400 font-medium">[n]</span>
					) : (
						<span className="text-xs text-zinc-400 font-medium">[n]</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<pre>
					{/* {JSON.stringify({ seatData: props.data, row: props.row, row: props.row }, null, 1)} */}
					<p>Místo - {data?.place}</p>
					<p>Řada - {data?.row}</p>
					<p>Typ tiketu - {data?.ticketTypes[0].id === data?.data?.ticketTypeId ? 'Regular Ticket' : 'VIP ticket'}</p>
					<p>Cena tiketu - {data?.ticketTypes[0].id === data?.data?.ticketTypeId ? '1000' : '2000'}</p>
				</pre>

				<footer className="flex flex-col">{
					isInCart ? (
						<Button variant="destructive" size="sm" onClick={handleRemoveFromCart}>
							Remove from cart
						</Button>
					) : (
						<Button variant="default" size="sm" onClick={() => addToCart(props.data)}>
							Add to cart
						</Button>
					)
				}</footer>
			</PopoverContent>
		</Popover>
	);
});

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
				row: number;
			}[];
		}[];
		isInCart: boolean;
	};
	addToCart: (item: any) => void;
	removeFromCart: (item: any) => void;
}


export const Seat = React.forwardRef<HTMLDivElement, SeatProps>((props, ref) => {
	const { t } = useTranslation();

	const [isInCart, setIsInCart] = useState(props.data.isInCart);

	let data = props;

	useEffect(() => {
		setIsInCart(props.data.isInCart);
	}, [props.data.isInCart]);

	const addToCart = (item: any) => {
		let price = data?.ticketTypes[0].id === item?.ticketTypeId ? data?.ticketTypes[1].price : data?.ticketTypes[0].price;
		let row = data?.row;
		let isInCart = true;

		props.addToCart(props?.data, price, row, isInCart);
	};

	const handleRemoveFromCart = () => {
		props.removeFromCart(data);
	};

	return (
		<Popover>
			<PopoverTrigger>
				<div className={cn('size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-color', props.className)}
					ref={ref}>

					{isInCart ? (
						<span className="text-xl text-red-500 font-medium">[n]</span>
					) : (
						<span className="text-xs text-zinc-400 font-medium">[n]</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<pre>
					<p>{t('seatPopover.place')} - {data?.data?.place}</p>
					<p>{t('seatPopover.row')} - {data?.row}</p>
					<p>{t('seatPopover.ticketType')} - {data?.ticketTypes[0]?.id === data?.data?.ticketTypeId ? data?.ticketTypes[1]?.name : data?.ticketTypes[0]?.name}</p>
					<p>{t('seatPopover.ticketPrice')} - {data?.ticketTypes[0]?.id === data?.data?.ticketTypeId ? data?.ticketTypes[1].price : data?.ticketTypes[0].price}</p>
				</pre>

				<footer className="flex flex-col">{
					isInCart ? (
						<Button variant="destructive" size="sm" onClick={handleRemoveFromCart}>
							{t('seatPopover.removeFromCart')}
						</Button>
					) : (
						<Button variant="default" size="sm" onClick={() => addToCart(props.data)}>
							{t('seatPopover.addToCart')}
						</Button>
					)
				}</footer>
			</PopoverContent>
		</Popover>
	);
});

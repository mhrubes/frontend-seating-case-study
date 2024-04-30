import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';

const EventDetail: React.FC = (props) => {
	const [eventData, setEventData] = useState<any>(null);

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


      const getDate = (time) => {
          const date = new Date(time);
          const formattedTime = date.toLocaleTimeString('cs-CZ');
          const formattedDate = date.toLocaleDateString('cs-CZ');
          const formattedDateTime = `${formattedTime} ${formattedDate}`;

          return formattedDateTime;
      }

    return (
        <div className='bg-white text-center min-h-screen text-black'>
            <div className='flex flex-col h-screen justify-between container'>
                <div className='mt-8'>
                    <img className='h-10 mx-auto rounded-lg' style={{height: "200px"}} src={eventData?.headerImageUrl} alt="Header" />
                    <h1 className='text-2xl pt-5'><strong>{eventData?.namePub}</strong></h1>
                    <p className='pt-5 text-center'> {eventData?.description} </p>

                    <h3 className='text-xl mt-10'><strong>Čas a Datum konání</strong></h3>
                    <p className='text-xl mt-2'><strong> {getDate(eventData?.dateFrom)} - {getDate(eventData?.dateTo)} </strong></p>
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

export default EventDetail;

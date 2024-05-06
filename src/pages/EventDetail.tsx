import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { useTranslation } from 'react-i18next';

const EventDetail: React.FC = (props) => {
    const { t } = useTranslation();

    const [eventData, setEventData] = useState<any>(null);

    // get id from URL - Only Prepared
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    // API get Event - Useful add API for event?id=...
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
        <div className='bg-white text-center h-full text-black'>
            <div className='flex flex-col min-h-screen justify-between container'>
                <div className='mt-8'>
                    {/* Event Image */}
                    <img className='h-10 mx-auto rounded-lg' style={{ height: "200px" }} src={eventData?.headerImageUrl} alt="Header" />
                    {/* Event Name */}
                    <h1 className='text-2xl pt-5'><strong>{eventData?.namePub}</strong></h1>
                    {/* Event Description */}
                    <p className='pt-5 text-center'> {eventData?.description} </p>
                    {/* Event Date */}
                    <h3 className='text-xl mt-10'><strong>{t('eventDetail.when')}?</strong></h3>
                    <p className='text-xl mt-2'>{getDate(eventData?.dateFrom)} - {getDate(eventData?.dateTo)}</p>
                    {/* Event Place */}
                    <h3 className='text-xl mt-10'><strong>{t('eventDetail.where')}?</strong></h3>
                    <p className='text-xl mt-2'>{eventData?.place}</p>
                </div>

                {/* Back Button */}
                <div className='mb-10'>
                    <Link to='/'>
                        <Button className='w-40' variant="default">
                            {t('back')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

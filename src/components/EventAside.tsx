import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface EventAsideProps extends React.HTMLAttributes<HTMLElement> { }

export const EventAside = React.forwardRef<HTMLDivElement, EventAsideProps>((props) => {
    const { t } = useTranslation();

    const eventData = props?.data;

    return (
        <aside className="bg-white rounded-md shadow-sm p-3 flex flex-col gap-2 lg:w-1/2">
            {/* event header image placeholder */}
            <div>
                <img src={eventData?.headerImageUrl} alt="Event header" />
            </div>
            {/* event name */}
            <h1 className="text-xl text-zinc-900 font-semibold">{eventData?.namePub}</h1>
            {/* event description */}
            <p className="text-sm text-zinc-500">{eventData?.description}</p>
            {/* add to Detail button */}
            <Link to={'/eventDetail' + '?id=' + eventData?.eventId}>
                <Button className='w-full' variant="default">
                    {t('detail')}
                </Button>
            </Link>
            {/* add to calendar button */}
            <Button variant="secondary">
                {t('toCalendar')}
            </Button>
        </aside>
    );
});

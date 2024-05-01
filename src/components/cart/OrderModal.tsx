import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface OrderModalProps extends React.HTMLAttributes<HTMLElement> {}

export const OrderModal = React.forwardRef<HTMLDivElement, OrderModalProps>((props, ref) => {

    const handleUserSelect = (select) => {
        props.closeOrderModal(select);
    };

    const handleCloseModal = () => {
        props.closeOrderModal();
    };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Zvolte Možnost Pro pokračování
                </h3>
                <div className="bg-gray-50 px-4 py-3 text-center">
                  <div className="flex justify-center space-x-2 mt-2">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 pb-2 text-center">
          <Button className='m-1' variant="default" onClick={() => handleUserSelect("user")}>
                Uživatel
            </Button>
            <Button className='m-1' variant="default" onClick={() => handleUserSelect("host")}>
                Host
            </Button>
          </div>


          <div className="bg-gray-50 pb-2 text-center">
            <button
              onClick={handleCloseModal}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Zpět
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

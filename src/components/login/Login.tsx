import axios from 'axios';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';

interface LoginProps extends React.HTMLAttributes<HTMLElement> {
  closeLoginModal: (isOpen: boolean) => void;
}

const Login = React.forwardRef<HTMLDivElement, LoginProps>((props, ref) => {
  const [selectOfType, setSelectOfType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [loginError, setLoginError] = useState('');

  const handleCloseModal = () => {
    props.closeLoginModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectOfType === 'login') {
      let data = {
        email: email,
        password: password
      };

      axios.post('https://nfctron-frontend-seating-case-study-2024.vercel.app/login', data)
        .then(response => {
          if (response?.status === 200) {
            props.userLogin(response?.data)
            handleCloseModal();
          }
        })
        .catch(error => {
          setLoginError(error.response?.data?.message)
          return error;
        });
    }

    if (selectOfType === 'register') {
      let data = {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname
      };

      props.userRegister(data);
      handleCloseModal();
    }
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
                  {selectOfType === "login" ? "Přihlašovací okno" : "Registrační okno"}
                </h3>
              </div>
            </div>
          </div>

          {/* Login Section */}
          {selectOfType === 'login' &&
            <form onSubmit={handleLogin}>
              <div className="bg-gray-50 px-4 py-3 text-center">
                <input
                  type="email"
                  className="bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Heslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className='text-red-500 mt-2'>{loginError}</p>
                <Button type="submit" variant="default" className='mt-2'>
                  Přihlásit
                </Button>

              </div>
            </form>
          }

          {/* Register Section */}
          {selectOfType === 'register' &&
            <form onSubmit={handleLogin}>
              <div className="bg-gray-50 px-4 py-3 text-center">
                <input
                  type="text"
                  className="bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <input
                  type="text"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />

                <input
                  type="email"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Heslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="default" className='mt-2'>
                  Registrovat
                </Button>
              </div>
            </form>
          }

          <div className="bg-gray-50 pb-2 text-center">
            {selectOfType === "register" &&
              <Button onClick={() => setSelectOfType('login')} className='text-black' type="button" variant="outline">
                Přihlásit se
              </Button>
            }
            {selectOfType === "login" &&
              <Button onClick={() => setSelectOfType('register')} className='text-black' type="button" variant="outline">
                Registrovat se
              </Button>
            }
            <button onClick={handleCloseModal} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Zpět
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;

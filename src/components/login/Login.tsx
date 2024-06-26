import axios from 'axios';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';

interface LoginProps extends React.HTMLAttributes<HTMLElement> {
  closeLoginModal: (isOpen: boolean) => void;
}

const Login = React.forwardRef<HTMLDivElement, LoginProps>((props, ref) => {
  const { t } = useTranslation();

  const [selectOfType, setSelectOfType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [loginError, setLoginError] = useState();

  const { userLogin } = useUser();

  const handleCloseModal = () => {
    props.closeLoginModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // If selected Login
    if (selectOfType === 'login') {
      let data = {
        email: email,
        password: password
      };

      let log = await userLogin(data);

      if (log.error === 200) {
        handleCloseModal();
      }
      else {
        setLoginError(log.error);
      }
    }

    // If selected Register
    if (selectOfType === 'register') {
      if (email !== '' || email.length !== 0 || email.includes('@')) {
        let data = {
          email: email,
          password: password,
          firstname: firstname,
          lastname: lastname
        };

        props.userRegister(data);
        handleCloseModal();
      }
      else {
        setLoginError(100);
      }
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
                  {selectOfType === "login" ? t('formValues.loginModal.loginWindow') : t('formValues.registerModal.registerWindow')}
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
                  placeholder={t('formValues.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder={t('formValues.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {loginError === 401 &&
                  <p className='text-red-500 mt-2'>{t('customMessage.error401')}</p>
                }
                {/* Login Button */}
                <Button type="submit" variant="default" className='mt-2'>
                  {t('login')}
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
                  placeholder={t('formValues.firstname')}
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <input
                  type="text"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder={t('formValues.lastname')}
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                <input
                  type="email"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder={`${t('formValues.email')} *`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="mt-2 bg-white text-black border border-gray-300 rounded-md w-full py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder={t('formValues.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {loginError === 100 &&
                  <p className='text-red-500 mt-2'
                    dangerouslySetInnerHTML={{ __html: t('customMessage.error100') }}></p>}
                {/* Register Button */}
                <Button type="submit" variant="default" className='mt-2'>
                  {t('register')}
                </Button>
              </div>
            </form>
          }

          <div className="bg-gray-50 pb-2 text-center">
            {/* Login button */}
            {selectOfType === "register" &&
              <Button onClick={() => setSelectOfType('login')} className='text-black' type="button" variant="outline">
                {t('login')}
              </Button>
            }
            {/* Register button */}
            {selectOfType === "login" &&
              <Button onClick={() => setSelectOfType('register')} className='text-black' type="button" variant="outline">
                {t('register')}
              </Button>
            }
            {/* Back button */}
            <button onClick={handleCloseModal} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;

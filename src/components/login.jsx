import React, { useEffect } from 'react';
import Web3 from 'web3';
import MetaMaskOnboarding from '@metamask/onboarding';
import logo from '../logo.svg';

const web3 = new Web3(Web3.givenProvider);
const forwarderOrigin = 'http://localhost:4444';
const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const Login = () => {

  const initialState = {
    isSubmitting: false,
    errorMessage: null,
    isMetamaskInstalled: true,
  };

  const [data, setData] = React.useState(initialState);

  useEffect(() => {
    checkMetaMaskClient();
  }, []);

  const installMetamask = () => {
    onboarding.startOnboarding();
  };

  const checkMetaMaskClient = () => {
    if (isMetaMaskInstalled()) {
      data.isMetamaskInstalled === false &&
        setData({
          ...data,
          isMetamaskInstalled: true,
        });
      return true;
    }
    return false;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    try {
      if (checkMetaMaskClient()) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0];
      } else {
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: "Metamask isn't installed, Please install Metamask",
        });
      }
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message || error.statusText,
      });
    }
  };

  return (
    <div className='login-container'>
      <div className='card'>
        <div className='container'>
          <form onSubmit={handleFormSubmit}>
            <h2>Login</h2>
            {data.errorMessage && (
              <span className='form-error'>{data.errorMessage}</span>
            )}
            {data.isMetamaskInstalled ? (
              <button disabled={data.isSubmitting}>
                {data.isSubmitting ? (
                  <img className='spinner' src={logo} alt='loading icon' />
                ) : (
                  'Login with Metamask'
                )}
              </button>
            ) : (
              <button type='button' onClick={installMetamask}>
                Install Metamask'
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import logo from '@/assets/images/logo-white.png';
import profileDefault from '@/assets/images/profile.png';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import UnreadMessageCount from './UnreadMessageCount';

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();

    // Close mobile menu on resize
    const handleResize = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className='bg-blue-700 border-b border-blue-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          {/* Mobile Menu Button */}
          <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
            <button
              type='button'
              className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className='block h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <Link className='flex items-center' href='/'>
              <Image className='h-10 w-auto' src={logo} alt='LokalAds' />
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                LokalAds
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:ml-6 md:block'>
              <div className='flex space-x-2'>
                <Link
                  href='/'
                  className={`${
                    pathname === '/' ? 'bg-black' : ''
                  } text-white hover:bg-gray-900 rounded-md px-3 py-2`}
                >
                  Home
                </Link>
                <Link
                  href='/properties'
                  className={`${
                    pathname === '/properties' ? 'bg-black' : ''
                  } text-white hover:bg-gray-900 rounded-md px-3 py-2`}
                >
                  Properties
                </Link>
                {session && (
                  <Link
                    href='/properties/add'
                    className={`${
                      pathname === '/properties/add' ? 'bg-black' : ''
                    } text-white hover:bg-gray-900 rounded-md px-3 py-2`}
                  >
                    Add Property
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Auth (Right Side) */}
          {!session && (
            <div className='hidden md:flex md:items-center md:space-x-2'>
              <Link
                href='/login'
                className='text-white bg-gray-700 hover:bg-gray-900 rounded-md px-4 py-2'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='text-white bg-gray-700 hover:bg-gray-900 rounded-md px-4 py-2'
              >
                Register
              </Link>
              
            </div>
          )}

          {/* Logged-in User Right Section */}
          {session && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 md:static md:ml-6 md:pr-0'>
              <Link href='/messages' className='relative group'>
                <button
                  type='button'
                  className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                    />
                  </svg>
                </button>
                <UnreadMessageCount />
              </Link>

              {/* Profile Dropdown */}
              <div className='relative ml-3'>
                <button
                  type='button'
                  className='flex rounded-full bg-gray-800 text-sm focus:outline-none'
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <Image
                    className='h-8 w-8 rounded-full'
                    src={profileImage || profileDefault}
                    alt='Profile'
                    width={40}
                    height={40}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className='absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg'>
                    <Link
                      href='/profile'
                      className='block px-4 py-2 text-sm text-gray-700'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href='/properties/saved'
                      className='block px-4 py-2 text-sm text-gray-700'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved Properties
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className='block px-4 py-2 text-sm text-gray-700 w-full text-left'
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='px-2 pb-3 pt-2 space-y-1 md:hidden'>
          <Link
            href='/'
            className={`${
              pathname === '/' ? 'bg-black' : ''
            } text-white block rounded-md px-3 py-2 text-base font-medium`}
          >
            Home
          </Link>
          <Link
            href='/properties'
            className={`${
              pathname === '/properties' ? 'bg-black' : ''
            } text-white block rounded-md px-3 py-2 text-base font-medium`}
          >
            Properties
          </Link>
          {session && (
            <Link
              href='/properties/add'
              className={`${
                pathname === '/properties/add' ? 'bg-black' : ''
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              Add Property
            </Link>
          )}
          {!session && (
            <div className='space-y-2'>
              <Link
                href='/login'
                className='block text-white bg-gray-700 hover:bg-gray-900 rounded-md px-3 py-2 text-base'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='block text-white bg-gray-700 hover:bg-gray-900 rounded-md px-3 py-2 text-base'
              >
                Register
              </Link>
              
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

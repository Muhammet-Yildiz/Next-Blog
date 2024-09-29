import React from 'react';
import Link from 'next/link';

export const metadata = () => {
  return {
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
  };
};


export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="text-violet-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
}
"use client"
import React from 'react';

const ContactForm = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="example@example.com"
          />
        </div>
        <button className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
          Send Email
        </button>
      </div>
      <div className="bg-white p-8 ml-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="tel"
            placeholder="123-456-7890"
          />
        </div>
        <button className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
          Send SMS
        </button>
      </div>
    </div>
  );
};

export default ContactForm;

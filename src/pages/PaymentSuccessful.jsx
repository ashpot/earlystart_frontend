
import React from 'react';
import logo from '../assets/images/earlystartlogo.png';


const Section = ({ title, children }) => (
  <section className="mb-10">
    <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
    <div className="space-y-4 text-slate-700 leading-8 text-[17px]">
      {children}
    </div>
  </section>
);

const PaymentSuccessful = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8'>
        <a href='/' className='flex items-center space-x-4'>
          <img src={logo} alt="Logo Icon" className='w-auto' />
        </a>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] mb-10">Payment Successful</h1>
        <p className="text-lg font-medium mb-5">
          Congratulations! Your last payment was successful
        </p>


      
      </main>
    </div>
    
  );
};


export default PaymentSuccessful;
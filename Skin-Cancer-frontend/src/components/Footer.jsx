import React from 'react';

const Footer = () => {
  return (
    <div className='bg-gray-800 text-white py-6 px-2'>
      <div className='max-w-6xl mx-auto'>
        <p className='mb-4 text-left'>
            <strong>DermaIntel</strong> is not intended to perform diagnosis, but rather to provide users the ability to image, track, and better understand their moles.
        </p>
        <hr className='border-gray-600 my-4' />
        <p className='mb-4 text-left'>
          DermaIntel | All Rights Reserved. Copyright © 2025
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-left mb-4'>
          <div>
            <p className='font-semibold mb-1'>Navigation</p>
            <ul>
                <li><a href='#' className='hover:undeline'>Main</a></li>
                <li><a href="#" className='hover:underline'>Early Detection</a></li>
              <li><a href="#" className='hover:underline'>How it works</a></li>
              <li><a href="#" className='hover:underline'>Artificial Intelligence</a></li>
            </ul>
          </div>
          <div>
                <p className='font-semibold mb-1'>Resources</p>
                <ul>
                <li><a href="#" className='hover:underline'>Blog</a></li>
                <li><a href="#" className='hover:underline'>Contact Us</a></li>
                <li><a href="#" className='hover:underline'>Privacy Policy</a></li>
                <li><a href="#" className='hover:underline'>Terms of Service</a></li>
                </ul>
          </div>
          <div>
            <p className='font-semibold mb-1'>Contact</p>
            <p>Email: <br />
              <a href="mailto:support@ai-derm.com" className='text-blue-400 hover:underline'>
                support@ai-dermaintel.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
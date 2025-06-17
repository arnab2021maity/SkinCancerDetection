import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#525252] text-white py-8 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <p className="mb-4 text-left text-sm">
          <strong>DermaIntel</strong> is not intended to perform diagnosis, but rather to provide users the ability to image, track, and better understand their moles.
        </p>

        <hr className="border-gray-300 my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6">
          <div>
            <p className="font-semibold mb-2">Navigation</p>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Main</a></li>
              <li><a href="#" className="hover:underline">Early Detection</a></li>
              <li><a href="#" className="hover:underline">How it works</a></li>
              <li><a href="#" className="hover:underline">Artificial Intelligence</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Resources</p>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Contact</p>
            <p className="text-sm">
              Email: <br />
              <a href="mailto:support@ai-dermaintel.com" className="text-white font-bold hover:underline">
                support@ai-dermaintel.com
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-s text-gray-400 mt-4">
          &copy; 2025 DermaIntel. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

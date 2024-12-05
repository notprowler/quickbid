const Footer = () => {
  return (
    <footer className="bg-gray-200 py-16 text-gray-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-black">QuickBid</h1>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/shop" className="hover:underline">
              Categories
            </a>
            <a href="/login" className="hover:underline">
              About
            </a>
            <a href="/login" className="hover:underline">
              Contact
            </a>
            <a href="/login" className="hover:underline">
              Login
            </a>
            <a href="/login" className="hover:underline">
              Signup
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <p>CCNY 160 Convent Ave, New York, NY 10031</p>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-start">
          <p className="text-sm">
            © {new Date().getFullYear()} QuickBid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

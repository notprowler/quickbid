import Footer from "../components/Footer";
import shoppingBag from "../assets/shopping-bag.jpeg";
import device from "../assets/device.jpeg";
import furniture from "../assets/furniture.jpeg";
import foodImg from "../assets/food.jpeg";
import clothing from "../assets/clothing.jpg";

const LandingPage = () => {
  return (
    <>
      <div className="m-14 flex gap-4 space-x-10">
        <div className="ml-10 mr-10 flex flex-col justify-center">
          <h1 className="mb-2 ml-2 text-3xl">
            Welcome to QuickBid, the best place to find great deals and support
            sellers!
          </h1>
          <p className="mb-6 ml-2 text-gray-500">
            Browse by category, or search for specific items
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full max-w-lg rounded-xl bg-gray-200 px-6 py-3 text-lg text-black"
            />
            <button className="duration:200 ml-7 w-40 rounded-xl bg-[#3A5B22] px-4 py-2 text-lg text-white transition ease-in-out hover:bg-[#2F4A1A]">
              Search
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <img
            src={shoppingBag}
            alt="shopping-bag"
            className="h-80 w-80 object-contain"
          />
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-center p-6 text-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Browse the Range</h1>
          {/* <p className="mb-6 text-gray-500">
            Find out what your local businesses are selling!
          </p> */}
        </div>
        <div className="mb-4 mt-8 flex justify-center gap-4 space-x-8">
          <div className="flex flex-col items-center">
            <img src={device} className="mb-2 h-80 w-80 object-cover" />
            <h2 className="mt-4 text-lg font-semibold">Devices</h2>
          </div>

          <div className="flex flex-col items-center">
            <img src={furniture} className="mb-2 h-full w-80 object-cover" />
            <h2 className="mt-4 text-lg font-semibold">Furniture</h2>
          </div>

          {/* <div className="flex flex-col items-center">
            <img src={foodImg} className="mb-2 h-80 w-80 object-cover" />
            <h2 className="mt-4 text-lg font-semibold">Food</h2>
          </div> */}
          <div className="flex flex-col items-center">
            <img src={clothing} className="mb-2 h-80 w-80 object-cover" />
            <h2 className="mt-4 text-lg font-semibold">Clothing</h2>
          </div>
        </div>

        <a
          href="/listings"
          className="duration:200 mt-16 inline-block rounded-xl border-2 border-[#B88E2F] px-6 py-2 text-center text-[#B88E2F] transition ease-in-out hover:bg-[#B88E2F] hover:text-white"
        >
          Show more
        </a>
      </div>

      <Footer />
    </>
  );
};

export default LandingPage;

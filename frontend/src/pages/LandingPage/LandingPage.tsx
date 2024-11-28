import React from 'react'
import Navbar from '../../components/Navbar'
import shoppingBag from "../../assets/shopping-bag.jpeg"
import Footer from '../../components/Footer'
import device from "../../assets/device.jpeg"
import furniture from "../../assets/furniture.jpeg"
import foodImg from "../../assets/food.jpeg"
import clothing from "../../assets/clothing.jpg"


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex m-14 space-x-10 gap-4 ">
        <div className="flex flex-col justify-center ml-10 mr-10">
          <h1 className="text-3xl ml-2 mb-2">Welcome to QuickBid, the best place to find great deals and support local businesses!</h1>
          <p className="mb-6  ml-2 text-gray-500">Browse by category, or search for specific items</p>
          <div className="flex">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-gray-200 text-black py-3 px-6 rounded-xl w-full max-w-lg text-lg"
            />
            <button className="w-40 ml-7 bg-[#3A5B22] text-white text-lg py-2 px-4 rounded-xl hover:bg-[#2F4A1A]">Search</button>
          </div>
          
        </div> 
        <div className="flex-grow">
          <img
            src={shoppingBag}
            alt="shopping-bag"
            className="w-80 h-80 object-contain"
          />
        </div>
     </div>

      <div className="flex flex-col items-center justify-center text-center p-6 mt-14">
        <div>
          <h1 className="text-3xl font-bold mb-4">Browse the Range</h1>
          <p className="mb-6 text-gray-500">Find out what your local businesses are selling!</p>
        </div>
        <div className="flex space-x-8 mt-8 mb-4 justify-center gap-4">
          <div className="flex flex-col items-center">
            <img src={device} className="w-80 h-80 object-cover mb-2" />
            <h2 className="text-lg font-semibold mt-4">Devices</h2>
          </div>
          
          <div className="flex flex-col items-center">
            <img src={furniture} className="w-80 h-full object-cover mb-2" />
            <h2 className="text-lg font-semibold mt-4">Furniture</h2>
          </div>

          <div className="flex flex-col items-center">
            <img src={foodImg} className="w-80 h-80 object-cover mb-2" />
            <h2 className="text-lg font-semibold mt-4">Food</h2>
          </div>
          <div className="flex flex-col items-center">
            <img src={clothing} className="w-80 h-80 object-cover mb-2" />
            <h2 className="text-lg font-semibold mt-4">Clothing</h2>
          </div>
        </div>

        <a href="/login"className="text-[#B88E2F] border-2 border-[#B88E2F] py-2 px-6 rounded-xl mt-16 inline-block text-center hover:bg-[#B88E2F] hover:text-white">
          Show more
        </a>
      </div>

      <Footer/>
    </>
  )
}

export default LandingPage
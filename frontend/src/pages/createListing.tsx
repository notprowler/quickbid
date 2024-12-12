import React, { useState } from "react";
import axios from "axios";

const CreateListing: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("sell");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [deadline, setDeadline] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("category", category);

    if (type === "auction") {
      formData.append("deadline", deadline);
    }

    // formData.append('owner_id', ownerId); // Add a default owner_id for testing

    // Append multiple images
    if(type === 'auction')
    {
      formData.append('deadline', new Date(deadline).toISOString());
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/listings",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Listing created:", response.data);

      // Show success message
      setSuccessMessage("Listing created!");

      // Reset form fields
      setTitle("");
      setDescription("");
      setType("sell");
      setPrice("");
      setCategory("");
      setOwnerId("");
      setImages([]);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 10000);
    } catch (error) {
      console.error("Error creating listing:", error);
      //@ts-ignore
      console.error("Error response:", error.response);
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to Array and limit to 5 images
      const fileArray = Array.from(e.target.files).slice(0, 5);
      setImages(fileArray);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-300 bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Create Listing</h1>
      {successMessage && (
        <div className="mb-4 rounded bg-green-500 p-2 text-white">

          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="mb-1 block font-semibold">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
            required
          />
        </div>
        <div className="form-group">
          <label className="mb-1 block font-semibold">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"

            required
          />
        </div>
        <div className="form-group">
          <label className="mb-1 block font-semibold">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"

            required
          >
            <option value="sell">Sell</option>
            <option value="auction">Auction</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        {type === "auction" && (
          <div className="form-group">
            <label className="mb-1 block font-semibold">Deadline:</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label className="mb-1 block font-semibold">Price:</label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
            required
          />
        </div>
        <div className="form-group">
          <label className="mb-1 block font-semibold">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"

            required
            >
            <option value="" disabled>Select a category</option>
            <option value="Clothes">Clothes</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Toys">Toys</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Garden & Outdoor">Garden & Outdoor</option>
            <option value="Musical Instruments">Musical Instruments</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {type === 'auction' && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label className="mb-1 block font-semibold">Images (up to 5):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded border border-gray-300 p-2"
          />
          {images.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {images.length} image(s) selected
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded bg-[#3A5B22] hover:bg-[#2F4A1A] px-4 py-2 font-semibold text-white "
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;

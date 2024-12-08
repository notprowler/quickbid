import React, { useState } from 'react';
import axios from 'axios';

const CreateListing: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('sell');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('owner_id', ownerId || '104'); // Add a default owner_id for testing

        // Append multiple images
        images.forEach((image) => {
            formData.append('images', image);
        });
        
        try {
            const response = await axios.post('http://localhost:3000/api/listings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Listing created:', response.data);
            
            // Show success message
            setSuccessMessage('Listing created!');

            // Reset form fields
            setTitle('');
            setDescription('');
            setType('sell');
            setPrice('');
            setCategory('');
            setOwnerId('');
            setImages([]);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 10000);
        } catch (error) {
            console.error('Error creating listing:', error);
            console.error('Error response:', error.response);
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
        <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white">
            <h1 className="text-2xl font-bold mb-4">Create Listing</h1>
            {successMessage && (
                <div className="bg-green-500 text-white p-2 mb-4 rounded">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="block font-semibold mb-1">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Type:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        <option value="sell">Sell</option>
                        <option value="auction">Auction</option>
                        <option value="rent">Rent</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Images (up to 5):</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {images.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                            {images.length} image(s) selected
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
                >
                    Create Listing
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
import React, { useState } from 'react';
import axios from 'axios';

const CreateListing: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('sell');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('owner_id', ownerId);
        if (image) {
            formData.append('image', image);
        }

        const [userId, setUserId] = useState(null);

        // I will be implementing this endpoint for checking the user and giving back user_id 

        // useEffect(() => {
        //     // Fetch the user ID when the page loads
        //     const fetchUserId = async () => {
        //         try {
        //             const response = await fetch('/api/verify', {
        //                 method: 'GET',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'X-User-Email': 'user1@example.com', // Example: Pass authentication info
        //                 },
        //             });
        //             if (response.ok) {
        //                 const data = await response.json();
        //                 setUserId(data.id);
        //             } else {
        //                 console.error('Failed to fetch user ID');
        //             }
        //         } catch (error) {
        //             console.error('Error:', error);
        //         }
        //     };
    
        //     fetchUserId();
        // }, []);
        
        try {
            const response = await axios.post('http://localhost:3000/api/listings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Listing created:', response.data);
            // Reset form fields
            setTitle('');
            setDescription('');
            setType('sell');
            setPrice('');
            setCategory('');
            setOwnerId('');
            setImage(null);
        } catch (error) {
            console.error('Error creating listing:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white">
            <h1 className="text-2xl font-bold mb-4">Create Listing</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="block font-semibold mb-1">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Type:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="sell">Sell</option>
                        <option value="auction">Auction</option>
                        <option value="auction">Rent</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Price:</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group">
                    <label className="block font-semibold mb-1">Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700">
                    Create Listing
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
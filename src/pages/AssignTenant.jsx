import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AssignTenant() {
  const { id } = useParams(); // Property ID
  const navigate = useNavigate(); // Navigation hook
  const [property, setProperty] = useState(null);
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/properties/get/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        console.log(data)
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to load property details.');
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const [tenantData, setTenantData] = useState({
    tenantName: '',
    tenantContact: '',
    startDate: '',
    endDate: '',
    totalRent: '',
    rentPaid: ''
  });
  const [propertyPrice, setPropertyPrice] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenantData({ ...tenantData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/api/properties/${id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenantData),
      });
  
      if (response.ok) {
        const property = await response.json();
        console.log(property.price);
        setPropertyPrice(property.price);
        
        alert('Tenant assigned successfully!');
        navigate(`/properties/${id}`); // Navigate to the property details page
      } else {
        const errorData = await response.json();
        alert(`Failed to assign tenant: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while assigning tenant.');
    }
  };


  return (
    <div className="container bg-gray-900  ps-36 pe-5 py-10">
      <h1 className="text-2xl font-bold mb-4 text-white">Assign Tenant</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-white">Tenant Name</label>
            <input
              type="text"
              name="tenantName"
              value={tenantData.tenantName}
              onChange={handleInputChange}
              className="w-full p-2 border  border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-white">Contact</label>
            <input
              type="text"
              name="tenantContact"
              value={tenantData.tenantContact}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-white">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={tenantData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-white">End Date</label>
            <input
              type="date"
              name="endDate"
              value={tenantData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-white">Total Rent</label>
            <input
              type="number"
              name="totalRent"
              value={tenantData.totalRent}
              onChange={handleInputChange}
              placeholder={property ? property.price : ''}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = property ? property.price : '' }
              className="w-full p-2 border placeholder:text-gray-400 border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-white">Rent Paid</label>
            <input
              type="number"
              name="rentPaid"
              value={tenantData.rentPaid}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-800"
        >
          Assign Tenant
        </button>
      </form>
    </div>
  );
}







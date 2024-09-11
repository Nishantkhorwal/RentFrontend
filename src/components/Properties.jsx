import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsBuildings } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [rentDueProperties, setRentDueProperties] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Add search state
  const [tenureEndingProperties, setTenureEndingProperties] = useState([]);
  
  
  const calculateDaysLeft = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysLeft;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/properties/get');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setProperties(data);

          // Filter properties that are assigned and have rent due
          const dueProperties = data.filter(property => property.isAssigned && property.assignedTenant.rentPaid < property.price);
          console.log(dueProperties);
          
          const endingSoonProperties = data.filter(property => 
            property.isAssigned && calculateDaysLeft(property.assignedTenant.endDate) <= 10
          );

          // If there are any rent due or tenure ending properties, show the popup
          if (dueProperties.length > 0 || endingSoonProperties.length > 0) {
            setRentDueProperties(dueProperties);
            setTenureEndingProperties(endingSoonProperties); // Set tenure ending properties
            setShowPopup(true); // Show popup if there are any rent due or tenure ending properties
          }
        } else {
          console.error('Expected an array but received:', data);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter(property =>
    property.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="py-10  w-full   bg-gray-900">
        <div className='flex justify-between items-center mb-4 px-44'>
        <div className='flex flex-row items-center'><BsBuildings className='text-white text-4xl me-2'/><h1 className="text-4xl font-bold text-white  text-center me-10">Properties</h1></div>

        {/* Search Bar */}
        <div className=" flex justify-end items-center">
          <IoSearchOutline className='text-white text-4xl me-4'/>
          <input
            type="text"
            placeholder="Search.."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-md p-2 border rounded-xl shadow-sm"
          />
        </div>
        </div>

        {/* Popup for rent due properties */}
        {/* {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Rent Due Properties</h2>
              <ul>
                {rentDueProperties.map(property => (
                  <li key={property._id} className="mb-2">
                    <p className="font-semibold">{property.propertyName}</p>
                    <p className="text-sm text-gray-600">Rent Paid: ₹{property.assignedTenant.rentPaid} / ₹{property.price}</p>
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        )} */}
        {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      {/* Rent Due Properties Section */}
      <h2 className="text-2xl font-bold mb-4">Rent Due Properties</h2>
      <ul>
        {rentDueProperties.length > 0 ? (
          rentDueProperties.map(property => (
            <li key={property._id} className="mb-2">
              <p className="font-semibold">{property.propertyName}</p>
              <p className="text-sm text-gray-600">Rent Paid: ₹{property.assignedTenant.rentPaid} / ₹{property.price}</p>
            </li>
          ))
        ) : (
          <li className="mb-2">
            <p className="text-sm text-gray-600">No properties with rent due.</p>
          </li>
        )}
      </ul>

      {/* Tenure Ending Soon Section */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Tenure Ending Soon</h2>
      <ul>
        {tenureEndingProperties.length > 0 ? (
          tenureEndingProperties.map(property => (
            <li key={property._id} className="mb-2">
              <p className="font-semibold">{property.propertyName}</p>
              <p className="text-sm text-gray-600">End Date: {new Date(property.assignedTenant.endDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Days Left: {calculateDaysLeft(property.assignedTenant.endDate)} days</p>
            </li>
          ))
        ) : (
          <li className="mb-2">
            <p className="text-sm text-gray-600">No properties near end date.</p>
          </li>
        )}
      </ul>

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={closePopup}
      >
        Close
      </button>
    </div>
  </div>
)}


        {/* Property listing */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => {
              const isRentDueInAssignedTenant = property.isAssigned && property.assignedTenant.rentPaid < property.price;
              const isRentDueInOldTenants = property.oldTenants && property.oldTenants.some(tenant => tenant.rentPaid < tenant.totalRent);
              return ( 
              <div key={property._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-full p-4">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden relative">
                {(isRentDueInAssignedTenant || isRentDueInOldTenants) && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded">
                        Rent Due
                      </div>
                    )}
                  <img 
                    src={property.imageUrl || '/images/default.jpg'} 
                    alt={property.propertyName} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{property.propertyName}</h2>
                    <p className="text-gray-600 mb-2">Monthly Rent: ₹{property.price}</p>
                    <p className="text-gray-600 mb-4">Location: {property.location}</p>

                    {/* Always show "View Tenant Info" */}
                    <div className='flex flex-row'>
                    <Link 
                      to={`/properties/${property._id}`} 
                      className="block bg-green-500 text-white text-center text-sm px-4 me-5 py-2 rounded hover:bg-green-600"
                    >
                      Tenant Info
                    </Link>

                    {/* Conditionally show "Assign Tenant" */}
                    {!property.isAssigned && (
                      <Link 
                        to={`/properties/${property._id}/assign`} 
                        className="block bg-blue-500 text-white text-sm text-center pb-1 pt-2 px-2 rounded hover:bg-blue-600 "
                      >
                        Assign Tenant
                      </Link>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          ) : (
            <p className="text-center w-full text-xl text-red-600 font-bold">No properties found.</p>
          )}
        </div>
      </div>
    </>
  );
}









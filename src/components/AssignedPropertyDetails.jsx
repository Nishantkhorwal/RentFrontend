import React, { useEffect, useState,  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function AssignedPropertyDetails() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [newRentPaid, setNewRentPaid] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editingRent, setEditingRent] = useState(false);
  const [extendingTenure, setExtendingTenure] = useState(false);
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [newTotalRent, setNewTotalRent] = useState('');
  const [error, setError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [totalRentError, setTotalRentError] = useState('');
  const [editingOldTenant, setEditingOldTenant] = useState(null);
  const [newOldTenantRentPaid, setNewOldTenantRentPaid] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/properties/get/${propertyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        console.log(data); // Log the API response for debugging
        setProperty(data);
        setNewRentPaid(data.assignedTenant?.rentPaid || ''); // Pre-fill the current rent paid
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to load property details.');
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleRentUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const rentPaidStr = String(newRentPaid);
    if (isNaN(newRentPaid) || rentPaidStr.trim() === '') {
      setError('Please enter a valid rent amount.');
      setUpdating(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/properties/${propertyId}/update-rent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRentPaid: Number(newRentPaid) }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rent.');
      }

      const updatedProperty = await response.json();
      setProperty(updatedProperty.property);
      setEditingRent(false); // Close the edit form on successful update
      alert('Rent updated successfully!');
    } catch (error) {
      console.error('Error updating rent:', error);
      setError('Failed to update rent.');
    } finally {
      setUpdating(false);
    }
  };
  const handleOldTenantRentUpdate = async (tenantId) => {
    // Validate rent amount
    setUpdating(true);

    const rentPaid = Number(newOldTenantRentPaid);
    if (isNaN(rentPaid) || newOldTenantRentPaid.trim() === '') {
      setError('Please enter a valid rent amount.');
      setUpdating(false);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/properties/${propertyId}/old-tenant/${tenantId}/update-rent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOldTenantRentPaid: rentPaid }), // Use the correct field name and send the number
      });
  
      if (!response.ok) throw new Error('Failed to update old tenant rent.');
      const updatedProperty = await response.json();
      setProperty(updatedProperty.updatedTenant); // Update state with the new property data
      setEditingOldTenant(null);
      setNewOldTenantRentPaid(''); // Clear the input field
      alert('Old tenant rent updated successfully!');
      navigate(`/`);
    } catch (error) {
      setError('Failed to update old tenant rent.');
    } finally {
      setUpdating(false); // Reset loading state
    }
  };
  
  

  if (error) {
    return <div className='py-16 bg-gray-100'><div className="container mx-auto px-10 py-8 ml-32">{error}</div></div>;
  }

  if (!property) {
    return <div className='py-16 bg-gray-100'><div className="container mx-auto px-10 py-8 ml-32 ">Loading...</div></div>;
  }

  // Ensure assignedTenant exists before trying to access its properties
  const tenantHasEnded = property.assignedTenant && new Date(property.assignedTenant.endDate) < new Date();
  const assignedTenant = property.assignedTenant || {};

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const handleTenureExtension = async () => {
    setEndDateError('');
    setTotalRentError('');

    // Validate fields
    if (!newEndDate) {
      setEndDateError('Please select a new end date.');
      return;
    }

    if (!newTotalRent || isNaN(newTotalRent)) {
      setTotalRentError('Please enter a valid total rent.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/properties/${propertyId}/extend-tenure`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEndDate,
          newTotalRent,
        }),
      });

      if (response.ok) {
        const updatedProperty = await response.json();
        // Update the state with the new property details
        setProperty(updatedProperty);
        setExtendingTenure(false);
      } else {
        console.error('Failed to update tenure and total rent');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className='py-16 ml-32 px-10 bg-gray-900'>
      <div className="container border shadow-xl bg-white mx-auto px-10 rounded-lg py-8">
        <h1 className="text-6xl font-bold mb-6">{property.propertyName}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Property Image */}
          <div className="flex-shrink-0 w-full  lg:w-1/2">
            <img
              src={property.imageUrl || 'fallback-image-url.jpg'}
              alt={property.propertyName}
              className="w-[700px] h-96 rounded-lg shadow-md"
            />
          </div>

          {/* Property Details */}
          <div className="flex-grow flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-8">
                {!property.assignedTenant ? (
                  <div className='text-3xl font-semibold text-red-600'>
                    This property is not assigned to any tenant right now!
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-4xl font-semibold mb-4">Property Details</h2>
                      <div className='flex flex-row flex-wrap gap-8'>
                        <p className='text-xl'><strong>Location:</strong> {property.location}</p>
                        <p className='text-xl'><strong>Total Rent:</strong> ₹{assignedTenant.totalRent}</p>
                        <div className="flex  items-center gap-2 text-xl">
                          <div className='relative '>
                          <strong>Rent Paid:</strong>
                          {editingRent ? (
                            <div className="absolute py-4  -left-5 z-10 top-5 bg-white border border-gray-300 shadow-lg rounded  mt-2 w-44">
                            <form onSubmit={handleRentUpdate} className="flex flex-col  items-center ">
                              <input
                                type="number"
                                className="border w-[80%]"
                                value={newRentPaid}
                                onChange={(e) => setNewRentPaid(e.target.value)}
                                disabled={updating}
                                required
                              />
                              <div className='flex flex-row justify-start items-start mt-3 gap-1'>
                              <button
                                type="submit"
                                className="bg-blue-500 text-lg text-white px-1 py-1 rounded hover:bg-blue-600"
                                disabled={updating}
                              >
                                {updating ? 'Updating...' : 'Update'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingRent(false)}
                                className="bg-gray-300 text-lg text-black px-2 py-1 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                              </div>
                            </form>
                            </div>
                          ) : (
                            <>
                              ₹{assignedTenant.rentPaid}
                              <button
                                type="button"
                                onClick={() => setEditingRent(true)}
                                className="ml-4 font-semibold text-blue-500 rounded-lg bg-white border px-4"
                              >
                                Edit
                              </button>
                            </>
                          )}
                          </div>
                        </div>
                        <p className='text-xl'><strong>Rent due:</strong> ₹{assignedTenant.totalRent - assignedTenant.rentPaid}</p>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-semibold mb-5">Tenant Information</h2>
                      <div className='flex flex-row flex-wrap gap-8 items-center'>
                        <p className='text-xl'><strong>Tenant Name:</strong> {assignedTenant.tenantName}</p>
                        <p className='text-xl'><strong>Contact:</strong> {assignedTenant.tenantContact}</p>
                        <p className='text-xl'><strong>Start Date:</strong> {formatDate(assignedTenant.startDate)}</p>
                        <div className='relative flex flex-row items-center'>
                          <p className='text-xl me-4'><strong>End Date:</strong> {formatDate(assignedTenant.endDate)}</p>
                          {property.assignedTenant && (
                            <div className="relative">
                              {!extendingTenure && (
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                  onClick={() => setExtendingTenure(true)}
                                >
                                  Extend Tenure
                                </button>
                              )}

                              {extendingTenure && (
                                <div className="absolute z-10 -left-60 top-5 bg-white border border-gray-300 shadow-lg rounded p-4 mt-2 w-80">
                                  <h3 className="text-xl mb-4">Update Tenure and Rent:</h3>
                                  <div className="mb-4">
                                    <DatePicker
                                      selected={newEndDate}
                                      onChange={(date) => setNewEndDate(date)}
                                      placeholderText="MM/DD/YYYY"
                                      className="border p-2 w-full"
                                      required
                                    />
                                    {/* Display error below the field if there's an issue */}
                                    {endDateError && <p className="text-red-500 mt-1">{endDateError}</p>}
                                  </div>

                                  <div className="mb-4">
                                    <input
                                      type="number"
                                      value={newTotalRent}
                                      onChange={(e) => setNewTotalRent(e.target.value)}
                                      placeholder="Enter New Total Rent"
                                      className="border p-2 w-full"
                                      required
                                    />
                                    {/* Display error below the field if there's an issue */}
                                    {totalRentError && <p className="text-red-500 mt-1">{totalRentError}</p>}
                                  </div>
                                  <div className="mt-4 flex justify-between">
                                    <button
                                      onClick={handleTenureExtension}
                                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                      Update
                                    </button>
                                    <button
                                      onClick={() => setExtendingTenure(false)}
                                      className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>



     
      {/* {property.oldTenants && property.oldTenants.length > 0 && (
  <div className="container border shadow-xl bg-white mx-auto px-10 rounded-lg py-8 mt-8">
    <h2 className="text-5xl font-bold mb-4">Old Tenants</h2>
    <div className="flex flex-row flex-wrap gap-8">
      {property.oldTenants.map((tenant, index) => (
        <div key={tenant._id || index} className="w-[30%] bg-red-600 shadow-lg rounded-lg p-6">
          <h3 className="text-3xl font-bold mb-2">{tenant.tenantName}</h3>
          <p><strong>Contact:</strong> {tenant.tenantContact}</p>
          <p><strong>Start Date:</strong> {formatDate(tenant.startDate)}</p>
          <p><strong>End Date:</strong> {formatDate(tenant.endDate)}</p>
          <p><strong>Total Rent:</strong> ₹{tenant.totalRent}</p>
          <p><strong>Rent Paid:</strong> ₹{tenant.rentPaid}</p>
          <p><strong>Rent Due:</strong> ₹{tenant.totalRent - tenant.rentPaid}</p>

          {editingOldTenant === tenant._id ? (
            <div>
              <input
                type="number"
                placeholder="Enter new rent paid"
                value={newOldTenantRentPaid}
                onChange={(e) => setNewOldTenantRentPaid(e.target.value)}
                className="mt-2 mb-2 p-2 border rounded"
              />
              <button
                onClick={() => handleOldTenantRentUpdate(tenant._id)}
                className="bg-green-600 text-white py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingOldTenant(null)}
                className="bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingOldTenant(tenant._id)}
              className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
            >
              Edit Rent
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
)} */}
      {property.oldTenants && property.oldTenants.length > 0 && (
  <div className="container border shadow-xl bg-white mx-auto px-10 rounded-lg py-8 mt-8">
    <h2 className="text-5xl font-bold mb-4">Old Tenants</h2>
    <div className="flex flex-row flex-wrap gap-8">
      {property.oldTenants.map((tenant, index) => {
        const rentDue = tenant.totalRent - tenant.rentPaid > 0;

        return (
          <div
            key={tenant._id || index}
            className={`w-[30%] shadow-lg rounded-lg p-6 ${rentDue ? 'bg-red-600' : 'bg-green-600'}`}
          >
            <h3 className="text-3xl font-bold mb-2">{tenant.tenantName}</h3>
            <p><strong>Contact:</strong> {tenant.tenantContact}</p>
            <p><strong>Start Date:</strong> {formatDate(tenant.startDate)}</p>
            <p><strong>End Date:</strong> {formatDate(tenant.endDate)}</p>
            <p><strong>Total Rent:</strong> ₹{tenant.totalRent}</p>
            <p><strong>Rent Paid:</strong> ₹{tenant.rentPaid}</p>
            <p><strong>Rent Due:</strong> ₹{tenant.totalRent - tenant.rentPaid}</p>

            {editingOldTenant === tenant._id ? (
              <div>
                <input
                  type="number"
                  placeholder="Enter new rent paid"
                  value={newOldTenantRentPaid}
                  onChange={(e) => setNewOldTenantRentPaid(e.target.value)}
                  className="mt-2 mb-2 p-2 border rounded"
                />
                <button
                  onClick={() => handleOldTenantRentUpdate(tenant._id)}
                  className={`${rentDue ? 'bg-green-600' : 'bg-red-600'} text-white py-2 px-4 rounded mr-2`}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingOldTenant(null)}
                  className="bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingOldTenant(tenant._id)}
                className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
              >
                Edit Rent
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}


    </div>
  );

}

export default AssignedPropertyDetails;










import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { searchQuery } = location.state || { searchQuery: '' };
  const [searchResults, setSearchResults] = useState(null);
  const [openSections, setOpenSections] = useState({});

  // Mock data (replace with API call)
  const mockData = {
    Students: [
      { id: 148, name: 'Kalu David Emmanuel', username: 'student20121990', gender: 'Male', section: 'NURSERY', class: 'NJUR 2A' },
      { id: 185, name: 'Kalu David James', username: 'student50302820', gender: 'Male', section: 'PRE-PRIMARY', class: 'PPRI' }
    ],
    Instructors: [
      { id: 201, name: 'John Doe', username: 'teacher123', gender: 'Male', section: 'STAFF', class: '' }
    ],
    Courses: []
  };

  // Filter data based on searchQuery
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      const filteredResults = {};
      Object.keys(mockData).forEach(category => {
        const filteredItems = mockData[category].filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredItems.length > 0) {
          filteredResults[category] = filteredItems;
        }
      });
      if (Object.keys(filteredResults).length > 0) {
        setSearchResults(filteredResults);
        setOpenSections((prev) => ({
          ...prev,
          [Object.keys(filteredResults)[0]]: true // Open the first category with results
        }));
      } else {
        setSearchResults({}); // Empty object to trigger "No results found"
      }
    } else {
      setSearchResults(null);
    }
  }, [searchQuery]);

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="font-inter p-4">
      <h1 className="text-xl font-bold mb-4">Search result for "{searchQuery}"</h1>
      {searchResults && Object.keys(searchResults).length > 0 ? (
        <div className="space-y-2">
          {Object.entries(searchResults).map(([category, items]) => (
            <div key={category} className="border rounded-lg shadow">
              <button
                onClick={() => toggleSection(category)}
                className="w-full text-left p-4 font-semibold bg-gray-100 hover:bg-gray-200 focus:outline-none"
              >
                {category} ({items.length})
                <span className="float-right">
                  {openSections[category] ? '▲' : '▼'}
                </span>
              </button>
              {openSections[category] && items.length > 0 && (
                <div className="p-4 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Adm No.</th>
                        <th className="p-2 text-left">Fullname</th>
                        <th className="p-2 text-left">Username</th>
                        <th className="p-2 text-left">Gender</th>
                        <th className="p-2 text-left">Section</th>
                        <th className="p-2 text-left">Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.id}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2 text-gray-500">{item.username}</td>
                          <td className="p-2">{item.gender}</td>
                          <td className="p-2">{item.section}</td>
                          <td className="p-2">{item.class}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Showing 1 to {items.length} of {items.length} entries</span>
                    <div>
                      <button className="px-2 py-1 bg-gray-300 rounded">Previous</button>
                      <span className="px-2">1</span>
                      <button className="px-2 py-1 bg-gray-300 rounded">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
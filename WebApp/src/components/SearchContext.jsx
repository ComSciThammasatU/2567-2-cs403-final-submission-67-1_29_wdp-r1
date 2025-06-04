// import React, { createContext, useState, useEffect } from 'react';

// export const SearchContext = createContext();

// export const SearchProvider = ({ children }) => {
//     const [data, setData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredResults, setFilteredResults] = useState([]);

//     useEffect(() => {
//         const storedData = localStorage.getItem('RekogDataData');
//         if (storedData) {
//             setData(JSON.parse(storedData));
//         }
//     }, []);

//     useEffect(() => {
//     if (searchTerm) {
//         const results = data.filter(item => {
//         const flatValues = [];

//         // ดึงค่าจาก object ปกติ
//         Object.entries(item).forEach(([key, value]) => {
//             if (Array.isArray(value)) {
//             if (key === "Labels") {
//                 // ดึงเฉพาะ Name จาก Labels
//                 value.forEach(label => {
//                 if (label?.Name) flatValues.push(label.Name);
//                 if (label?.Confidence) flatValues.push(label.Confidence.toString());
//                 });
//             }
//             console.log("🔍 searching in item:", item);
//             } else {
//             flatValues.push(value);
//             }
//         });

//         return flatValues.some(val =>
//             val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         });

//         setFilteredResults(results);
//     } else {
//         setFilteredResults([]);
//     }
//     }, [searchTerm, data]);
   
//     return (
//         <SearchContext.Provider value={{ searchTerm, setSearchTerm, filteredResults }}>
//             {children}
//         </SearchContext.Provider>
//     );
// };


import React, { createContext, useEffect, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('RekogDataData');
    console.log("🧠 Rekog data loaded:", storedData);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  // 🔐 ฟังก์ชัน hash ด้วย SHA-256
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  useEffect(() => {
    const runSearch = async () => {
      if (!searchTerm) {
        setFilteredResults([]);
        return;
      }

      const lowerSearch = searchTerm.trim().toLowerCase();
      const hashValue = await sha256(lowerSearch);
      console.log("🔐 Calculated hash:", hashValue);

      const results = data.filter(item => {
        // 🔍 Search แบบเดิม
        const flatValues = [];

        Object.entries(item).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            if (key === 'Labels') {
              value.forEach(label => {
                if (label?.Name) flatValues.push(label.Name);
                if (label?.Confidence) flatValues.push(label.Confidence.toString());
              });
            }
            console.log("🔍 searching in item:", item);
          } else {
            flatValues.push(value);
          }
        });

        const matchesPlainText = flatValues.some(val =>
          val?.toString().toLowerCase().includes(lowerSearch)
        );

        // 🔐 หรือ match กับ hash
        const matchesHash = Array.isArray(item.Hashes) && item.Hashes.includes(hashValue);
        console.log("🔍 searching hash:", item.Hashes);
        console.log("🔍 searching hash item:", item);
        return matchesPlainText || matchesHash;
      });

      setFilteredResults(results);
    };

    runSearch();
  }, [searchTerm, data]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, filteredResults }}>
      {children}
    </SearchContext.Provider>
  );
};
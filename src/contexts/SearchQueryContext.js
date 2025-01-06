import React, { createContext, useState, useContext } from "react";

// Create the context
const SearchQueryContext = createContext();

// Provider component
export const SearchQueryProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSearchQuery = () => {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error("useSearchQuery must be used within a SearchQueryProvider");
  }
  return context;
};

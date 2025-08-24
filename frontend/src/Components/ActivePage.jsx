// import React, { createContext, useContext, useState } from "react";

// const ActivePageContext = createContext();

// export function ActivePageProvider({ children }) {
//   const [activePage, setActivePage] = useState("home");
//   const [loggedIn, setLoggedIn] = useState(false); // login state
//   const [role, setRole] = useState(null); // "Admin" or "Customer"

//   return (
//     <ActivePageContext.Provider
//       value={{
//         activePage,
//         setActivePage,
//         loggedIn,
//         setLoggedIn,
//         role,
//         setRole,
//       }}
//     >
//       {children}
//     </ActivePageContext.Provider>
//   );
// }

// export function useActivePage() {
//   return useContext(ActivePageContext);
// }

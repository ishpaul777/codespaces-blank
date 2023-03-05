import { createContext, useContext, useState } from "react";

let SidebarDataContext = createContext({});

export function useSidebarContext() {
  return useContext(SidebarDataContext);
}

export function SidebarContext({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  const [visible, setVisibility] = useState(true);

  const setActiveTabSetter = (data) => {
    setActiveTab(data);
  };

  const setSidebarVisibility = (isVisible) => {
    setVisibility(isVisible);
  };

  let value = { activeTab, setActiveTabSetter, visible, setSidebarVisibility };

  return (
    <SidebarDataContext.Provider value={value}>
      {children}
    </SidebarDataContext.Provider>
  );
}

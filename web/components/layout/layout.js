import { Sidebar } from "../Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-row h-screen w-full">
      <Sidebar />
      <div className="w-5/6">{children}</div>
    </div>
  );
}

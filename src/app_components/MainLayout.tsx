import { Outlet } from "react-router-dom"; // renders nested routes

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen text-foreground">
      <header className="flex items-center justify-between px-2 py-2 shadow-md bg-white">
        <h1 className="text-sm italic text-blue-800 font-bold">📚 Bookly</h1>
      </header>

      <main className="py-2">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

import "./App.css";
import { Button } from "./components/ui/button";

import { useQuery } from "@tanstack/react-query";

import { IBook } from "./interfaces/interface IBook";
import FetchData from "./app components/FetchData";

import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return <AppRoutes />;
};

// const App: React.FC = () => {
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold text-center mb-8">
//         <FetchData />
//       </h1>
//     </div>
//   );
// };

export default App;

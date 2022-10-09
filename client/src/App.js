import './App.css';
import { Route, Routes } from "react-router-dom";
import OrdersList from './components/OrdersList/OrdersList.jsx';

export default function App() {
  return (
    <Routes>
      <Route exact path="/" element={<OrdersList/>} />
    </Routes>
  );
}


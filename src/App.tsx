import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsTable from './components/ProductsTable';
import ProductDetailPage from './components/ProductDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsTable />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

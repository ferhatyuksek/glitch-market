import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsTable from './components/ProductsTable';
import ProductDetailPage from './components/ProductDetailPage';
import EditProductPage from './components/EditProductPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsTable />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id/edit" element={<EditProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Assets from './pages/Assets';
import Browse from './pages/Browse';
import SingleAsset from './pages/SingleAsset';
import NoPage from './pages/NoPage';
import './css/index.css';

export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='assets' element={<Assets />} />
          <Route path='browse' element={<Browse />} />
          <Route path='stocks/*' element={<SingleAsset />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
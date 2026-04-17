/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Compressor from './pages/Compressor';
import Converter from './pages/Converter';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="compress" element={<Compressor />} />
            <Route path="convert" element={<Converter />} />
            <Route path="convert/:conversionType" element={<Converter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

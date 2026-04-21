import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/common/ToastContainer';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRoutes />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;

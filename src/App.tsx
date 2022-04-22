import { ToastContainer } from 'react-toastify';
import './App.css';
import Swap from './pages/Swap';

function App() {

  return (
    <div className='App'>
      <Swap />
      <ToastContainer theme='dark' />
    </div>
  );
}

export default App;

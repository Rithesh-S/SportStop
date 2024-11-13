import { React, lazy, Suspense } from 'react'
import { Route, BrowserRouter, Routes, Navigate} from 'react-router-dom'
import Spinner from './utils/Spinner';
import MiddleWare from './utils/MiddleWare'
import './App.css'

import LandingPage from './components/LandingPage';
import Inventory from './components/Inventory';
import Store from './components/Store';
import Sales from './components/Sales';
import Checkout from './components/Checkout';
const Login = lazy(() => import('./components/Login'))
const Register = lazy(() => import('./components/Register'))
const Home = lazy(() => import('./components/Home'))

const Navigator = () => {
    return <Navigate to='./login'/>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Navigator/>}/>
        <Route path='/auth' element={<MiddleWare/>}/>
        <Route path='/login' element={<Suspense fallback={<Spinner/>}><Login/></Suspense>}/>
        <Route path='/register' element={<Suspense fallback={<Spinner/>}><Register/></Suspense>}/>
        <Route path='/home' element={<Suspense fallback={<Spinner/>}><Home page={<LandingPage/>}/></Suspense>}/> 
        <Route path='/home/inventory' element={<Suspense fallback={<Spinner/>}><Home page={<Inventory/>}/></Suspense>}/> 
        <Route path='/home/store' element={<Suspense fallback={<Spinner/>}><Home page={<Store/>}/></Suspense>}/> 
        <Route path='/home/sales' element={<Suspense fallback={<Spinner/>}><Home page={<Sales/>}/></Suspense>}/> 
        <Route path='/checkout' element={<Suspense fallback={<Spinner/>}><Checkout/></Suspense>}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
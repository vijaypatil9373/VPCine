import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/admin/Dashboard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import Theaters from './pages/Theaters';
import Releases from './pages/Releases';
import { Show, SignInButton } from '@clerk/react';
import { SignIn, SignUp } from '@clerk/react';

function ProtectedBookings() {
  return (
    <>
      <Show when="signed-in">
        <MyBookings />
      </Show>

      <Show when="signed-out">
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <h2>Please login to view your bookings</h2>

          <SignInButton mode="modal">
            <button className="login">Login</button>
          </SignInButton>
        </div>
      </Show>
    </>
  );
}

export default function App(){
  const {pathname}=useLocation(); const admin=pathname.startsWith('/admin');
  return <div className="app">{!admin&&<Navbar/>}<Routes>
    <Route path="/" element={<Home/>}/><Route path="/movies" element={<Movies/>}/>
    <Route path="/movies/:id" element={<MovieDetails/>}/><Route path="/movies/:id/:date" element={<SeatLayout/>}/>
    <Route path="/my-bookings" element={<ProtectedBookings />} /><Route path="/admin" element={<Dashboard/>}/>
    <Route path="/admin/add-shows" element={<AddShows/>}/><Route path="/admin/list-shows" element={<ListShows/>}/>
    <Route path="/admin/list-bookings" element={<ListBookings/>}/><Route path="*" element={<Home/>}/>
    <Route path="/theaters" element={<Theaters />} />
<Route path="/releases" element={<Releases />} />
    <Route
  path="/sign-in/*"
  element={
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <SignIn routing="path" path="/sign-in" />
    </div>
  }
/>

<Route
  path="/sign-up/*"
  element={
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <SignUp routing="path" path="/sign-up" />
    </div>
  }
/>
  </Routes>{!admin&&<Footer/>}</div>
}

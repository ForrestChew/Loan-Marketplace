import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './components/About';
import BrowseLoans from './components/BrowseLoans';
import NavBar from './components/NavBar';
import ProposeLoan from './components/ProposeLoan';
import Lend from './components/Lend';
import { useMoralis } from 'react-moralis';

function App() {
    return (
    <>
      <NavBar />
      <Routes>
          <Route path='/' element={ <About /> } />
          <Route path='/BrowseLoans' element={ <BrowseLoans /> } />
          <Route path='/ProposeLoan' element={ <ProposeLoan /> } />
          <Route path='/Lend' element={ <Lend /> } />
      </Routes>
    </>
  );
}

export default App;

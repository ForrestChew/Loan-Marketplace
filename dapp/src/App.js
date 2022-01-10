import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './components/About';
import BrowseLoans from './components/Loans/BrowseLoans';
import NavBar from './components/NavBar';
import ProposeLoan from './components/LoanProposals/ProposeLoan';
import UsersPositions from './components/UsersPositions/UsersPositions';

function App() {
    return (
    <>
      <NavBar />
      <Routes>
          <Route path='/' element={ <About /> } />
          <Route path='/BrowseLoans' element={ <BrowseLoans /> } />
          <Route path='/ProposeLoan' element={ <ProposeLoan /> } />
          <Route path='/UsersPositions' element={ <UsersPositions /> } />
      </Routes>
    </>
  );
}

export default App;

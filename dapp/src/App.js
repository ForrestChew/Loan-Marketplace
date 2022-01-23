import { Routes, Route } from 'react-router-dom';
import About from './components/About';
import BrowseLoans from './components/BrowseLoans/BrowseLoans';
import NavBar from './components/NavBar';
import ProposeLoan from './components/ProposeLoan';
import UsersPositions from './components/UsersPositions';
import BrowseFractionalLoans from './components/BrowseLoans/BrowseFractionalLoans';

function App() {
    return (
    <>
      <NavBar />
      <Routes>
          <Route path="/" element={ <About /> } />
          <Route path="/BrowseLoans" element={ <BrowseLoans /> } />
          <Route path="BrowseFractionalLoans" element={ <BrowseFractionalLoans /> } />
          <Route path="/ProposeLoan" element={ <ProposeLoan /> } />
          <Route path="/UsersPositions" element={ <UsersPositions /> } />
      </Routes>
    </>
  );
}

export default App;

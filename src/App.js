import { Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<ProposeLoan />} />
        <Route path="/browse-loans" element={<BrowseLoans />} />
        <Route
          path="/browse-fractional-loans"
          element={<BrowseFractionalLoans />}
        />
        <Route path="/users-positions" element={<UsersPositions />} />
      </Routes>
    </>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './NavBar';
import About from './About';
import BrowseLoans from './BrowseLoans';
import ProposeLoan from './ProposeLoan';

const ReactRouterMain = () => {
    return (
        <Router>
            <NavBar />
                <Route exact path='/about'>
                    <About />
                </Route>
                <Route exact path='/browseloans'>
                    <BrowseLoans />
                </Route>
                <Route path='/proposeloan'>
                    <ProposeLoan />
                </Route>
        </Router>
    )
}

export default ReactRouterMain

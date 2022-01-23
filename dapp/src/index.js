import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';

const appId = process.env.REACT_APP_APP_ID;
const serverUrl = process.env.REACT_APP_SERVER_URL;


ReactDOM.render(
  <StrictMode>
      <MoralisProvider appId={appId} serverUrl={serverUrl}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </MoralisProvider>
  </StrictMode>,
  document.getElementById('root')
);


import React from 'react';
import ReactDOM from 'react-dom';
import { MoralisProvider } from 'react-moralis';
import './index.css';
import App from './App';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const appId = process.env.REACT_APP_APP_ID;



ReactDOM.render(
  <React.StrictMode>
      <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <App />
      </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


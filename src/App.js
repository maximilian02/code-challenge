import React, { useState } from 'react';
import './App.css';
import Loader from './components/Loader';

// 1Dorian4RoXcnBv9hnQ4Y2C1an6NJ4UrjX
// a95c92ddafe6c2fbd4d81b55839c55bf5e8d046809b9f79781a2d08662c0b5f4

// bc1qwyucveshg6fu9fuyzt0jknn03f3epu2exc7ccp

function App() {
  const [pristine, setPristine] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(-1);
  const [hash, setHash] = useState('');
  const [response, setResponse] = useState(null);

  const mapTypes = {
    0: {
      link: `https://blockchain.info/rawaddr/${hash}`
    },
    1: {
      link: `https://blockchain.info/rawtx/${hash}`
    }
  }

  const executeSearch = () => {
    setIsLoading(true);
    const url = mapTypes[type] ? mapTypes[type]?.link : null;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        setHash('');
        setIsLoading(false);
        setResponse({...res});
        setPristine(false)
      });
  };

  const changeTypeHandler = e => setType(parseInt(e.target.value));
  const changeHashHandler = e => setHash(e.target.value);
  const buttonDisabled = hash.length === 0 || type === -1;
  const getOutput = arr => arr.reduce((acc, obj) => {
    return acc + obj.value;
  }, 0);
  const getInputs = arr => arr.reduce((acc, obj) => {
    return acc + obj.prev_out.value;
  }, 0);

  return (
    <div className="App">
      <div className="App-header">
        <h3>Code Challenge.</h3>
        <hr />

        <label htmlFor="search-type">Search by</label>
        <select id="search-type" value={type} onChange={changeTypeHandler}>
          <option value="-1">None</option>
          <option value="0">Address</option>
          <option value="1">Transaction</option>
        </select>
        <br />
        <br />
        <label htmlFor="hash">Hash</label>
        <input placeholder="1Thfjdhn4RoXcnBv9hnQ4Y2C1an6NJ4UrjX" onChange={changeHashHandler} id="hash" value={hash}/>
        <br />

        <div className="App-search">
          <main>
            <button disabled={buttonDisabled} onClick={executeSearch}><span>Search</span></button>
          </main>
        </div>
      </div>
      <hr />
      <div className="App-results">
        {isLoading && <Loader />}
        {!!response && type === 0 ? (
          <div className="App-responses">
            <p>Address search: <b>{response.address}</b></p>
            {!pristine && (
              <span>
                <p>Number of confirmed transactions: <b>{response.n_tx}</b></p>
                <p>Total BTC received: <b>{response.total_received}</b></p>
                <p>Total BTC spent: <b>{response.total_sent}</b></p>
                <p>Total BTC unspent: <b>{(response.total_received - response.total_sent)}</b></p>
                <p>Current address balance: <b>{response.final_balance}</b></p>
              </span>
            )}
          </div>
        ) : (<div></div>)}
        {!!response && type === 1 ? (
          <div className="App-responses">
            <p>Transaction hash: <b>{response.hash}</b></p>
            {!pristine && (
              <span>
                <p>Received time: <b>{response.time}</b></p>
                <p>Status: <b>{response.total_received}</b></p>
                <p>Size (in bytes): <b>{response.size}</b></p>
                <p>Total BTC input: <b>{getInputs(response.inputs)}</b></p>
                <p>Total BTC output: <b>{getOutput(response.out)}</b></p>
                <p>Total fees: <b>{response.fee}</b></p>
              </span>
            )}
          </div>
        ) : (<div></div>)}
      </div>
      <footer>
        <div className="App-footer">
          <p>
            Code challenge written by Max Zelarayán (<a href="https://github.com/maximilian02/" className="App-link">@maximilian02</a>)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

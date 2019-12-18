import React from "react";
import * as timeago from "timeago.js";
import "./App.css";

function useFetch(url) {
  const [state, setState] = React.useState(undefined);

  if (!state) {
    fetch(url)
      .then(resp => resp.json())
      .then(setState)
      .catch(e => {
        console.error(e);
        setState(undefined);
      });
  }

  return state || [];
}

function lastWatered(list) {
  if (!list || list.length === 0) {
    return undefined;
  }

  const { time } = list.reduce((latest, current) =>
    latest.time > current.time ? latest : current
  );

  return time;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = `${date.getDay()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

function formatDateAndTime(timestamp) {
  const date = new Date(timestamp);
  const hh = `${date.getHours()}`.padStart(2, "0");
  const mm = `${date.getMinutes()}`.padStart(2, "0");

  return `${formatDate(timestamp)} ${hh}:${mm}`;
}

function todayCount(list) {
  const today = formatDate();

  return list.filter(timestamp => formatDate(timestamp) === today).length;
}

function lastFirst(a, b) {
  return b.time - a.time;
}

function App() {
  const results = useFetch("/logs");
  const today = todayCount(results);
  const last = lastWatered(results);

  return (
    <div className="App">
      <header>
        <p>Have you watered the plants today?</p>
        {today === 0 && <h1>No.</h1>}
        {today === 1 && <h1>Yes.</h1>}
        {today > 1 && <h1>Yes! {today} times</h1>}
        {last && (
          <h2>
            You watered the plants {timeago.format(last)} (
            {formatDateAndTime(last)})
          </h2>
        )}
      </header>
      {results.length > 0 && (
        <main>
          <h2>Logs</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {results.sort(lastFirst).map(({ _id, time, msg }) => (
                <tr key={_id}>
                  <td>{_id}</td>
                  <td>{formatDateAndTime(time)}</td>
                  <td>{msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </div>
  );
}

export default App;

import { hot } from "react-hot-loader/root";
import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { HelloWorld } from "./pages/HelloWorld";

const App = (): JSX.Element => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/about">
          <Suspense fallback={<div>Loading</div>}>
            <HelloWorld />
          </Suspense>
        </Route>
      </Switch>
    </div>
  </Router>
);

export default hot(App);

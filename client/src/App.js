import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.scss";

import { AuthProvider } from "./context/auth";
import { AuthRoute, AuthRouteLoggedIn } from "./util/AuthRoute";

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BingoView from "./pages/BingoView";
import AddBingo from "./pages/AddBingo";
import MatchView from "./pages/MatchView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <AuthRouteLoggedIn exact path="/addBingo" component={AddBingo} />
          {/*Change to player-token-allow not AuthRouteLoggedIn */}
          <AuthRouteLoggedIn
            exact
            path="/match/:bingoId"
            component={MatchView}
          />
          <Route exact path="/bingos/:bingoId" component={BingoView} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;

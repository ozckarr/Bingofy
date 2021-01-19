import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { PlayerContext } from "../context/playerAuth";

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  const { player } = useContext(PlayerContext);

  //TODO Gör till en hel if-sats
  return !player ? (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  ) : (
    <Redirect to={`/match/${player.bingoId}`} />
  );
}

function AuthRouteLoggedIn({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  const { player } = useContext(PlayerContext);

  return !player ? (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  ) : (
    <Redirect to={`/match/${player.bingoId}`} />
  );
}

export { AuthRoute, AuthRouteLoggedIn };

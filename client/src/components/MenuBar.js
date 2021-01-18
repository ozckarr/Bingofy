import React, { useContext, useState } from "react";
import { Menu, Confirm } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { PlayerContext } from "../context/playerAuth";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const { player, leave } = useContext(PlayerContext);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  let MenuBar;
  if (player) {
    MenuBar = (
      <Menu secondary size="massive" color="orange">
        <Menu.Menu position="right">
          <Menu.Item icon="x" onClick={() => setConfirmOpen(true)} active />
        </Menu.Menu>
        <Confirm
          open={confirmOpen}
          content="Är du säker? Du kommer inte kunna att fortsätta med denna bricka."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={leave}
        />
      </Menu>
    );
  } else if (user) {
    MenuBar = (
      <Menu pointing secondary size="massive" color="orange">
        <Menu.Item name={user.username} active as={Link} to="/" />

        <Menu.Menu position="right">
          <Menu.Item
            icon="plus square outline"
            active={activeItem === "addBingo"}
            onClick={handleItemClick}
            as={Link}
            to="/addBingo"
          />
          <Menu.Item name="logout" onClick={logout} />
        </Menu.Menu>
      </Menu>
    );
  } else {
    <Menu pointing secondary size="massive" color="orange">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>;
  }
  return MenuBar;
}

export default MenuBar;

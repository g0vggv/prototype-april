import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';

// tslint:disable-next-line:no-any
class Header extends React.PureComponent<RouteComponentProps<any>> {
  render() {
    const { location } = this.props;

    return (
      <Menu fixed="top">
        <Menu.Item
          as={Link}
          to="/"
          name="main"
          active={location.pathname === '/'}
        >
          sense.tw
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/counter"
          name="counter"
          active={location.pathname === '/counter'}
        >
          counter
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/components"
          name="components"
          active={location.pathname === '/components'}
        >
          components
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/map"
          name="map"
          active={location.pathname === '/map'}
        >
          map
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Header);
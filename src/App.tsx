import React, { Component } from 'react';
import 'rsuite/lib/styles/index.less';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import KAIHeader from './common/components/Header';
import Home from './pages/Home';
import TxDetail from './pages/TxDetail';
import Network from './pages/Network';
import { Container, Header, Content, Footer } from 'rsuite';

  class App extends Component {
    render() {
      return (
        <Router>
          <Container>
            <Header>
              <KAIHeader />
            </Header>
            <Content>
              <Switch>
                <Route path="/network">
                  <Network />
                </Route>
                <Route path="/tx">
                  <TxDetail />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Content>
            <Footer>Footer</Footer>
          </Container>
        </Router>
      );
    }
  }

  export default App;
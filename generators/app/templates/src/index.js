import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Switch,
} from 'react-router-dom';<% if (program === 'labs') { %>

import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import 'antd/dist/antd.less';<% } %>

import { NotFoundPage } from './components/pages/NotFound';
import { ExampleListPage } from './components/pages/ExampleList';<% if (program === 'bw') { %>
import { LandingPage } from './components/pages/Landing';<% } else { %>
import { HomePage } from './components/pages/Home';
import { ProfileListPage } from './components/pages/ProfileList';
import { LoginPage } from './components/pages/Login';<% if (hasDS) { %>
import { ExampleDataViz } from './components/pages/ExampleDataViz';<% } %>
import { config } from './utils/oktaConfig';<% } %>
import { LoadingComponent } from './components/common';

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById('root')
);

function App() {
  // The reason to declare App this way is so that we can use any helper functions we'd need for business logic, in our case auth.
  // React Router has a nifty useHistory hook we can use at this level to ensure we have security around our routes.
  const history = useHistory();<% if (program === 'labs') { %>

  const authHandler = () => {
    // We pass this to our <Security /> component that wraps our routes.
    // It'll automatically check if userToken is available and push back to login if not :)
    history.push('/login');
  };<% } %>

  return (
    <% if (program === 'labs') { %>
    <Security {...config} onAuthRequired={authHandler}>
    <%}%><Switch><% if (program === 'labs') { %>
      <Route path="/login" component={LoginPage} />
      <Route path="/implicit/callback" component={LoginCallback} /><% } else { %>
      <Route path="/landing" component={LandingPage} /><% } %>
      {/* any of the routes you need secured should be registered as SecureRoutes */}
      <<%= (program === 'labs') ? 'SecureRoute' : 'Route' ;%>
        path="/"
        exact
        component={() => <<%= (program === 'labs') ? 'HomePage LoadingComponent={LoadingComponent}' : 'LandingPage';%> />}
      />
      <<%= (program === 'labs') ? 'SecureRoute' : 'Route' ;%> path="/example-list" component={ExampleListPage} />
      <% if (program === 'labs') { %>
      <SecureRoute path="/profile-list" component={ProfileListPage} /><% } %>
      <% if (hasDS) { %><SecureRoute path="/datavis" component={ExampleDataViz} /><% } %>
      <Route component={NotFoundPage} />
    </Switch>
    <% if (program === 'labs') { %></Security><%}%>
  );
}

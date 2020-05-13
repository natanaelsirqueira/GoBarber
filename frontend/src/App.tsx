import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AppProvider from './hooks';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <>
    <AppProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </BrowserRouter>
    </AppProvider>

    <GlobalStyle />
  </>
);

export default App;

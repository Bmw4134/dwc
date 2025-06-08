import React from 'react';
import { Route, Switch } from 'wouter';
import DWCApp from '../pages/dwc/DWCApp';
import TraxovoDashboard from '../pages/traxovo/TraxovoDashboard';
import JDDMain from '../pages/jdd/JDDMain';
import DWAIHub from '../pages/dwai/DWAIHub';
import DWCLanding from '../pages/dwc-landing';
import DWCLogin from '../pages/dwc-login';
import QuantumTestingPage from '../pages/QuantumTestingPage';

const GlobalRouter = () => {
  return (
    <Switch>
      <Route path="/" component={DWCLanding} />
      <Route path="/login" component={DWCLogin} />
      <Route path="/dwc" component={DWCApp} />
      <Route path="/traxovo" component={TraxovoDashboard} />
      <Route path="/jdd" component={JDDMain} />
      <Route path="/dwai" component={DWAIHub} />
      <Route path="/quantum-testing" component={QuantumTestingPage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
            <p className="text-gray-300">The requested module could not be found.</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
};

export default GlobalRouter;
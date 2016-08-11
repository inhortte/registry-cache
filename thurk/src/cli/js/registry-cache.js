import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import registryApp from './reducers';
import VHead from './containers/VHead';
import Thorax from './components/Thorax';
import Abdomen from './components/Abdomen';

const store = createStore(registryApp, applyMiddleware(thunk));

class RegistryCache extends React.Component {
  componentDidMount() {
    let dispatch = this.props.dispatch;
  }
  render() {
    return (
      <div>
        <VHead />
        <Thorax />
        <Abdomen />
      </div>
    );
  }
}

render (
  <Provider store={store}>
    <RegistryCache />
  </Provider>,
  document.getElementById('registry-cache-container')
);

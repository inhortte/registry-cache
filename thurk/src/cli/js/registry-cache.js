import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import registryApp from './reducers';
import VHead from './containers/VHead';
import VThorax from './containers/VThorax';
import Abdomen from './components/Abdomen';
import { Row, Col } from 'react-bootstrap';

const store = createStore(registryApp, applyMiddleware(thunk));

class RegistryCache extends React.Component {
  componentDidMount() {
    let dispatch = this.props.dispatch;
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={12} sm={10} md={8} smPush={1} mdPush={2}>
            <VHead />
            <VThorax />
            <Abdomen />
          </Col>
        </Row>
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

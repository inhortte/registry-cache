import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import registryApp from './reducers';
import VHead from './containers/VHead';
import VThorax from './containers/VThorax';
import Abdomen from './components/Abdomen';
import { Row, Col } from 'react-bootstrap';
import { queryThunk } from './actions';

const store = createStore(registryApp, applyMiddleware(thunk));

class RegistryCache extends React.Component {
  componentDidMount() {
    this.props.dispatch(queryThunk);
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
const VRegistryCache = connect()(RegistryCache);

render (
  <Provider store={store}>
    <VRegistryCache />
  </Provider>,
  document.getElementById('registry-cache-container')
);

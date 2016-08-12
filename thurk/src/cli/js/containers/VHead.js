import { connect } from 'react-redux';
import Head from '../components/Head';
import { localServer } from '../config';

const mapStateToProps = (state) => {
  return {
    serverName: localServer.serverName
  };
};

const VHead = connect(
  mapStateToProps
)(Head);

export default VHead;

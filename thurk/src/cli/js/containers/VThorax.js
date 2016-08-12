import { connect } from 'react-redux';
import Thorax from '../components/Thorax';
import { queryThunk } from '../actions';
import { localServer } from '../config';

const mapStateToProps = (state) => {
  return {
    serverName: localServer.serverName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getImages: () => dispatch(queryThunk)
  };
};

const VThorax = connect(
  mapStateToProps,
  mapDispatchToProps
)(Thorax);

export default VThorax;

import R from 'ramda';
import { connect } from 'react-redux';
import Thorax from '../components/Thorax';
import { queryThunk } from '../actions';
import { localServer } from '../config';

const mapStateToProps = (state) => {
  let imageMap = state.images.images;

  return {
    serverName: localServer.serverName,
    images: state.images.images
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

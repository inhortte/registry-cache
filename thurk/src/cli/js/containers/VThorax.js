import R from 'ramda';
import { connect } from 'react-redux';
import Thorax from '../components/Thorax';
import { queryThunk } from '../actions';
import { localServer } from '../config';

/*
 * imageArray becomes:
 * [ [ imageName, imageTag, imageStats ], ... ]
 */
const mapStateToProps = (state) => {
  let imageMap = state.images.images;
  let imageArray = R.reduce(R.concat, [],
                            R.map(iName => R.map(tName => new Array(iName, tName, imageMap[iName][tName]),
                                                 R.keys(imageMap[iName])),
                                  R.keys(imageMap)));
  return {
    serverName: localServer.serverName,
    imageArray: imageArray
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

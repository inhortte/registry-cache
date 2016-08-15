import { queryServer, deleteImage } from '../external';

export const setImages = (images) => {
  return { type: 'SET_IMAGES', images };
};
export const queryThunk = (dispatch, getState) => {
  console.log(`started queryThunk`);
  queryServer().then(res => {
    dispatch(setImages(res.images));
  }).catch(err => {
    if(err) throw err;
  });
};

export const imageDeleted = (iName, tName, status = true) => {
  return { type: 'IMAGE_DELETED', iName, tName, status };
};
export const deleteThunk = (iName, tName) => (dispatch, getState) => {
  deleteImage(iName, tName).then(res => {
    if(res) {
      dispatch(imageDeleted(iName, tName));
      dispatch(queryThunk);
    } else {
      dispatch(imageDeleted(iName, tName, false));
    }
  }).catch(err => {
    console.log(`deletion error: ${err}`);
    dispatch(imageDeleted(iName, tName, false));
  });
};

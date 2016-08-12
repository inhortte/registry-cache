import { queryServer } from '../external';

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

export const delImage = () => {
};

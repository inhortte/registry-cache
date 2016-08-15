const initialState = {
  images: {}
};

const images = (state = initialState, action) => {
  switch(action.type) {
  case 'SET_IMAGES':
    return Object.assign({}, state, { images: action.images });
  case 'IMAGE_DELETED':

  default:
    return state;
  };
};

export default images;

import React, { PropTypes } from 'react';
import { PageHeader } from 'react-bootstrap';

const Head = ({ serverName }) => {
  return (
    <PageHeader>Welcome to your very own registry on {serverName}</PageHeader>
  );
};

Head.propTypes = {
};

export default Head;

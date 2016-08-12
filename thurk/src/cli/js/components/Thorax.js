import React, { PropTypes } from 'react';
import { Table, Button } from 'react-bootstrap';

const Thorax = ({ serverName, getImages }) => {
  return (
    <div>
      <Button onClick={getImages} bsStyle={'danger'}>
        Death!
      </Button>
      <Table responsive bordered hover striped>
        <thead>
          <tr>
            <th>Image</th>
            <th>Tag</th>
            <th>Size</th>
            <th>Pulls</th>
            <th>Pushes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>fortune-whalesay</td>
            <td>thurk</td>
            <td>09380</td>
            <td>3</td>
            <td>2</td>
            <td>X</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

Thorax.propTypes = {
};

export default Thorax;

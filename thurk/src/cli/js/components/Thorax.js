import React, { PropTypes } from 'react';
import { Table, Button } from 'react-bootstrap';

const Thorax = ({ serverName, getImages, imageArray }) => {
  let imageRows = imageArray.map(iRow => {
    let key = `${iRow[0]}:${iRow[1]}`;
    return (
      <tr key={key}>
        <td>{iRow[0]}</td>
        <td>{iRow[1]}</td>
        <td>{iRow[2]['size']}</td>
        <td>{iRow[2]['pulls'] || 'none'}</td>
        <td>{iRow[2]['pushes'] || 'none'}</td>
        <td>X</td>
      </tr>
    );
  });
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
          {imageRows}
        </tbody>
      </Table>
    </div>
  );
};

Thorax.propTypes = {
};

export default Thorax;

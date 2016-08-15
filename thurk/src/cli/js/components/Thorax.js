import React, { PropTypes } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';

const Thorax = ({ serverName, getImages, imageArray, delImage }) => {
  let imageRows = imageArray.map(iRow => {
    /*
     * iRow[0] -> image name
     * iRow[1] -> tag name
     */
    let key = `${iRow[0]}:${iRow[1]}`;
    return (
      <tr key={key}>
        <td>{iRow[0]}</td>
        <td>{iRow[1]}</td>
        <td>{iRow[2]['size']}</td>
        <td>{iRow[2]['pulls'] || 'none'}</td>
        <td>{iRow[2]['pushes'] || 'none'}</td>
        <td><a href="#" onClick={() => delImage(iRow[0], iRow[1])}>X</a></td>
      </tr>
    );
  });
  return (
    <div>
      <Row>
        <Col smPush={11} sm={1}>
          <Button onClick={getImages} bsStyle={'danger'}>
            Refresh!
          </Button>
        </Col>
      </Row>
      <Row>
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
      </Row>
    </div>
  );
};

Thorax.propTypes = {
};

export default Thorax;

import React from 'react';

import Table from 'react-bootstrap/lib/Table'

export default class PdfPageView extends React.Component {

    static propTypes = {
        pdfPage: React.PropTypes.object.isRequired,
    };

    render() {
        const header = "Page " + (this.props.pdfPage.index + 1);
        return (
            <div>
              <h2>{ header }</h2>
              <Table responsive>
                <thead>
                  <tr>
                    <th>
                      #
                    </th>
                    <th>
                      Text
                    </th>
                    <th>
                      X
                    </th>
                    <th>
                      Y
                    </th>
                    <th>
                      Width
                    </th>
                    <th>
                      Height
                    </th>
                  </tr>
                </thead>
                <tbody>
                  { this.props.pdfPage.textItems.map((textItem, i) => <tr key={ i }>
                                                                        <td>
                                                                          { i }
                                                                        </td>
                                                                        <td>
                                                                          { textItem.text }
                                                                        </td>
                                                                        <td>
                                                                          { textItem.x }
                                                                        </td>
                                                                        <td>
                                                                          { textItem.y }
                                                                        </td>
                                                                        <td>
                                                                          { textItem.width }
                                                                        </td>
                                                                        <td>
                                                                          { textItem.height }
                                                                        </td>
                                                                      </tr>
                    ) }
                </tbody>
              </Table>
            </div>
            );
    }
}
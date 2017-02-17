import React from 'react';

import Table from 'react-bootstrap/lib/Table'

// Displays an array of TextItem as a table
export default class TextItemTable extends React.Component {

    static propTypes = {
        textItems: React.PropTypes.array.isRequired,
        showWhitespaces: React.PropTypes.bool
    };

    render() {
        const {showWhitespaces, textItems} = this.props;
        const tableHeader = <thead>
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
                                <th>
                                  Font
                                  <br/>(asc/desc)
                                </th>
                              </tr>
                            </thead>

        const textItemRows = textItems.map((textItem, i) => <tr key={ i } style={ textItem.annotation ? {
                          color: textItem.annotation.color
                      } : null }>
                                                              <td>
                                                                <div style={ { textAlign: 'center' } }>
                                                                  { i }
                                                                </div>
                                                                <div style={ { textAlign: 'center' } }>
                                                                  { textItem.annotation ? textItem.annotation.category : '' }
                                                                </div>
                                                              </td>
                                                              <td>
                                                                { showWhitespaces ? (
                                                                  <pre style={ textItem.annotation ? {
                                                                                   color: textItem.annotation.color,
                                                                                   display: 'inline-block',
                                                                               } : {
                                                                                   display: 'inline-block'
                                                                               } }>{ textItem.text }</pre>
                                                                  ) : (textItem.text) }
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
                                                              <td>
                                                                { textItem.font }
                                                                <br/>
                                                                { textItem.fontAscent + ' / ' + textItem.fontDescent }
                                                              </td>
                                                            </tr>
        )

        return (
            <Table responsive>
              { tableHeader }
              <tbody>
                { textItemRows }
              </tbody>
            </Table>
            );
    }
}
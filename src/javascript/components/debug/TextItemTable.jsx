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
                                                                <div style={ { textAlign: 'center', color: 'brown' } }>
                                                                  { textItem.type ? textItem.type.name : '' }
                                                                </div>
                                                                <div style={ { textAlign: 'center', color: 'orange' } }>
                                                                  { textItem.parsedElements && textItem.parsedElements.footnoteLinks.length > 0 ? 'Footnote-Link' : '' }
                                                                  { textItem.parsedElements && textItem.parsedElements.containLinks ? 'Link' : '' }
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
                                                              </td>
                                                            </tr>
        )

        return (
            <Table responsive condensed bordered>
              { tableHeader }
              <tbody>
                { textItemRows }
              </tbody>
            </Table>
        );
    }
}
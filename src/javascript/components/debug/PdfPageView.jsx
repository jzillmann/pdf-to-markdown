import React from 'react';

import Table from 'react-bootstrap/lib/Table'

export default class PdfPageView extends React.Component {

    static propTypes = {
        pdfPage: React.PropTypes.object.isRequired,
        modificationsOnly: React.PropTypes.bool.isRequired,
    };

    render() {
        const header = "Page " + (this.props.pdfPage.index + 1);
        var textItems = this.props.pdfPage.textItems;
        var content = <div/>
        if (this.props.modificationsOnly) {
            textItems = textItems.filter(item => item.annotation);
        }

        if (!this.props.modificationsOnly || textItems.length > 0) {
            content = <div>
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
                              <th>
                                Font
                                <br/>(asc/desc)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            { textItems.map((textItem, i) => <tr key={ i } style={ textItem.annotation ? {
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
                                                                 <pre style={ textItem.annotation ? {
                                                                                  color: textItem.annotation.color,
                                                                                  display: 'inline-block',
                                                                              } : {
                                                                                  display: 'inline-block'
                                                                              } }>{ textItem.text }</pre>
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
                              ) }
                          </tbody>
                        </Table>
                      </div>
        }
        return (
            content
            );
    }
}
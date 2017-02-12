import React from 'react';

import Table from 'react-bootstrap/lib/Table'

export default class BlockPageView extends React.Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired,
    };

    render() {
        var blocks = this.props.page.blocks;

        const content = <div>
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>
                                  #
                                </th>
                                <th>
                                  Category
                                </th>
                                <th>
                                  Text
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              { blocks.map((block, i) => <tr key={ i }>
                                                           <td>
                                                             { i }
                                                           </td>
                                                           <td>
                                                             { block.category }
                                                           </td>
                                                           <td>
                                                             <pre style={ { display: 'inline-block' } }>{ block.text }</pre>
                                                           </td>
                                                         </tr>
                                ) }
                            </tbody>
                          </Table>
                        </div>
        return (
            content
            );
    }
}
import React from 'react';
import Remarkable from 'remarkable';

export default class MarkdownPageView extends React.Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired,
    };

    render() {
        const remarkable = new Remarkable({
            breaks: true
        });

        const html = remarkable.render(this.props.page.text);
        return (
            <div>
              <div dangerouslySetInnerHTML={ { __html: html } } />
            </div>
            );
    }

}
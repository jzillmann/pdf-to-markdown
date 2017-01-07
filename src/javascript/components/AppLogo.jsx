import React from 'react';
import FaFilePdfO from 'react-icons/lib/fa/file-pdf-o'

export default class AppLogo extends React.Component {

    static propTypes = {
        onClick: React.PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick(e);
    }



    render() {
        return (
            <a href="" onClick={ this.handleClick }>
              <FaFilePdfO/> PDF To Markdown Converter</a>
            );
    }
}

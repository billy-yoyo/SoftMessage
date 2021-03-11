import * as React from 'react';
import './messageBox.less';

interface MessageBoxProps {

}

export default ({ }: MessageBoxProps): JSX.Element => {

    return (
        <input type="text" className="message-box"/>
    )
};

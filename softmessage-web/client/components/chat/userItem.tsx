import * as React from 'react';
import ClientUser from '../../models/clientUser';
import './userItem.less';

interface UserItemProps {
    user: ClientUser;
}

export default ({ user }: UserItemProps): JSX.Element => {

    return (
        <div className="user-item">
            <div className={'user-bubble ' + (user.isOnline ? ' online' : ' offline')}></div>
            <div className="user-name">
                { user.name }
            </div>
        </div>
    )
};

import * as React from 'react';
import { User } from '../../../common/models/User';
import './userItem.less';

interface UserItemProps {
    user: User;
}

export default ({ user }: UserItemProps): JSX.Element => {

    return (
        <div className="user-item">
            { user.name }
        </div>
    )
};

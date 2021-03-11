import * as React from 'react';
import { User } from '../../../common/models/User';
import './userList.less';
import UserItem from './userItem';

interface UserListProps {
    users: User[];
}

export default ({ users }: UserListProps): JSX.Element => {

    return (
        <div className="user-list">
            {
                users.map(user => <UserItem user={user} key={user.id}/>)
            }
        </div>
    )
};

import * as React from 'react';
import './userList.less';
import UserItem from './userItem';
import ClientUser from '../../models/clientUser';

interface UserListProps {
    users: ClientUser[];
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

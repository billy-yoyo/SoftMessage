import * as React from 'react';
import './login.less';
import { Page } from './wrapper';

interface LoginProps {
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

export default ({ pageData, setPage }: LoginProps) => {

    return (
        <div>Login</div>
    )
};
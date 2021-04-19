import * as React from 'react';
import './wrapper.less';
import Chat from './chat';
import Login from './login';
import T, { ModelType } from 'tsplate';
import useLocalStorage from '../util/useLocalStorage';

const TPage = T.Enum('chat', 'login');
export type Page = ModelType<typeof TPage>;

interface PageComponentProps {
    page: Page;
    setPage: (page: Page) => void;
}

const PageComponent = ({ page, setPage }: PageComponentProps) => {
    if (page === 'chat') {
        return <Chat setPage={setPage}/>
    } else if (page === 'login') {
        return <Login setPage={setPage}/>
    } else {
        setPage('login');
        return <div>Unknown page {page}</div>
    }
}

export default (): JSX.Element => {
    const [page, setPage] = useLocalStorage('page', TPage, 'login');

    return (
        <div className="wrapper">
            <PageComponent page={page} setPage={setPage}/>
        </div>
    )
};
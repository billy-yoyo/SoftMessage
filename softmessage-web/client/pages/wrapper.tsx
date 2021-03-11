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
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

const PageComponent = ({ page, pageData, setPage }: PageComponentProps) => {
    if (page === 'chat') {
        return <Chat setPage={setPage} pageData={pageData}/>
    } else if (page === 'login') {
        return <Login setPage={setPage} pageData={pageData}/>
    } else {
        setPage('login');
        return <div>Unknown page {page}</div>
    }
}

export default (): JSX.Element => {
    const [page, setPage] = useLocalStorage('page', TPage, 'login');
    const [pageData, setPageData] = React.useState();

    const wrappedSetPage = (newPage: Page, newPageData?: any) => {
        setPage(newPage);
        setPageData(newPageData);
    };

    return (
        <div className="wrapper">
            <PageComponent page={page} pageData={pageData} setPage={wrappedSetPage}/>
        </div>
    )
};
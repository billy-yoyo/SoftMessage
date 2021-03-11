import * as React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './pages/wrapper';

const App = (): JSX.Element => {
    return (
        <Wrapper />
    )
};

ReactDOM.render(
    App(),
    document.getElementById('app')
);

import * as React from 'react';
import './login.less';
import { Page } from './wrapper';
import Textbox from '../components/login/textbox';
import Button from '../components/login/button';
import * as networkService from '../service/networkService';
import cache from '../cache/clientCache';
import { Token } from '../../common/models/token';
import websocketService from '../service/websocketService';

interface LoginProps {
    setPage: (page: Page) => void;
}

const validateUsername = (username: string): string => {
    if (username && username.length > 20) {
        return 'Username cannot be longer than 20 characters';
    }

    return undefined;
};

const validatePassword = (password: string): string => {
    if (password && password.length > 1000) {
        return 'Password cannot be longer than 1000 characters';
    }
    
    return undefined;
};

export default ({ setPage }: LoginProps) => {
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [repeatPassword, setRepeatPassword] = React.useState<string>('');
    const [signingUp, setSigningUp] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>(undefined);
    const [busy, setBusy] = React.useState<boolean>();

    const onLogIn = async (response: networkService.Response<Token>) => {
        setBusy(false);
        if (response.error) {
            setError(response.error.message);
        } else {
            cache.setToken(response.data.token);

            const userId = response.data.userId;
            const userResponse = await networkService.getUser(userId);

            if (userResponse.error) {
                cache.setToken(undefined);
                setError(response.error.message);
            } else {
                cache.setMe(userResponse.data);
                setPage('chat');
            }
        }
    };

    const logIn = async () => {
        setBusy(true);
        const response = await networkService.logIn(username, password)
        await onLogIn(response);
    };

    const signUp = async () => {
        if (signingUp) {
            if (password === repeatPassword) {
                setBusy(true);
                const response = await networkService.signUp(username, password)
                await onLogIn(response);
            } else {
                setError(`Passwords don't match`);
            }
        } else {
            setSigningUp(true);
        }
    };

    const cancelSignUp = () => {
        setSigningUp(false);
    };

    websocketService.ensureDisconnected();

    return (
        <div className="login">
            <div className="login-title">
                Soft/message
            </div>
            <Textbox title="Username" value={username} setValue={setUsername} validator={validateUsername}/>
            <Textbox title="Password" value={password} setValue={setPassword} validator={validatePassword} password={true}/>
            { signingUp &&
                <Textbox title="Repeat Password" value={repeatPassword} setValue={setRepeatPassword} validator={validatePassword} password={true}/>
            }
            { error && 
                <div className="login-error">
                    {error}
                </div>
            }
            <div className="login-buttons">
                { signingUp 
                    ? <Button title="Cancel" onClick={cancelSignUp} disabled={busy} />
                    : <Button title="Log In" onClick={logIn} disabled={busy}/>
                }
                <Button title="Sign Up" onClick={signUp} disabled={busy} className="sign-up-button"/>
            </div>
        </div>
    )
};
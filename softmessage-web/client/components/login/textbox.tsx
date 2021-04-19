import * as React from 'react';
import './textbox.less';

interface TextboxProps {
    title: string;
    value?: string;
    setValue?: (value: string) => void;
    validator?: (value: string) => string;
    password?: boolean;
    className?: string;
}

export default ({ title, value, setValue, validator, password, className }: TextboxProps): JSX.Element => {
    // don't validate an empty string
    const error = (value && validator) ? validator(value) : undefined;

    return (
        <div className={"textbox-container" + (error ? ' error' : '') + (className ? ` ${className}` : '')}>
            <div className="textbox-title">
                {title}
            </div>
            <input type={password ? "password" : "text"}
                className="textbox"
                value={value}
                placeholder={title}
                onChange={e => setValue && setValue(e.target.value)} />
             { error &&
                <div className="textbox-error">
                    {error}
                </div>
            }
        </div>
    )
};
import * as React from 'react';
import './button.less';

type Styles = 'primary' | 'secondary';

interface ButtonProps {
    style?: Styles;
    title: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export default ({ style, title, onClick, disabled, className }: ButtonProps): JSX.Element => {
    const classes = ['button', style || 'primary'];
    if (disabled) {
        classes.push('disabled');
    }
    if (className) {
        classes.push(className);
    }

    const guardedOnClick = () => {
        if (!disabled) {
            onClick();
        }
    };

    return (
        <div className={classes.join(' ')} onClick={guardedOnClick}>
            {title}
        </div>
    )
};
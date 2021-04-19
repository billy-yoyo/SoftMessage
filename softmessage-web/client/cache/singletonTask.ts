

/**
 * converts a async function in to a singelton task, where repeated calls to the function 
 * before a currently running task has finished will return the currently running task, rather than
 * creating a new one.
 */
export default <A extends any[], T>(runner: (...args: A) => Promise<T>): ((...args: A) => Promise<T>) => {
    const state: { task: Promise<T> } = {
        task: null
    };

    return (...args: A): Promise<T> => {
        if (state.task) {
            return state.task;
        } else {
            state.task = runner(...args).then((value: T) => {
                state.task = null;
                return value;
            });
            return state.task;
        }
    }
};


import * as React from 'react';

interface Listener<E, K extends keyof E> {
    handler: (value: E[K]) => void;
    id: string;
}

export class EventEmitter<E> {
    private listeners: Partial<{[K in keyof E]: Listener<E, K>[]}> = {};

    listen<K extends keyof E>(event: K, listener: (value: E[K]) => void, id: string) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        // remove current instances of this listener
        this.listeners[event] = this.listeners[event].filter(listener => listener.id !== id);
        // add latest instance of this listener
        this.listeners[event].push({ handler: listener, id });
    }

    emit<K extends keyof E>(event: K, data: E[K]) {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            eventListeners.forEach(listener => listener.handler(data));
        }
    }

    useListen<K extends keyof E>(event: K, defaultData?: E[K]): [E[K], (value: E[K]) => void] {
        const [data, setData] = React.useState<E[K]>(defaultData);
        const id = `$state-${event}`;
        this.listen(event, (value) => setData(value), id);
        return [data, setData];
    };
}

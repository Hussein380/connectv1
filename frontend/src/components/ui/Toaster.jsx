import React from 'react';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from './Toast';

export function Toaster() {
    const [toasts, setToasts] = React.useState([]);

    React.useEffect(() => {
        const handleToast = (event) => {
            const { id, title, description, action, ...props } = event.detail;

            setToasts((toasts) => [
                ...toasts,
                { id, title, description, action, ...props },
            ]);

            // Auto dismiss after 5 seconds
            setTimeout(() => {
                setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
            }, 5000);
        };

        window.addEventListener('toast', handleToast);
        return () => window.removeEventListener('toast', handleToast);
    }, []);

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, action, ...props }) => (
                <Toast key={id} {...props}>
                    <div className="grid gap-1">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    {action}
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
} 
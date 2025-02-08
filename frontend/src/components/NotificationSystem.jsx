import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell } from 'lucide-react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';

const NotificationSystem = () => {
    const socket = useSocket();
    const [notifications, setNotifications] = React.useState([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (socket) {
            socket.on('new_mentorship_request', handleNewRequest);
            socket.on('request_status_update', handleStatusUpdate);
        }

        return () => {
            if (socket) {
                socket.off('new_mentorship_request');
                socket.off('request_status_update');
            }
        };
    }, [socket]);

    const handleNewRequest = (data) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const handleStatusUpdate = (data) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <>
            <Button
                variant="ghost"
                className="relative"
                onClick={() => setIsOpen(true)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Notifications</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-center">No notifications</p>
                        ) : (
                            <>
                                {unreadCount > 0 && (
                                    <Button
                                        variant="link"
                                        className="text-sm"
                                        onClick={markAllAsRead}
                                    >
                                        Mark all as read
                                    </Button>
                                )}

                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                            }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <p className="font-medium">{notification.title}</p>
                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NotificationSystem; 
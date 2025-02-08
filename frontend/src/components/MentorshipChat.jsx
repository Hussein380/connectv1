import React from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ScrollArea } from './ui/ScrollArea';

const MentorshipChat = ({ mentorshipId, otherUser }) => {
    const socket = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
        if (socket) {
            socket.emit('join_chat', mentorshipId);
            socket.on('receive_message', handleNewMessage);
            socket.on('message_history', setMessages);

            return () => {
                socket.off('receive_message');
                socket.off('message_history');
                socket.emit('leave_chat', mentorshipId);
            };
        }
    }, [socket, mentorshipId]);

    const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            mentorshipId,
            senderId: user._id,
            content: newMessage,
            timestamp: new Date()
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h3 className="font-semibold">Chat with {otherUser.name}</h3>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${message.senderId === user._id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <span className="text-xs opacity-70">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                </div>
            </form>
        </div>
    );
};

export default MentorshipChat; 
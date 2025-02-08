import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Send, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

const Messages = () => {
  const { user } = useAuth();
  const { handleRequest } = useApi();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat._id);
    }
  }, [currentChat]);

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('new_message', (message) => {
        if (currentChat && 
            (message.sender === currentChat._id || message.recipient === currentChat._id)) {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
        // Update conversations list
        fetchConversations();
      });

      // Listen for read receipts
      socket.on('message_read', ({ messageId }) => {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        ));
      });

      return () => {
        socket.off('new_message');
        socket.off('message_read');
      };
    }
  }, [socket, currentChat]);

  const fetchConversations = async () => {
    try {
      const data = await handleRequest(async () => {
        const response = await fetch('/api/messages');
        return response.json();
      });
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const data = await handleRequest(async () => {
        const response = await fetch(`/api/messages/${userId}`);
        return response.json();
      });
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await handleRequest(async () => {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: currentChat._id,
            content: newMessage
          })
        });
        return response.json();
      });

      // Emit message through socket
      socket.emit('send_message', message);

      setNewMessage('');
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add file attachment handling
  const handleFileAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      // Send message with attachment
      const message = await handleRequest(async () => {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: currentChat._id,
            content: newMessage,
            attachments: [data.url]
          })
        });
        return response.json();
      });

      socket.emit('send_message', message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  // Add social sharing
  const handleShareMessage = async (message) => {
    try {
      await navigator.share({
        title: 'Shared Message',
        text: message.content,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing message:', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/4 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => setCurrentChat(conv)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                currentChat?._id === conv._id ? 'bg-blue-50' : ''
              }`}
            >
              <h3 className="font-medium">
                {conv.lastMessage.sender._id === user._id
                  ? conv.lastMessage.recipient.name
                  : conv.lastMessage.sender.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {conv.lastMessage.content}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="font-semibold">
                {currentChat.lastMessage.sender._id === user._id
                  ? currentChat.lastMessage.recipient.name
                  : currentChat.lastMessage.sender.name}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender._id === user._id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender._id === user._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {message.attachments?.map((url, index) => (
                      <div key={index} className="mb-2">
                        {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <img src={url} alt="attachment" className="rounded-lg max-w-full" />
                        ) : (
                          <a href={url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-500 hover:underline">
                            View Attachment
                          </a>
                        )}
                      </div>
                    ))}
                    <p>{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                      {message.sender._id === user._id && (
                        <span className="text-xs">
                          {message.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleShareMessage(message)}
                      className="text-xs opacity-75 hover:opacity-100"
                    >
                      Share
                    </button>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 
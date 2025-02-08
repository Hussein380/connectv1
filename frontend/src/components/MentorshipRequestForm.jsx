import React from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { mentorshipAPI } from '../services/api';
import { toast } from './ui/Toast';

const MentorshipRequestForm = ({ mentorId, onSuccess, onCancel }) => {
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await mentorshipAPI.sendRequest(mentorId, {
                message
            });
            toast({
                title: "Success",
                description: "Mentorship request sent successfully",
                variant: "default"
            });
            onSuccess?.();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send mentorship request",
                variant: "destructive"
            });
            console.error('Error sending request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you'd like to connect with this mentor..."
                    required
                    className="h-32"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                </Button>
            </div>
        </form>
    );
};

export default MentorshipRequestForm; 
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { toast } from './ui/Toast';
import { mentorAPI } from '../services/api';

const ContactSettings = () => {
    const { user, updateUser } = useAuth();
    const [settings, setSettings] = React.useState({
        phone: user?.contact?.phone || '',
        email: user?.contact?.email || user?.email || ''
    });
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await mentorAPI.updateProfile({
                contact: {
                    phone: settings.phone,
                    email: settings.email
                }
            });

            updateUser({
                ...user,
                contact: response.contact
            });

            toast({
                title: "Success",
                description: "Contact settings updated successfully",
                variant: "default"
            });
        } catch (error) {
            console.error('Error updating contact settings:', error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update contact settings",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="Your contact email"
                    required
                />
                <p className="text-sm text-gray-500 mt-1">
                    This email will be visible to mentees
                </p>
            </div>

            <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="Your phone number"
                />
                <p className="text-sm text-gray-500 mt-1">
                    Add a phone number if you want mentees to contact you directly
                </p>
            </div>

            <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Contact Settings'}
            </Button>
        </form>
    );
};

export default ContactSettings;
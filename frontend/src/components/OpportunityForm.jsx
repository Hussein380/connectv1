import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';

const OpportunityForm = ({ onSubmit, initialData = {}, submitLabel = "Create Opportunity" }) => {
    const [formData, setFormData] = React.useState({
        title: initialData.title || '',
        description: initialData.description || '',
        requirements: initialData.requirements || '',
        deadline: initialData.deadline || '',
        applicationLink: initialData.applicationLink || '',
        type: initialData.type || 'internship'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Only include fields that have values
        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== '')
        );
        onSubmit(cleanedData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter opportunity title"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the opportunity..."
                    required
                />
            </div>

            <div>
                <Label htmlFor="applicationLink">Application/Reference Link</Label>
                <Input
                    id="applicationLink"
                    type="url"
                    value={formData.applicationLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationLink: e.target.value }))}
                    placeholder="https://"
                />
            </div>

            <div>
                <Label htmlFor="type">Opportunity Type</Label>
                <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 p-2"
                >
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                    <option value="project">Project</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (Optional)</Label>
                <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="List any specific requirements..."
                />
            </div>

            <div>
                <Label htmlFor="deadline">Application Deadline (Optional)</Label>
                <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
            </div>

            <Button type="submit" className="w-full">
                {submitLabel}
            </Button>
        </form>
    );
};

export default OpportunityForm; 
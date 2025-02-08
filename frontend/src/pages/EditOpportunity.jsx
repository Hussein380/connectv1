import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { opportunityAPI } from '../services/api';
import OpportunityForm from '../components/OpportunityForm';
import { toast } from '../components/ui/Toast';

const EditOpportunity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchOpportunity();
    }, [id]);

    const fetchOpportunity = async () => {
        try {
            const data = await opportunityAPI.getById(id);
            setOpportunity(data);
        } catch (error) {
            console.error('Error fetching opportunity:', error);
            toast({
                title: "Error",
                description: "Failed to fetch opportunity",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            await opportunityAPI.update(id, formData);
            toast({
                title: "Success",
                description: "Opportunity updated successfully",
                variant: "default"
            });
            navigate('/opportunities/manage');
        } catch (error) {
            console.error('Error updating opportunity:', error);
            toast({
                title: "Error",
                description: "Failed to update opportunity",
                variant: "destructive"
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Opportunity</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <OpportunityForm
                    initialData={opportunity}
                    onSubmit={handleSubmit}
                    submitLabel="Update Opportunity"
                />
            </div>
        </div>
    );
};

export default EditOpportunity; 
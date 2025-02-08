import React from 'react';
import { useAuth } from '../context/AuthContext';
import { opportunityAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/AlertDialog';
import { toast } from '../components/ui/Toast';

const ManageOpportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await opportunityAPI.getMentorOpportunities();
      setOpportunities(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch opportunities');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await opportunityAPI.delete(id);
      setOpportunities(prev => prev.filter(opp => opp._id !== id));
      toast({
        title: "Success",
        description: "Opportunity deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete opportunity",
        variant: "destructive",
      });
      console.error('Error deleting opportunity:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await opportunityAPI.updateStatus(id, newStatus);
      setOpportunities(prev =>
        prev.map(opp => opp._id === id ? updated : opp)
      );
      toast({
        title: "Success",
        description: `Opportunity ${newStatus} successfully`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${newStatus} opportunity`,
        variant: "destructive",
      });
      console.error('Error updating opportunity:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Opportunities</h1>
        <Button onClick={() => navigate('/opportunities/create')}>
          Create New Opportunity
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <Button onClick={fetchOpportunities} variant="link" className="ml-2">
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity._id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{opportunity.title}</h2>
                <p className="text-gray-600">{opportunity.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${opportunity.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(opportunity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/opportunities/edit/${opportunity._id}`)}
                >
                  Edit
                </Button>

                {opportunity.status === 'open' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(opportunity._id, 'closed')}
                  >
                    Close
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(opportunity._id, 'open')}
                  >
                    Reopen
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the opportunity.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(opportunity._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}

        {opportunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No opportunities found. Create your first opportunity!
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOpportunities; 
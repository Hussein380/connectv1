import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import CreateOpportunity from './pages/CreateOpportunity';
import ManageOpportunities from './pages/ManageOpportunities';
import MentorProfile from './pages/MentorProfile';
import MentorSettings from './pages/MentorSettings';
import MentorshipRequests from './pages/MentorshipRequests';
import MyMentorshipRequests from './pages/MyMentorshipRequests';
import EditOpportunity from './pages/EditOpportunity';
import BrowseMentors from './pages/BrowseMentors';
import SetupProfile from './pages/SetupProfile';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/browse-mentors" element={<BrowseMentors />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Mentor routes */}
                <Route path="/setup-profile" element={
                  <ProtectedRoute>
                    <SetupProfile />
                  </ProtectedRoute>
                } />
                <Route path="/mentors/:id" element={
                  <ProtectedRoute>
                    <MentorProfile />
                  </ProtectedRoute>
                } />
                <Route path="/mentor/settings" element={
                  <ProtectedRoute>
                    <MentorSettings />
                  </ProtectedRoute>
                } />

                {/* Mentorship request routes */}
                <Route path="/mentorship/requests" element={
                  <ProtectedRoute>
                    <MentorshipRequests />
                  </ProtectedRoute>
                } />
                <Route path="/mentorship/my-requests" element={
                  <ProtectedRoute>
                    <MyMentorshipRequests />
                  </ProtectedRoute>
                } />

                {/* Opportunity routes */}
                <Route path="/opportunities" element={
                  <ProtectedRoute>
                    <Opportunities />
                  </ProtectedRoute>
                } />
                <Route path="/opportunities/create" element={
                  <ProtectedRoute>
                    <CreateOpportunity />
                  </ProtectedRoute>
                } />
                <Route path="/opportunities/manage" element={
                  <ProtectedRoute>
                    <ManageOpportunities />
                  </ProtectedRoute>
                } />
                <Route path="/opportunities/edit/:id" element={
                  <ProtectedRoute>
                    <EditOpportunity />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </ToastProvider>
          <Toaster />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 
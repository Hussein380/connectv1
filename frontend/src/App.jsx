import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
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
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              <Layout>
                <ErrorBoundary>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/browse-mentors" element={<BrowseMentors />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <Dashboard />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />

                    {/* Mentor routes */}
                    <Route path="/setup-profile" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <SetupProfile />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    <Route path="/mentors/:id" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <MentorProfile />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    <Route path="/mentor/settings" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <MentorSettings />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />

                    {/* Mentorship request routes */}
                    <Route path="/mentorship/requests" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <MentorshipRequests />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    <Route path="/mentorship/my-requests" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <MyMentorshipRequests />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />

                    {/* Opportunity routes */}
                    <Route path="/opportunities" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <Opportunities />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    <Route path="/opportunities/create" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <CreateOpportunity />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    <Route path="/opportunities/manage" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <ManageOpportunities />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                    <Route path="/opportunities/edit/:id" element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <EditOpportunity />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </ErrorBoundary>
              </Layout>
            </ToastProvider>
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 
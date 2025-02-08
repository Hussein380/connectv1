import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const MentorshipCalendar = ({ sessions = [], onEventClick }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div
                            key={session._id}
                            onClick={() => onEventClick(session)}
                            className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{session.topic}</h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        {formatDate(session.startTime)}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    with {session.mentor.name}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No upcoming sessions scheduled
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorshipCalendar; 
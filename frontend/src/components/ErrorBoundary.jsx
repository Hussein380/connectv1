import React from 'react';
import { Button } from './ui/Button';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({ errorInfo });

        // You could also send this to a monitoring service like Sentry
        // if (typeof window.Sentry !== 'undefined') {
        //   window.Sentry.captureException(error);
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Optionally, you can perform additional cleanup
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI when an error occurs
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 m-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-center">
                    <AlertTriangle className="h-16 w-16 text-amber-400 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-blue-200 mb-4">
                        We've encountered an error while trying to load this part of the application.
                    </p>

                    {this.props.resetEnabled && (
                        <Button
                            onClick={this.handleReset}
                            className="mb-6 bg-blue-600 hover:bg-blue-700"
                        >
                            Try Again
                        </Button>
                    )}

                    {this.props.showDetails && this.state.error && (
                        <div className="mt-4 p-4 rounded bg-slate-900/50 text-left overflow-auto max-w-full text-sm text-slate-300">
                            <p className="font-mono mb-2">{this.state.error.toString()}</p>
                            {this.state.errorInfo && (
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-blue-400 hover:text-blue-300">Stack trace</summary>
                                    <pre className="mt-2 overflow-auto text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        // Normally, just render children
        return this.props.children;
    }
}

// Default props
ErrorBoundary.defaultProps = {
    resetEnabled: true,
    showDetails: process.env.NODE_ENV === 'development',
};

export default ErrorBoundary; 
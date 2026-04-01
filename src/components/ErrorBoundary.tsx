import { Component, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-xl border border-destructive/20 bg-destructive/5">
          <div className="text-destructive text-lg font-semibold mb-2">
            Something went wrong
          </div>
          {this.state.error && (
            <p className="text-sm text-muted-foreground mb-4 max-w-md text-center">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>
          )}
          <Button onClick={this.handleReset} variant="outline" size="sm">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AsyncErrorFallback({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="text-destructive text-lg font-semibold mb-2">
        Failed to load
      </div>
      {error && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md text-center">
          {error.message || 'Failed to load content'}
        </p>
      )}
      {resetError && (
        <Button onClick={resetError} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}

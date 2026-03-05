"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`ErrorBoundary [${this.props.name || "Global"}]:`, error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-6 text-center animate-fade-in">
                    <div className="max-w-md card p-8 border-red-100 dark:border-red-900/30">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            An unexpected error occurred in {this.props.name || "this part of the application"}.
                            Don't worry, your data is safe.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={this.handleReset}
                                className="btn-primary flex-1 justify-center gap-2"
                            >
                                <RefreshCw size={16} /> Reload Page
                            </button>
                            <a
                                href="/dashboard"
                                className="btn-secondary flex-1 justify-center gap-2"
                            >
                                <Home size={16} /> Dashboard
                            </a>
                        </div>

                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-left">
                                <p className="text-xs font-mono text-red-500 overflow-auto max-h-32">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

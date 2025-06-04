import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-base-content p-4">
            <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl mb-2">Oops! Page not found.</p>
            <p className="text-sm text-gray-500 mb-6">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;

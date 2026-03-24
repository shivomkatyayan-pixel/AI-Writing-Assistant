import React from 'react';
import { Offline } from 'lucide-react';

const Header = () => {
    return (
        <header>
            <div className="status-indicator">
                <Offline />
                <span>Offline</span>
            </div>
            <h1>AI Writing Assistant</h1>
            <div className="status-indicator">
                <span>Status: Good</span>
            </div>
        </header>
    );
};

export default Header;
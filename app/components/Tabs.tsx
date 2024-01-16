import React, { useState, ReactNode } from 'react';

interface TabsProps {
    children: ReactNode[];
}

interface TabProps {
    label: string;
    children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<string>((children[0] as React.ReactElement).props.label);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, newActiveTab: string) => {
        e.preventDefault();
        setActiveTab(newActiveTab);
    };

    return (
        <div className="w-full mx-auto py-10">
            <div className="flex border-b border-cambio-blue w-full">
                {children.map((child: ReactNode) => {
                    if (React.isValidElement(child)) {
                        return (
                            <button
                                key={child?.props.label}
                                className={`${activeTab === child?.props.label ? 'border-b-4 border-cambio-blue' : 'border-b-4 border-white'
                                    } w-max px-2 text-gray-700 font-medium py-2 hover:border-neutral-100
                                    hover:text-neutral-500
                                    `}
                                onClick={(e) => handleClick(e, child?.props.label)}
                            >
                                {child?.props.label}
                            </button>)
                    }
                })}
            </div>
            <div className="py-4 min-h-[500px]">
                {children.map((child: ReactNode) => {
                    if (React.isValidElement(child) && child?.props.label === activeTab) {
                        return <div key={child.props.label}>{child.props.children}</div>;
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

const Tab: React.FC<TabProps> = ({ label, children }) => {
    return (
        <div className="hidden" label={label}>
            {children}
        </div>
    );
};

export { Tabs, Tab };

import React, { useState, ReactNode } from 'react';

interface TabsProps {
    children: ReactNode[];
}

interface TabProps {
    label: string;
    children: ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        setSelectedTab(index);
    };

    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <div className="w-full mx-auto py-10 mb-20">
            <div className="flex border-b border-cambio-blue w-full">
                {children.map((child: ReactNode, index) => {
                    if (React.isValidElement(child)) {
                        return (
                            <button
                                key={child?.props.label}
                                className={`${selectedTab === index ? 'border-b-4 border-cambio-blue' : 'border-b-4 border-white'
                                    } w-max px-2 text-gray-700 font-medium py-2 hover:border-neutral-100
                                    hover:text-neutral-500
                                    `}
                                onClick={(e) => handleClick(e, index)}
                            >
                                {child?.props.label}
                            </button>)
                    }
                })}
            </div>
            <div className="py-4 min-h-[500px]">
                {children[selectedTab]}
            </div>
        </div>
    );
};

const Tab: React.FC<TabProps> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

export { Tabs, Tab };

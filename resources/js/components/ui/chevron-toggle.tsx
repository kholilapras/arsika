import React from "react";
import { ChevronRight } from "lucide-react"; // atau icon lib yang kamu pakai

interface ChevronToggleProps {
    open: boolean;
    className?: string;
}

const ChevronToggle: React.FC<ChevronToggleProps> = ({ open, className }) => {
    return (
        <div className={`h-10 px-0 py-2 ${className || ""}`}>
            <ChevronRight
                className={`ml-auto transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"
                    }`}
            />
        </div>
    );
};

export default ChevronToggle;

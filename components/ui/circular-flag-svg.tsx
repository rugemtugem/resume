// components/ui/circular-flag-svg.tsx
"use client";

import { motion } from "framer-motion";

interface CircularFlagProps {
    countryCode: "br" | "us";
    size?: number;
}

const flagSVGs = {
    br: (
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="18" fill="#009B3A" />
            <path d="M18 6L30 18L18 30L6 18L18 6Z" fill="#FEDF00" />
            <circle cx="18" cy="18" r="7" fill="#002776" />
            <path d="M11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18"
                stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
    ),
    us: (
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="18" fill="#B22234" />
            <rect y="2.77" width="36" height="2.77" fill="white" />
            <rect y="8.31" width="36" height="2.77" fill="white" />
            <rect y="13.85" width="36" height="2.77" fill="white" />
            <rect y="19.38" width="36" height="2.77" fill="white" />
            <rect y="24.92" width="36" height="2.77" fill="white" />
            <rect y="30.46" width="36" height="2.77" fill="white" />
            <rect width="14.4" height="16.62" fill="#3C3B6E" />
        </svg>
    ),
};

export function CircularFlag({ countryCode, size = 40 }: CircularFlagProps) {
    return (
        <motion.div
            key={countryCode}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                overflow: "hidden",
            }}
        >
            {flagSVGs[countryCode]}
        </motion.div>
    );
}

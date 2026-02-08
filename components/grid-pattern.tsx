export function GridPattern() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="grid-pattern"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                    >
                        <path
                            d="M0 32V0h32"
                            fill="none"
                            stroke="rgba(239, 68, 68, 0.05)"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
        </div>
    );
}

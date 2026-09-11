export default function Logo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover:-rotate-6 ${className}`}
      aria-hidden="true"
    >
      {/* < */}
      <path
        d="M8.5 6 L3 12 L8.5 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* > */}
      <path
        d="M15.5 6 L21 12 L15.5 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* / */}
      <line
        x1="13.5"
        y1="4"
        x2="10.5"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-accent dark:text-accent-soft"
      />
    </svg>
  );
}

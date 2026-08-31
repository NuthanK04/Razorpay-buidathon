interface ProductVisualProps {
  id: string;
  className?: string;
  size?: number;
}

export function ProductVisual({ id, className = '', size = 72 }: ProductVisualProps) {
  switch (id) {
    case 'studio-tote':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
          <path d="M9 14h6" strokeWidth="1" strokeDasharray="1 1" opacity="0.4" />
        </svg>
      );

    case 'everyday-backpack':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <path d="M5 10c0-4.4 3.1-8 7-8s7 3.6 7 8v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z" />
          <path d="M9 2v3a3 3 0 0 0 6 0V2" />
          <path d="M8 12h8a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2z" />
          <line x1="12" y1="12" x2="12" y2="15" />
          <line x1="9" y1="8" x2="15" y2="8" strokeWidth="1" opacity="0.5" />
        </svg>
      );

    case 'canvas-weekender':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <rect x="2" y="7" width="20" height="13" rx="3" />
          <path d="M7 7V5a3 3 0 0 1 6 0v2" />
          <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1" opacity="0.6" />
          <path d="M7 12v8" strokeWidth="1.2" />
          <path d="M17 12v8" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'utility-crossbody':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <path d="M3 9a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9z" />
          <path d="M1 5l5 3" strokeWidth="1.5" />
          <path d="M23 19l-5-3" strokeWidth="1.5" />
          <line x1="7" y1="11" x2="17" y2="11" />
          <rect x="10" y="14" width="4" height="3" rx="0.5" strokeWidth="1" />
        </svg>
      );

    case 'field-jacket':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <path d="M6 3h12l3 6-2 12H5L3 9l3-6z" />
          <path d="M9 3v4a3 3 0 0 0 6 0V3" />
          <line x1="12" y1="7" x2="12" y2="21" strokeWidth="1.2" />
          <rect x="6" y="10" width="3.5" height="3.5" rx="0.5" strokeWidth="1" />
          <rect x="14.5" y="10" width="3.5" height="3.5" rx="0.5" strokeWidth="1" />
          <rect x="6" y="15" width="3.5" height="4" rx="0.5" strokeWidth="1" />
          <rect x="14.5" y="15" width="3.5" height="4" rx="0.5" strokeWidth="1" />
        </svg>
      );

    case 'daily-cap':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <path d="M4 14c0-5 3.6-9 8-9s8 4 8 9H4z" />
          <path d="M4 14c-1 0-3 1-3 2.5S3 19 6 19h10c4 0 7-1.5 7-3.5" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <line x1="12" y1="6" x2="12" y2="14" strokeWidth="0.8" opacity="0.4" />
        </svg>
      );

    case 'travel-pouch':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <path d="M3 9l2-4h14l2 4v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <path d="M1 12h2" strokeWidth="2" />
          <line x1="8" y1="14" x2="16" y2="14" strokeWidth="1" opacity="0.6" />
        </svg>
      );

    case 'studio-wallet':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 transition-transform duration-300 ${className}`}
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" strokeWidth="1" />
          <path d="M16 14h5v4h-5z" strokeWidth="1.2" />
          <circle cx="18.5" cy="16" r="0.8" fill="currentColor" stroke="none" />
          <path d="M7 8h4" strokeWidth="1" opacity="0.5" />
        </svg>
      );

    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-foreground/90 ${className}`}
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
  }
}

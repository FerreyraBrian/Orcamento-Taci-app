import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="currentColor" 
    strokeWidth="0.5"
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
    >
        <path 
        stroke="none"
        d="M19.05 4.94A10 10 0 0 0 12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10h.01c1.8 0 3.52-.48 5-1.3l2.85 1.42L18.7 19c.82-1.48 1.3-3.19 1.3-5a10 10 0 0 0-1.95-5.96zm-7.05 11.1h-.01c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.59 0 3.05.62 4.12 1.63L15 8.17A4.018 4.018 0 0 0 12 10c-2.21 0-4 1.79-4 4s1.79 4 4 4c.83 0 1.58-.26 2.2-.7l1.08 1.08c-.78.53-1.72.82-2.78.82z"
        >
        </path>
         <path 
         d="M16.5 11.5c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-3-2c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-3-2c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"
         fill="#fff"
         stroke="none"
         >
        </path>
    </svg>
  );
}

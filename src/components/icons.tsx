import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 15v- difficultésM5 15h14" />
      <path d="M10 9v6" />
      <path d="M14 9v6" />
      <path d="M18 9v6" />
      <path d="M6 9v6" />
      <path d="M12 3L2 9.6l10 6.6L22 9.6z" />
    </svg>
  ),
};

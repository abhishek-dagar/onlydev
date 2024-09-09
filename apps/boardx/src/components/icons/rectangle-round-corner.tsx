type Props = { size?: number; className?: string };

const RectangleRoundCorner = ({ size = 24, className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      role="img"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        strokeWidth="1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 12v-4a4 4 0 0 1 4 -4h4"></path>
        <line x1="16" y1="4" x2="16" y2="4.01"></line>
        <line x1="20" y1="4" x2="20" y2="4.01"></line>
        <line x1="20" y1="8" x2="20" y2="8.01"></line>
        <line x1="20" y1="12" x2="20" y2="12.01"></line>
        <line x1="4" y1="16" x2="4" y2="16.01"></line>
        <line x1="20" y1="16" x2="20" y2="16.01"></line>
        <line x1="4" y1="20" x2="4" y2="20.01"></line>
        <line x1="8" y1="20" x2="8" y2="20.01"></line>
        <line x1="12" y1="20" x2="12" y2="20.01"></line>
        <line x1="16" y1="20" x2="16" y2="20.01"></line>
        <line x1="20" y1="20" x2="20" y2="20.01"></line>
      </g>
    </svg>
  );
};
export { RectangleRoundCorner as RectangleRoundCornerIcon };
export default RectangleRoundCorner;
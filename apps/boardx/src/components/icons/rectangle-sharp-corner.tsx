type Props = { size?: number; className?: string };

const RectangleSharpCorner = ({ size = 24, className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
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
      <svg strokeWidth="1.5">
        <path d="M3.33334 9.99998V6.66665C3.33334 6.04326 3.33403 4.9332 3.33539 3.33646C4.95233 3.33436 6.06276 3.33331 6.66668 3.33331H10"></path>
        <path d="M13.3333 3.33331V3.34331"></path>
        <path d="M16.6667 3.33331V3.34331"></path>
        <path d="M16.6667 6.66669V6.67669"></path>
        <path d="M16.6667 10V10.01"></path>
        <path d="M3.33334 13.3333V13.3433"></path>
        <path d="M16.6667 13.3333V13.3433"></path>
        <path d="M3.33334 16.6667V16.6767"></path>
        <path d="M6.66666 16.6667V16.6767"></path>
        <path d="M10 16.6667V16.6767"></path>
        <path d="M13.3333 16.6667V16.6767"></path>
        <path d="M16.6667 16.6667V16.6767"></path>
      </svg>
    </svg>
  );
};
export { RectangleSharpCorner as RectangleSharpCornerIcon };
export default RectangleSharpCorner;

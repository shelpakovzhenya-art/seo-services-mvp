type TelegramIconLinkProps = {
  href: string;
  className?: string;
};

export default function TelegramIconLink({
  href,
  className = "",
}: TelegramIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Telegram"
      className={`telegram-icon-link ${className}`.trim()}
    >
      <svg
        viewBox="0 0 240 240"
        aria-hidden="true"
        className="h-11 w-11"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="telegramGradient" x1="0.5" x2="0.5" y1="0" y2="1">
            <stop offset="0%" stopColor="#41B7E6" />
            <stop offset="100%" stopColor="#2A97D1" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="120" fill="url(#telegramGradient)" />
        <path
          d="M54.6 120.5c34.1-14.9 56.9-24.7 68.6-29.4 33.4-13.9 40.4-16.3 44.9-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.4 1.7 3.4.2 1 .4 3.4.2 5.2-2.1 21-10.6 71.9-14.9 95.4-1.8 10-5.4 13.3-8.9 13.6-7.5.7-13.2-4.9-20.5-9.7-11.5-7.6-18-12.4-29.1-19.8-12.8-8.4-4.5-13.1 2.8-20.8 1.9-2 34.3-31.4 35-34.2.1-.3.1-1.4-.6-2-.7-.7-1.8-.4-2.6-.2-1.1.2-18.5 11.7-52.1 34.4-4.9 3.4-9.4 5-13.3 4.9-4.4-.1-12.9-2.5-19.2-4.5-7.7-2.5-13.8-3.8-13.2-8.1.3-2.2 3.3-4.5 9.1-6.8Z"
          fill="#FFF"
        />
        <path
          d="M101.7 164.1c2.3 0 3.4-1 4.7-2.2l9.2-8.9-11.5-7.1"
          fill="#DDECF7"
        />
        <path
          d="M104.1 145.9 99.7 181c-.7 5 2.6 7 6.4 4.8l19.2-18.1"
          fill="#B8D4EA"
        />
      </svg>
    </a>
  );
}

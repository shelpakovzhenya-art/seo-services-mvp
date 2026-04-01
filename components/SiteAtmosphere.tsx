const stars = [
  { left: '8%', top: '10%', size: 'sm', delay: '0.4s', duration: '6.4s' },
  { left: '22%', top: '20%', size: 'md', delay: '1.1s', duration: '7.2s' },
  { left: '36%', top: '8%', size: 'sm', delay: '1.8s', duration: '5.9s' },
  { left: '58%', top: '14%', size: 'sm', delay: '0.6s', duration: '6.8s' },
  { left: '72%', top: '24%', size: 'md', delay: '1.5s', duration: '7.4s' },
  { left: '86%', top: '12%', size: 'sm', delay: '0.9s', duration: '6.1s' },
  { left: '16%', top: '62%', size: 'sm', delay: '1.3s', duration: '6.6s' },
  { left: '44%', top: '72%', size: 'md', delay: '2.1s', duration: '7.8s' },
  { left: '78%', top: '68%', size: 'sm', delay: '1.7s', duration: '6.9s' },
]

export default function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="site-atmosphere">
      <div className="ambient-glow ambient-glow--warm" />
      <div className="ambient-glow ambient-glow--cool" />
      <div className="ambient-header-band" />
      <div className="ambient-grid" />

      {stars.map((star, index) => (
        <span
          key={`${star.left}-${star.top}-${index}`}
          className={`ambient-star ambient-star--${star.size}`}
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  )
}

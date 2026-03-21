const stars = [
  { left: '6%', top: '12%', size: 'sm', delay: '0s', duration: '4.8s' },
  { left: '14%', top: '28%', size: 'md', delay: '0.9s', duration: '6.1s' },
  { left: '24%', top: '8%', size: 'sm', delay: '1.4s', duration: '5.2s' },
  { left: '31%', top: '42%', size: 'lg', delay: '0.6s', duration: '7.5s' },
  { left: '42%', top: '17%', size: 'sm', delay: '2.3s', duration: '5.7s' },
  { left: '51%', top: '30%', size: 'md', delay: '1.7s', duration: '6.8s' },
  { left: '62%', top: '10%', size: 'sm', delay: '0.5s', duration: '4.9s' },
  { left: '69%', top: '38%', size: 'lg', delay: '2.1s', duration: '7.1s' },
  { left: '78%', top: '20%', size: 'sm', delay: '1.1s', duration: '5.5s' },
  { left: '86%', top: '11%', size: 'md', delay: '2.8s', duration: '6.4s' },
  { left: '92%', top: '33%', size: 'sm', delay: '0.4s', duration: '5s' },
  { left: '74%', top: '63%', size: 'lg', delay: '1.8s', duration: '7.6s' },
  { left: '12%', top: '69%', size: 'sm', delay: '2.7s', duration: '5.3s' },
  { left: '28%', top: '82%', size: 'md', delay: '1.2s', duration: '6.5s' },
  { left: '57%', top: '78%', size: 'sm', delay: '2.2s', duration: '5.4s' },
  { left: '88%', top: '74%', size: 'md', delay: '0.8s', duration: '6.2s' },
]

const sparkles = [
  { left: '18%', top: '18%', delay: '0.4s', duration: '6.8s' },
  { left: '46%', top: '12%', delay: '1.6s', duration: '7.4s' },
  { left: '72%', top: '66%', delay: '0.9s', duration: '7.1s' },
  { left: '86%', top: '26%', delay: '2.1s', duration: '6.5s' },
]

const headerGapStars = [
  { left: '18%', top: '166px', size: 'sm', delay: '0.2s', duration: '5.3s' },
  { left: '27%', top: '214px', size: 'md', delay: '1.1s', duration: '6.4s' },
  { left: '39%', top: '188px', size: 'sm', delay: '0.5s', duration: '5.6s' },
  { left: '58%', top: '204px', size: 'sm', delay: '1.8s', duration: '5.8s' },
  { left: '72%', top: '178px', size: 'md', delay: '0.9s', duration: '6.2s' },
  { left: '83%', top: '232px', size: 'sm', delay: '1.4s', duration: '5.1s' },
]

const headerGapSparkles = [
  { left: '22%', top: '188px', delay: '0.8s', duration: '6.9s' },
  { left: '66%', top: '224px', delay: '1.9s', duration: '7.2s' },
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

      {headerGapStars.map((star, index) => (
        <span
          key={`header-${star.left}-${star.top}-${index}`}
          className={`ambient-star ambient-star--${star.size} ambient-star--header`}
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {sparkles.map((sparkle, index) => (
        <span
          key={`${sparkle.left}-${sparkle.top}-${index}`}
          className="ambient-sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
          }}
        />
      ))}

      {headerGapSparkles.map((sparkle, index) => (
        <span
          key={`header-sparkle-${sparkle.left}-${sparkle.top}-${index}`}
          className="ambient-sparkle ambient-sparkle--header"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
          }}
        />
      ))}

      <span className="ambient-comet ambient-comet--1" />
      <span className="ambient-comet ambient-comet--2" />
      <span className="ambient-comet ambient-comet--header" />
      <span className="ambient-rocket ambient-rocket--1" />
      <span className="ambient-rocket ambient-rocket--2" />
      <span className="ambient-rocket ambient-rocket--3" />
      <span className="ambient-signal ambient-signal--1" />
      <span className="ambient-signal ambient-signal--2" />
      <span className="ambient-ufo ambient-ufo--1" />
      <span className="ambient-ufo ambient-ufo--2" />
      <span className="ambient-ufo ambient-ufo--3" />
      <span className="ambient-ufo ambient-ufo--4" />
      <span className="ambient-orb ambient-orb--1" />
      <span className="ambient-orb ambient-orb--2" />
      <span className="ambient-orb ambient-orb--3" />
    </div>
  )
}

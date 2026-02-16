'use client'

import { useEffect, useState } from 'react'

function getMapsHref(location: string, ua: string): string {
  const encoded = encodeURIComponent(location)
  // iOS: use Apple Maps (geo: not supported in Safari)
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return `https://maps.apple.com/?q=${encoded}`
  }
  // Android: geo opens Google Maps
  if (/Android/i.test(ua)) {
    return `geo:0,0?q=${encoded}`
  }
  // Desktop: Google Maps
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`
}

interface LocationLinkProps {
  location: string
  className?: string
}

export default function LocationLink({ location, className }: LocationLinkProps) {
  const [href, setHref] = useState(() =>
    getMapsHref(location, typeof navigator !== 'undefined' ? navigator.userAgent : '')
  )

  useEffect(() => {
    setHref(getMapsHref(location, navigator.userAgent))
  }, [location])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {location}
    </a>
  )
}

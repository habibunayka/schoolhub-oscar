// src/components/common/SafeImage.jsx
import React, { useState, useEffect } from "react";
import { getInitials } from "../utils/string";
import { svgPlaceholder } from "../utils/svgPlaceholder";

/**
 * SafeImage
 * Props:
 *  - src: original image url
 *  - alt: alt text (also used to generate initials)
 *  - className: tailwind classes
 *  - sizePx: number used to generate svg placeholder (default 128)
 *  - fallback: optional explicit fallback URL
 */
export default function SafeImage({ src, alt = "", className = "", sizePx = 128, fallback = null, ...rest }) {
  const initials = getInitials(alt || "");
  const defaultFallback = svgPlaceholder(initials || "?", Math.max(64, sizePx), { rounded: true });
  const [currentSrc, setCurrentSrc] = useState(src || fallback || defaultFallback);

  // if src changes, reset
  useEffect(() => {
    setCurrentSrc(src || fallback || defaultFallback);
  }, [src, fallback, defaultFallback]);

  const handleError = (e) => {
    // prevent infinite loop
    if (currentSrc === (fallback || defaultFallback)) return;
    setCurrentSrc(fallback || defaultFallback);
    if (e.currentTarget) e.currentTarget.onerror = null;
  };

  return (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={currentSrc}
      alt={alt || "image"}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Reveal({ children, delay = 0, className = "", style }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const mergedStyle: CSSProperties = { ...style, transitionDelay: `${delay}ms` };

  return (
    <div ref={ref} className={`reveal${inView ? " reveal-visible" : ""} ${className}`} style={mergedStyle}>
      {children}
    </div>
  );
}

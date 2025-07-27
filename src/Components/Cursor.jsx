import { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const borderDotPosition = useRef({ x: 0, y: 0 });

  const [renderPos, setRenderPos] = useState({ 
    dot: { x: 0, y: 0 }, 
    border: { x: 0, y: 0 } 
  });
  const [isHovering, setIsHovering] = useState(false);

  // Smoother animation values
  const DOT_SMOOTHNESS = 0.3; // Increased from 0.2
  const BORDER_DOT_SMOOTHNESS = 0.15; // Increased from 0.1
  const BORDER_EXPAND_SIZE = 56; // Increased from 44
  const BORDER_NORMAL_SIZE = 36; // Increased from 28

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      "a, button, img, input, textarea, select, [data-cursor-hover]"
    );
    
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    let animationFrameId;
    const animate = () => {
      const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
      };

      // Smoother calculation with easing
      dotPosition.current.x = lerp(dotPosition.current.x, mousePosition.current.x, DOT_SMOOTHNESS);
      dotPosition.current.y = lerp(dotPosition.current.y, mousePosition.current.y, DOT_SMOOTHNESS);

      borderDotPosition.current.x = lerp(borderDotPosition.current.x, mousePosition.current.x, BORDER_DOT_SMOOTHNESS);
      borderDotPosition.current.y = lerp(borderDotPosition.current.y, mousePosition.current.y, BORDER_DOT_SMOOTHNESS);

      setRenderPos({
        dot: { x: dotPosition.current.x, y: dotPosition.current.y },
        border: { x: borderDotPosition.current.x, y: borderDotPosition.current.y },
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Inner dot - yellow */}
      <div
        className="absolute rounded-full bg-yellow-400 w-3 h-3 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${renderPos.dot.x}px`,
          top: `${renderPos.dot.y}px`,
          transition: 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      />

      {/* Outer circle - yellow with glow effect */}
      <div
        className={`absolute rounded-full border-2 border-yellow-400 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
          isHovering ? 'shadow-[0_0_15px_5px_rgba(234,179,8,0.3)]' : ''
        }`}
        style={{
          left: `${renderPos.border.x}px`,
          top: `${renderPos.border.y}px`,
          width: isHovering ? `${BORDER_EXPAND_SIZE}px` : `${BORDER_NORMAL_SIZE}px`,
          height: isHovering ? `${BORDER_EXPAND_SIZE}px` : `${BORDER_NORMAL_SIZE}px`,
          willChange: 'width, height, transform',
          transitionProperty: 'width, height, box-shadow',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  );
};

export default CustomCursor;
import { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const CountUp = ({ to, from = 0, duration = 1.5, suffix = "", prefix = "" }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [count, setCount] = useState(from);

  const springProps = useSpring({
    from: { number: from },
    to: { number: inView ? to : from },
    config: { duration: duration * 1000 },
  });

  return (
    <animated.span ref={ref}>
      {springProps.number.to(n => `${prefix}${Math.floor(n).toLocaleString()}${suffix}`)}
    </animated.span>
  );
};

export default CountUp;

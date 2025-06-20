'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface StatProps {
  value: string;
  label: string;
  color: string;
}

function CountUp({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function CountingStats() {
  const stats = [
    { value: "10K+", label: "Active Users", color: "#FF8C00" },
    { value: "1M+", label: "Transactions", color: "#4ECDC4" },
    { value: "50K+", label: "Events Created", color: "#FF69B4" },
    { value: "99%", label: "User Satisfaction", color: "#9B59B6" }
  ];

  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-6xl mx-auto">
      {stats.map((stat) => {
        const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
        const suffix = stat.value.replace(/[0-9]/g, '');

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center gap-2 p-6 rounded-xl backdrop-blur-md border hover:shadow-xl transition-all duration-300"
            style={{
              background: `linear-gradient(to bottom right, ${stat.color}15, ${stat.color}08)`,
              borderColor: `${stat.color}30`,
              boxShadow: `0 4px 24px -1px ${stat.color}15`,
            }}
          >
            <motion.div
              className="text-4xl font-bold"
              style={{ color: stat.color }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CountUp end={numericValue} suffix={suffix} />
            </motion.div>
            <motion.div
              className="text-sm text-gray-500"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {stat.label}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
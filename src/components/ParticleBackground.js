"use client";

import { useEffect, useState } from "react";

export default function ParticleBackground() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      // Increase the size range
      size: Math.random() * 10 + 4, // Now ranges from 5 to 20
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x:
            (particle.x + particle.speedX + window.innerWidth) %
            window.innerWidth,
          y:
            (particle.y + particle.speedY + window.innerHeight) %
            window.innerHeight,
        }))
      );
    };

    const intervalId = setInterval(animateParticles, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0">
      {particles.map((particle, index) => (
        <div
          key={index}
          // Adjust opacity for better visibility
          className="absolute rounded-full bg-teal-500 opacity-30"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
}

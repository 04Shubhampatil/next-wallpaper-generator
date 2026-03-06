"use client";
import React, { useEffect, useRef } from 'react';
import { animate, utils } from 'animejs';

const AnimatedBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const colors = [
            'rgba(59,130,246,0.15)',   // blue
            'rgba(168,85,247,0.15)',   // purple
            'rgba(34,211,238,0.12)',   // cyan
            'rgba(16,185,129,0.12)',   // emerald
        ];

        const particleCount = 18;
        const animations = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.borderRadius = '50%';
            particle.style.filter = 'blur(60px)';
            const size = utils.random(120, 400);
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${utils.random(0, 100)}%`;
            particle.style.top = `${utils.random(0, 100)}%`;
            particle.style.background = colors[i % colors.length];
            particle.style.opacity = '0';
            container.appendChild(particle);

            const anim = animate(particle, {
                translateX: { to: `${utils.random(-200, 200)}px`, ease: 'inOutQuad' },
                translateY: { to: `${utils.random(-200, 200)}px`, ease: 'inOutQuad' },
                scale: [{ to: utils.random(1, 1.8) }],
                opacity: [{ to: utils.random(0.15, 0.4) }],
                duration: utils.random(8000, 18000),
                loop: true,
                alternate: true,
                delay: utils.random(0, 3000),
            });
            animations.push(anim);
        }

        return () => {
            animations.forEach(a => a.pause());
            if (container) container.innerHTML = '';
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden', background: '#020617' }}
        />
    );
};

export default AnimatedBackground;

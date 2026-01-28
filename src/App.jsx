import React, { useState, useEffect, useRef } from 'react';
import Experience from './components/Experience';

import Gallery from './components/Gallery';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function App() {
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const noBtnRef = useRef(null);

  // Physics state for the No Button
  const noBtnPhysics = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  // Let's rewrite the whole useEffect block properly
  const mousePos = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId;

    // Physics Constants
    const SPRING_STIFFNESS = 0.05; // Strength of return to home
    const FRICTION = 0.85; // Damping to stop oscillation
    const REPEL_RADIUS = 150; // Activation distance
    const REPEL_FORCE = 2.0; // How hard it runs away

    const loop = () => {
      if (accepted) return;

      const p = noBtnPhysics.current; // {x, y, vx, vy}

      // 1. Spring Force (Pull towards 0,0)
      // F = -k * x
      const springFx = -p.x * SPRING_STIFFNESS;
      const springFy = -p.y * SPRING_STIFFNESS;

      // 2. Repel Force (Push away from Mouse)
      let repelFx = 0;
      let repelFy = 0;

      if (noBtnRef.current) {
        // Current button center in screen space
        // We need the BASE center (home) + current translation
        // Actually simpler: Calculate where it IS, determine vector from mouse
        const rect = noBtnRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = centerX - mousePos.current.x;
        const dy = centerY - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS) {
          // Calculate force magnitude based on proximity (closer = stronger)
          const force = (REPEL_RADIUS - dist) * REPEL_FORCE;
          const angle = Math.atan2(dy, dx);
          repelFx = Math.cos(angle) * force;
          repelFy = Math.sin(angle) * force;
        }
      }

      // 3. Integrate Velocity
      p.vx += springFx + repelFx;
      p.vy += springFy + repelFy;

      // 4. Apply Friction
      p.vx *= FRICTION;
      p.vy *= FRICTION;

      // 5. Update Position
      p.x += p.vx;
      p.y += p.vy;

      // Apply to State (or directly to DOM for performance, but State is React-y)
      // For 60fps smoothness without React render overhead, typically we'd set DOM transform,
      // but `setNoBtnPos` triggers re-render. 
      // Given the complexity, let's try direct DOM manipulation or stick to state if performance allows.
      // React state at 60fps might be heavy but this app is simple.
      // Let's use setNoBtnPos for now as it binds to the motion component.

      // Threshold for "sleep" to avoid infinite renders
      if (Math.abs(p.vx) > 0.01 || Math.abs(p.vy) > 0.01 || Math.abs(p.x) > 0.1 || Math.abs(p.y) > 0.1) {
        setNoBtnPos({ x: p.x, y: p.y });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [accepted]);

  const handleYes = () => {
    setAccepted(true);
    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff0a54', '#ff4d6d', '#ffae00'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff0a54', '#ff4d6d', '#ffae00'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  return (
    <div className="app-container" style={{ position: 'relative', width: '100vw', background: '#000' }}>

      {/* Hero Section */}
      <section style={{ height: '100vh', width: '100%', position: 'relative' }}>
        <Experience />

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2vh 0',
          zIndex: 10,
          pointerEvents: 'none' // Let mouse through to 3D if needed, though mostly for visual
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            color: 'var(--color-primary)',
            textShadow: '0 0 30px rgba(255, 10, 84, 0.4)',
            margin: 0
          }}>
            Hi Nonnie...
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2.5, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              color: 'var(--color-text)',
              fontSize: '0.9rem',
              letterSpacing: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            Scroll
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery />

      {/* The Question */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(to bottom, transparent, #0a0002)'
      }}>
        <AnimatePresence>
          {!accepted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <h2 style={{
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                marginBottom: '4rem',
                background: 'linear-gradient(to right, #ff0a54, #ffae00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Will you be my Valentine?
              </h2>

              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn"
                  style={{
                    fontSize: '1.8rem',
                    padding: '1.2rem 4rem',
                    background: 'linear-gradient(45deg, #ff0a54, #ff477e)',
                    border: 'none',
                    pointerEvents: 'auto'
                  }}
                  onClick={handleYes}
                >
                  YES ❤️
                </button>

                <motion.button
                  ref={noBtnRef}
                  className="btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '1.2rem',
                    padding: '1rem 3rem',
                    pointerEvents: 'auto'
                  }}
                  animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                  transition={{ type: "spring", stiffness: 600, damping: 25 }}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <h1 style={{ fontSize: '7rem', color: 'var(--color-accent)', textShadow: '0 0 50px rgba(255, 174, 0, 0.6)' }}>
                YAY! ❤️
              </h1>
              <p style={{ fontSize: '2.5rem', marginTop: '1rem', fontStyle: 'italic' }}>
                I love you Nonnie!
              </p>
              <img
                src="./images/nonnie12.png"
                alt="Us"
                style={{
                  marginTop: '4rem',
                  maxWidth: '90vw',
                  width: '450px',
                  borderRadius: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 0 100px rgba(255, 10, 84, 0.4)'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default App;

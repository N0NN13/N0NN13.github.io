import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Memory data with corrected text
const memories = [
    { img: 'nonnie1.png', text: "This was the final picture we took together before I left Stellenbosch. It makes me sad looking at it because it reminds me of having to leave, but I wouldn't feel so sad if you weren't so important to me." },
    { img: 'nonnie2.png', text: "One of my favorite memories in Stellenbosch was the weekends where we would just stay in bed all day and talk. Every morning, you made getting out of bed and ready pretty difficult for me. :)" },
    { img: 'nonnie3.jpg', text: "I knew right here in this moment that I could be authentic with you. You were willing to pig out on a ton of food with me and then take this cheesy photo, and I thought to myself, \"This is the woman for me\"." },
    { img: 'nonnie4.png', text: "I loved this weekend! We stayed inside all day, and because of the rain you didn't want to go home to grab your stuff, so I had you wearing my frat letters." },
    { img: 'nonnie5.png', text: "I always loved taking these quirky photos with you. You always gave the biggest grin whenever I would make that dopey face, but I would keep doing it because I love your smile." },
    { img: 'nonnie6.png', text: "This was on First Thursdays. I liked this photo because it was when we were trying to find food because we left late. We ended up on the rooftop bar which was kind of mid, but it reminds me of the Mexican place we ended up eating at, which felt like a taste of home for me. I loved getting to share it with you." },
    { img: 'nonnie7.jpg', text: "This was the photoshoot we took before First Thursdays. I loved it; we both got to get new outfits, new jewelry, and those sunglasses. That entire date shopping made me realize \"I want to provide for her\", and I had never had that realization in a relationship before. So even though that night carried a mixed bag of emotions, that realization stuck with me." },
    { img: 'nonnie8.jpg', text: "This was the photoshoot we took before First Thursdays. I loved it; we both got to get new outfits, new jewelry, and those sunglasses. That entire date shopping made me realize \"I want to provide for her\", and I had never had that realization in a relationship before. So even though that night carried a mixed bag of emotions, that realization stuck with me." },
    { img: 'nonnie9.jpg', text: "This was the photoshoot we took before First Thursdays. I loved it; we both got to get new outfits, new jewelry, and those sunglasses. That entire date shopping made me realize \"I want to provide for her\", and I had never had that realization in a relationship before. So even though that night carried a mixed bag of emotions, that realization stuck with me." },
    { img: 'nonnie10.png', text: "This was a picture we took on the day we made out for like 10 hours straight. I had never done it for that long before, so by the end of the day, our lips were chapped and it kind of hurt to smile, but it felt like it was just you and me that day with everything else a world away." },
    { img: 'nonnie11.png', text: "I knew I was velcroed to you that whole time, but it never really hit me until I was going back over our pictures and found this. I was quite literally glued to your side. :)" },
    { img: 'nonnie12.png', text: "And last but not least (even if the picture quality is), is our trip to the wine farm. It was the first proper date I got to take you on, and I'd say this is when I started falling head over heels for you." }
];

export default function Gallery() {
    const [index, setIndex] = useState(0);

    const nextImage = () => {
        setIndex((prev) => (prev + 1) % memories.length);
    };

    const prevImage = () => {
        setIndex((prev) => (prev - 1 + memories.length) % memories.length);
    };

    const [visiblePrev, visibleCurr, visibleNext] = [
        (index - 1 + memories.length) % memories.length,
        index,
        (index + 1) % memories.length
    ];

    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(to bottom, #0a0002, #1a050a)'
        }}>
            <h2 style={{
                fontSize: '3rem',
                marginBottom: '2rem',
                color: 'var(--color-secondary)',
                textShadow: '0 0 20px rgba(255, 71, 126, 0.5)',
                textAlign: 'center'
            }}>
                Memories
            </h2>

            {/* Content Container: Grid for Desktop (Side-by-Side), Flex col for mobile */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4rem',
                width: '100%',
                maxWidth: '1200px'
            }}>

                {/* Left Side: Description Text */}
                <div style={{ flex: '1 1 300px', maxWidth: '400px', textAlign: 'left' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index} // Key change triggers animation
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p style={{
                                fontSize: '1.5rem',
                                lineHeight: '1.6',
                                color: 'var(--color-text)',
                                borderLeft: '4px solid var(--color-primary)',
                                paddingLeft: '1.5rem'
                            }}>
                                {memories[index].text}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: 3D Carousel */}
                <div style={{ flex: '1 1 400px', position: 'relative', height: '400px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '300px', height: '100%' }}>
                        <AnimatePresence mode="popLayout">
                            {/* Previous Image */}
                            <motion.div
                                key={`prev-${visiblePrev}`}
                                initial={{ x: -100, scale: 0.8, opacity: 0, z: -100 }}
                                animate={{ x: -220, scale: 0.8, opacity: 0.3, z: -100, rotateY: 25 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}
                            >
                                <img src={`./images/${memories[visiblePrev].img}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
                            </motion.div>

                            {/* Current Image */}
                            <motion.div
                                key={`curr-${visibleCurr}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ x: 0, scale: 1, opacity: 1, z: 10, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 0 30px rgba(255, 10, 84, 0.6)',
                                    border: '2px solid rgba(255, 255, 255, 0.5)',
                                    zIndex: 5
                                }}
                            >
                                <img src={`./images/${memories[visibleCurr].img}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>

                            {/* Next Image */}
                            <motion.div
                                key={`next-${visibleNext}`}
                                initial={{ x: 100, scale: 0.8, opacity: 0, z: -100 }}
                                animate={{ x: 220, scale: 0.8, opacity: 0.3, z: -100, rotateY: -25 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}
                            >
                                <img src={`./images/${memories[visibleNext].img}`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                <button className="btn" onClick={prevImage} style={{ padding: '1rem 1.5rem', borderRadius: '50%' }}>←</button>
                <button className="btn" onClick={nextImage} style={{ padding: '1rem 1.5rem', borderRadius: '50%' }}>→</button>
            </div>
        </section>
    );
}

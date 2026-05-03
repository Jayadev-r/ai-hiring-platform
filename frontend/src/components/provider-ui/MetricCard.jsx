import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'blue' }) => {
    const cardRef = useRef(null);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth the tilt
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    // Map mouse position to rotation (max 8 degrees tilt)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    useEffect(() => {
        const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [value, count]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate mouse position relative to center of card (-0.5 to 0.5)
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / rect.width) - 0.5;
        const yPct = (mouseY / rect.height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        // Reset to flat
        x.set(0);
        y.set(0);
    };

    return (
        <div className="card-3d" style={{ perspective: '1000px' }}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="provider-panel p-6 bg-white relative overflow-hidden group h-full flex flex-col justify-between"
            >
                {/* Spotlight effect follows mouse (simulated with large blurred radial div) */}
                <motion.div
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300"
                    style={{
                        background: useTransform(
                            [x, y],
                            ([latestX, latestY]) => `radial-gradient(400px circle at ${(latestX + 0.5) * 100}% ${(latestY + 0.5) * 100}%, rgba(37,99,235,0.08), transparent 40%)`
                        )
                    }}
                />

                <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">{title}</p>
                        <motion.h3
                            className="text-3xl font-black font-mono text-slate-900 tracking-tighter"
                            style={{ transform: "translateZ(20px)" }} // Pop out effect
                        >
                            {rounded}
                        </motion.h3>
                    </div>
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        <Icon className="w-5 h-5" />
                    </div>
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                    {trend !== undefined && trend !== null ? (
                        <>
                            <span className={`flex items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-black tracking-widest ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : trend < 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                                {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                {Math.abs(trend).toFixed(1)}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trendLabel}</span>
                        </>
                    ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Real-time sync active</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default MetricCard;

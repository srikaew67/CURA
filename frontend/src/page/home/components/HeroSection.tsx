import { Link } from 'react-router-dom'

const HeroSection = () => {
    return (
        <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-10 pt-24 pb-28">

            {/* Badge */}
            <div
                className="animate-fadeInUp delay-100 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 glass-card"
                style={{ color: "rgba(165,180,252,0.9)" }}
            >
                <span
                    className="w-2 h-2 rounded-full"
                    style={{
                        background: "#4f6ef7",
                        boxShadow: "0 0 8px #4f6ef7",
                        animation: "pulse-slow 2s ease-in-out infinite",
                    }}
                />
                AI-Powered Customer Support
            </div>

            {/* Headline */}
            <h1
                className="animate-fadeInUp delay-200 font-extrabold leading-tight mb-6"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", maxWidth: "820px" }}
            >
                The AI Agent that
                <span className="block gradient-text mt-2">Truly Understands.</span>
            </h1>

            {/* Subheading */}
            <p
                className="animate-fadeInUp delay-300 font-light max-w-lg mb-10 leading-relaxed"
                style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.55)" }}
            >
                A smart chat AI that talks to your customers, solves their problems,
                and never sleeps — so your team doesn't have to.
            </p>

            {/* CTA buttons */}
            <div className="animate-fadeInUp delay-400 flex flex-wrap items-center justify-center gap-4 mb-20">
                <Link
                    to="/demo"
                    className="btn-primary px-8 py-3.5 rounded-full font-semibold text-base"
                    style={{ color: "#fff" }}
                >
                    Try Live Demo →
                </Link>
                <a
                    href="#services"
                    className="px-8 py-3.5 rounded-full font-semibold text-base glass-card transition-all duration-300"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                >
                    Learn More
                </a>
            </div>

            {/* Divider line */}
            <div
                className="w-px h-10 mb-10"
                style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)" }}
            />

            {/* Stats row */}
            <div className="animate-fadeInUp delay-500 flex flex-wrap items-center justify-center gap-12">
                {[
                    { value: "10x", label: "Faster Response" },
                    { value: "24/7", label: "Always Online" },
                    { value: "99%", label: "Satisfaction Rate" },
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-1.5">
                        <span className="text-3xl font-black gradient-text">{stat.value}</span>
                        <span className="text-xs tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.38)" }}>
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fadeIn delay-500"
                style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.65rem", letterSpacing: "0.18em" }}
            >
                <span>SCROLL</span>
                <div
                    className="w-px h-8"
                    style={{ background: "linear-gradient(to bottom, rgba(79,110,247,0.5), transparent)" }}
                />
            </div>
        </section>
    )
}

export default HeroSection

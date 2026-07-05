import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer
            className="w-full mt-20"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
            {/* CTA Band */}
            <div
                className="w-full flex flex-col items-center justify-center py-20 px-10 text-center relative overflow-hidden"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(79,110,247,0.1) 0%, transparent 70%)",
                }}
            >
                <h2
                    className="font-bold mb-4"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
                >
                    Ready to transform your{" "}
                    <span className="gradient-text">customer support?</span>
                </h2>
                <p
                    className="mb-8 max-w-sm"
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", lineHeight: 1.7 }}
                >
                    Join hundreds of businesses already using CURA to deliver exceptional experiences.
                </p>
                <Link
                    to="/demo"
                    className="btn-primary px-9 py-4 rounded-full font-semibold text-base"
                    style={{ color: "#fff" }}
                >
                    Get started free →
                </Link>
            </div>

            {/* Bottom bar */}
            <div
                className="flex flex-wrap items-center justify-between px-10 py-5 gap-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
                <div className="flex items-center gap-2 font-bold text-sm tracking-widest">
                    <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black"
                        style={{ background: "linear-gradient(135deg, #4f6ef7, #8b5cf6)" }}
                    >
                        C
                    </span>
                    <span className="gradient-text">CURA</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Beyond Chat. Beyond Care.
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    © {new Date().getFullYear()} CURA. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer

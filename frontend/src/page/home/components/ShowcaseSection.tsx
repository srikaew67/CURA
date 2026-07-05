import { Link } from 'react-router-dom'

const chatMessages = [
    { role: "user", text: "Hi! I placed an order 3 days ago but haven't received any tracking info." },
    { role: "bot",  text: "Hi there! 👋 Let me look that up for you right away. Could you share your order number?" },
    { role: "user", text: "Sure, it's #ORD-58291." },
    { role: "bot",  text: "Found it! Your order shipped yesterday via FedEx. Tracking: FX92041839. Estimated arrival: Tomorrow by 8 PM 🎉" },
]

const ShowcaseSection = () => {
    return (
        <section className="w-full flex flex-col items-center px-10 py-24">

            {/* Section label */}
            <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 glass-card"
                style={{ color: "rgba(165,180,252,0.85)" }}
            >
                ✦ Smart Chat AI
            </div>

            {/* Heading */}
            <h2
                className="font-bold text-center mb-3"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", maxWidth: "600px" }}
            >
                Support customers{" "}
                <span className="gradient-text">instantly &amp; intelligently</span>
            </h2>

            {/* Subtext */}
            <p
                className="text-center mb-16 max-w-md"
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", lineHeight: 1.75 }}
            >
                From product guidance to order support, CURA works around the clock
                to give your customers the best support experience.
            </p>

            {/* Two-column layout */}
            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 px-4">

                {/* Left: value props */}
                <div className="flex-1 flex flex-col gap-5">
                    {[
                        {
                            icon: "⚡",
                            title: "< 1s Response Time",
                            desc: "Customers never wait. CURA replies faster than any human agent.",
                        },
                        {
                            icon: "🎯",
                            title: "High Accuracy",
                            desc: "Trained on your knowledge base so answers are always relevant and correct.",
                        },
                        {
                            icon: "🔄",
                            title: "Seamless Handoff",
                            desc: "When a human touch is needed, CURA gracefully escalates to your team.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 glass-card"
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(79,110,247,0.3)"
                                e.currentTarget.style.transform = "translateX(4px)"
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = ""
                                e.currentTarget.style.transform = ""
                            }}
                        >
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                style={{ background: "rgba(79,110,247,0.12)" }}
                            >
                                {item.icon}
                            </div>
                            <div className="flex flex-col gap-1 pt-0.5">
                                <h4 className="font-semibold text-sm">{item.title}</h4>
                                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.65 }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}

                    <Link
                        to="/demo"
                        className="btn-primary self-start px-7 py-3 rounded-full font-semibold text-sm mt-3"
                        style={{ color: "#fff" }}
                    >
                        See it in action →
                    </Link>
                </div>

                {/* Right: mock chat UI */}
                <div
                    className="flex-1 glass-card rounded-3xl p-6 flex flex-col gap-4 max-w-md w-full"
                    style={{
                        boxShadow: "0 0 60px rgba(79,110,247,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
                        minHeight: "400px",
                    }}
                >
                    {/* Chat header */}
                    <div
                        className="flex items-center gap-3 pb-4"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #4f6ef7, #8b5cf6)" }}
                        >
                            C
                        </div>
                        <div>
                            <p className="text-sm font-semibold">CURA Assistant</p>
                            <p className="text-xs flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                                Online
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex flex-col gap-3 flex-1 pt-1">
                        {chatMessages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                    style={{
                                        maxWidth: "82%",
                                        ...(msg.role === "bot"
                                            ? {
                                                background: "rgba(79,110,247,0.14)",
                                                border: "1px solid rgba(79,110,247,0.2)",
                                                borderBottomLeftRadius: "6px",
                                              }
                                            : {
                                                background: "rgba(255,255,255,0.08)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderBottomRightRadius: "6px",
                                              }),
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        <div className="flex justify-start mt-1">
                            <div
                                className="px-4 py-3 rounded-2xl rounded-bl-sm"
                                style={{
                                    background: "rgba(79,110,247,0.10)",
                                    border: "1px solid rgba(79,110,247,0.16)",
                                }}
                            >
                                <div className="flex gap-1 items-center h-4">
                                    {[0, 1, 2].map(d => (
                                        <span
                                            key={d}
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                background: "rgba(165,180,252,0.65)",
                                                animation: "pulse-slow 1.2s ease-in-out infinite",
                                                animationDelay: `${d * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShowcaseSection

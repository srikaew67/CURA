const features = [
    {
        icon: "💬",
        title: "Instant Replies",
        description:
            "Respond to every customer message in milliseconds. No queues, no wait times — just instant, accurate answers.",
    },
    {
        icon: "🧠",
        title: "Context-Aware AI",
        description:
            "CURA understands the full conversation history and user intent, delivering replies that feel genuinely human.",
    },
    {
        icon: "🔌",
        title: "Easy Integration",
        description:
            "Plug CURA into your existing helpdesk, CRM, or website in minutes with our simple API and no-code widgets.",
    },
    {
        icon: "📊",
        title: "Real-Time Analytics",
        description:
            "Monitor chat performance, sentiment trends, and resolution rates in a beautiful live dashboard.",
    },
    {
        icon: "🌐",
        title: "Multilingual Support",
        description:
            "Serve customers in over 50 languages automatically, breaking down language barriers with ease.",
    },
    {
        icon: "🔒",
        title: "Enterprise Security",
        description:
            "Bank-grade encryption, SOC 2 compliance, and full data privacy controls built in from day one.",
    },
]

const ServiceSection = () => {
    return (
        <section id="services" className="w-full flex flex-col items-center px-10 py-24">

            {/* Section label */}
            <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 glass-card"
                style={{ color: "rgba(165,180,252,0.85)" }}
            >
                ✦ Our Services
            </div>

            {/* Heading */}
            <h2
                className="font-bold text-center mb-3"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", maxWidth: "560px" }}
            >
                Everything you need to{" "}
                <span className="gradient-text">delight customers</span>
            </h2>

            {/* Subtext */}
            <p
                className="text-center mb-14 max-w-md"
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", lineHeight: 1.75 }}
            >
                CURA brings together powerful AI capabilities into one seamless platform.
            </p>

            {/* Feature grid */}
            <div
                className="grid gap-4 w-full max-w-6xl px-4"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            >
                {features.map((f) => (
                    <div
                        key={f.title}
                        className="glass-card rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 cursor-default"
                        onMouseEnter={e => {
                            const el = e.currentTarget
                            el.style.background = "rgba(79,110,247,0.08)"
                            el.style.borderColor = "rgba(79,110,247,0.25)"
                            el.style.transform = "translateY(-4px)"
                            el.style.boxShadow = "0 8px 40px rgba(79,110,247,0.12)"
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget
                            el.style.background = ""
                            el.style.borderColor = ""
                            el.style.transform = ""
                            el.style.boxShadow = ""
                        }}
                    >
                        {/* Icon */}
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                            style={{ background: "rgba(79,110,247,0.12)" }}
                        >
                            {f.icon}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold text-base">{f.title}</h3>
                            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                                {f.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ServiceSection

import Background from "./components/Background"
import HeroSection from "./components/HeroSection"
import ServiceSection from "./components/ServiceSection"
import ShowcaseSection from "./components/ShowcaseSection"
import Footer from "../../shared/Footer"

const HomePage = () => {
    return (
        <div className="min-h-screen">
            <Background />
            <HeroSection />
            <ServiceSection />
            <ShowcaseSection />
            <Footer />
        </div>
    )
}

export default HomePage

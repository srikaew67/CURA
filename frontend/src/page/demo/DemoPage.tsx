import ChatSection from './components/ChatSection';

const DemoPage = () => {
    return (
        <section className="w-screen h-screen bg-black flex justify-center pt-[10%]">
            <div className="w-[80%] h-[70%] max-w-8xl bg-black rounded-xl border border-gray-500 overflow-hidden">
                <ChatSection />
            </div>
        </section>
    );
};

export default DemoPage;

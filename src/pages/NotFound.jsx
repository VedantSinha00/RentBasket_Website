import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import kuMascot from "@/assets/Ku_standing_proud.png";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-mint-pale/40 px-4 py-16 md:py-24">
                <div className="text-center max-w-md mx-auto">
                    <img
                        src={kuMascot}
                        alt=""
                        aria-hidden="true"
                        className="w-24 h-24 md:w-28 md:h-28 object-contain mx-auto mb-6"
                    />
                    <p className="text-ink-muted font-semibold text-sm mb-2">404</p>
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mb-3">
                        This page seems to have moved out.
                    </h1>
                    <p className="text-ink-muted mb-8">
                        The link may be old, or the page was returned. Everything we're still renting is in the catalogue.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/catalog" className="btn-pine w-full sm:w-auto">
                            Browse Catalogue
                        </Link>
                        <Link to="/" className="btn-outline-pine w-full sm:w-auto">
                            Go home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;

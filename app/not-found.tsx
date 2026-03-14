import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import TopHeader from "@/components/common/top-header"
import Image from "next/image"
import Link from "next/link"
import { Home, ArrowRight } from "lucide-react";
import QuoteButton from "@/components/common/quote-button"

export default function Error404() {

    return (
        <div>
            <TopHeader />
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center px-4 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-xl opacity-100" />kk
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/50 rounded-full blur-3xl opacity-100" />
                </div>

                <div className="max-w-2xl w-full text-center space-y-2 animate-fade-in-scale">

                    {/* 404 Large Text */}
                    <div className="space-y-4">
                        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold text-primary relative inline-block w-full">
                            <span className="relative z-10">404</span>
                            <div className="absolute inset-0 text-primary opacity-40 blur-lg">404</div>
                        </h1>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-2 leading-tight">
                            Page Not Found
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            The exhibition stand you're looking for seems to have disappeared from our venue. Let us help you find what you need.
                        </p>
                        <p className="text-base text-muted-foreground/70">
                            Error Code: 404 | Resource Not Available
                        </p>
                    </div>

                    {/* Decorative line */}
                    <div className="flex items-center gap-4 justify-center my-8">
                        <div className="h-px bg-gradient-to-r from-transparent to-primary/50 flex-1 max-w-xs" />
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="h-px bg-gradient-to-l from-transparent to-primary/50 flex-1 max-w-xs" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

                        <QuoteButton name="Back to Home" type="link" link="/" icon={<Home className="w-5 h-5" />} />
                        <QuoteButton name="Contact Support" type="link" link="/contant" icon={<ArrowRight className="w-5 h-5" />} />

                    </div>

                </div>
            </div>

            <Footer />
        </div>
    )
}

import TradeShowHero from "@/components/trade-show/tradeshow-hero"
import TradeShowDetailsSection from "@/components/trade-show/tradeshow-details"
import TopHeader from "@/components/common/top-header"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import ContactSection from "@/components/home/contact-section"
import { Globe } from "lucide-react"

interface PageProps {
    params: Promise<{ slug: string[] }>
}

export default async function TradeShowDetails(slug: PageProps) {

    let params = await slug.params
    let slug_value = params.slug[0]
    console.log("The params : ", params)
    console.log("The slug value : ", slug_value)


    return (
        <div>
            <TopHeader />
            <Header />
            <TradeShowHero
                slug={slug_value}
            />

            <TradeShowDetailsSection slug={slug_value} />
            <ContactSection />
            <Footer />
        </div>
    )
}
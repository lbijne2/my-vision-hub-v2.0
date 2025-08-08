import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AsyncFeaturedProjects, AsyncMiniRoadmap } from "@/components/AsyncComponents"

export default function HomePage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-vision-charcoal leading-tight">
              Where Vision
              <span className="block text-vision-ochre">Becomes Reality</span>
            </h1>
            
            <p className="text-xl text-vision-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              A personal and evolving digital platform that brings together creative, scientific, 
              and visionary work across multiple domains. Explore projects at the intersection 
              of medicine, AI, design, ethics, and the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="vision" 
                size="lg" 
                className="text-lg px-8 py-3"
                asChild
              >
                <Link href="/projects">
                  Explore Projects
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-vision-border text-vision-charcoal hover:bg-vision-ochre/10"
                asChild
              >
                <Link href="/blog">
                  Read Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <AsyncFeaturedProjects maxProjects={3} />

      {/* Mini Roadmap Section */}
      <section className="pt-0 pb-8 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <AsyncMiniRoadmap maxItems={3} />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vision-charcoal mb-4">
              Explore the Hub
            </h2>
            <p className="text-lg text-vision-charcoal/70 max-w-2xl mx-auto">
              Navigate through different sections of the platform to discover resources, 
              tools, and insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Resources",
                description: "Curated tools, frameworks, and references for your projects.",
                href: "/resources",
                color: "bg-pastel-sky border-vision-charcoal"
              },
              {
                title: "Agents",
                description: "Intelligent workflows and AI-powered tools to enhance your work.",
                href: "/agents", 
                color: "bg-pastel-lavender border-vision-charcoal"
              },
              {
                title: "Dashboard",
                description: "Private workspace for personal tools and quick access.",
                href: "/dashboard",
                color: "bg-pastel-mint border-vision-charcoal"
              }
            ].map((item) => (
              <Link 
                key={item.title}
                href={item.href}
                className={`block p-6 rounded-2xl border-2 ${item.color} hover:shadow-lg transition-all duration-300 group`}
              >
                <h3 className="text-xl font-semibold text-vision-charcoal mb-2 group-hover:text-vision-ochre transition-colors">
                  {item.title}
                </h3>
                <p className="text-vision-charcoal/70">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 
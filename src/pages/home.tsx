import { Button } from "@/components/ui/button"
import {
  Play,
  Music,
  Zap,
  Search,
  Volume2,
  ChevronRight,
  Star,
  ArrowRight,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react"

export default function MusicMateLanding() {
  const genres = ["Tech House", "EDM", "Drum & Bass", "Progressive House", "Techno", "Deep House", "Trance", "Dubstep"]

  const featuredSetlists = [
    {
      title: "John Summit @ Club Space Miami 2025",
      genre: "Tech House",
      duration: "2h 15m",
      tracks: 32,
    },
    {
      title: "Charlotte de Witte @ Tomorrowland 2024",
      genre: "Techno",
      duration: "1h 45m",
      tracks: 28,
    },
    {
      title: "Above & Beyond @ ABGT500",
      genre: "Trance",
      duration: "3h 00m",
      tracks: 45,
    },
  ]

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Club DJ",
      image: "/placeholder.svg?height=60&width=60",
      quote: "MusicMate has revolutionized how I prepare for gigs. The AI suggestions are spot-on!",
    },
    {
      name: "Sarah Chen",
      role: "Festival DJ",
      image: "/placeholder.svg?height=60&width=60",
      quote: "Finding the perfect tracks for my sets has never been easier. Game changer!",
    },
    {
      name: "Marcus Johnson",
      role: "Radio Host",
      image: "/placeholder.svg?height=60&width=60",
      quote: "The genre blending suggestions helped me discover my signature sound.",
    },
  ]

  const tools = [
    {
      icon: <Music className="h-8 w-8" />,
      title: "AI Set Planner",
      description: "Generate complete setlists based on your style, venue, and crowd energy",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Double Finder",
      description: "Discover tracks that mix perfectly with your current selection",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Gem Finder",
      description: "Uncover hidden gems and underground tracks in your preferred genres",
    },
    {
      icon: <Volume2 className="h-8 w-8" />,
      title: "Audio Enhancer",
      description: "AI-powered audio analysis and enhancement for optimal sound quality",
    },
  ]

  const blogPosts = [
    {
      title: "The Future of DJ Technology: AI in Music Curation",
      thumbnail: "/placeholder.svg?height=200&width=300",
      excerpt: "Explore how artificial intelligence is transforming the way DJs discover and mix music.",
    },
    {
      title: "Building the Perfect Tech House Set: A Guide",
      thumbnail: "/placeholder.svg?height=200&width=300",
      excerpt: "Learn the secrets of crafting seamless tech house sets that keep the dancefloor moving.",
    },
    {
      title: "Underground Gems: Finding Your Unique Sound",
      thumbnail: "/placeholder.svg?height=200&width=300",
      excerpt: "Discover techniques for finding those special tracks that set your sets apart.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MusicMate</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#tools" className="text-gray-300 hover:text-white transition-colors">
                Tools
              </a>
              <a href="#blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </a>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Effortlessly plan your next
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                DJ set with AI
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover new music, generate perfect setlists, and elevate your DJ game with our AI-powered platform
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Try MusicMate for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Logos */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-400 mb-8">Integrated with your favorite platforms</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-white">Beatport</div>
            <div className="text-2xl font-bold text-white">Bandcamp</div>
            <div className="text-2xl font-bold text-white">SoundCloud</div>
          </div>
        </div>
      </section>

      {/* Smart AI Prompting */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Smart AI Prompting</h2>
          <p className="text-gray-300 mb-8">Describe your set in a sentence and let our AI do the rest</p>
          <div className="relative">
            <Input
              placeholder="e.g., 'Create a progressive tech house set for a rooftop party at sunset'"
              className="w-full p-6 text-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl"
            />
            <Button className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Generate Set
              <Zap className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Genre Selection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Explore Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((genre, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:from-purple-800/50 hover:to-pink-800/50 transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">{genre}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Setlists */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Featured Setlists</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredSetlists.map((setlist, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
                      {setlist.genre}
                    </Badge>
                    <Play className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{setlist.title}</h3>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>{setlist.duration}</span>
                    <span>{setlist.tracks} tracks</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">What DJs Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Powerful DJ Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{tool.title}</h3>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Latest from the Blog</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                  <Button variant="ghost" className="text-purple-400 hover:text-purple-300 p-0">
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MusicMate</span>
              </div>
              <p className="text-gray-400 text-sm">Empowering DJs with AI-powered music discovery and set planning.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 MusicMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

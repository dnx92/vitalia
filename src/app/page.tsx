import Link from "next/link";
import { 
  Search, 
  Shield, 
  CreditCard, 
  Calendar, 
  Heart,
  Star,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  Phone,
  ChevronRight,
  Activity,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Shield,
    title: "Verified Doctors Only",
    description: "Every physician is licensed and credentialed. Your safety is our priority.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Your money is protected until services are rendered. 100% safe transactions.",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    icon: Calendar,
    title: "Instant Booking",
    description: "Book appointments in seconds. See real-time availability and confirm instantly.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
  },
  {
    icon: Heart,
    title: "Health Tracking",
    description: "Monitor your vitals, set medication reminders, and share with your doctor.",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
  {
    icon: Globe,
    title: "Top US Doctors",
    description: "Access America's best medical specialists. World-class healthcare, accessible.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our care team is always here for you. Get help anytime you need it.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "Austin, Texas",
    text: "I found an incredible cardiologist through Vitalia. The whole process was seamless, and I felt confident knowing the doctor was verified.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Michael Rodriguez",
    location: "Miami, Florida",
    text: "As a busy professional, Vitalia saved me so much time. I booked a specialist, paid securely, and had my appointment within days.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Jennifer Chen",
    location: "Seattle, Washington",
    text: "The health tracking feature is amazing. I can monitor my metrics and share them directly with my doctor during appointments.",
    rating: 5,
    avatar: "JC",
  },
];

const stats = [
  { value: "5,000+", label: "Verified Doctors", icon: Stethoscope },
  { value: "50+", label: "Specialties", icon: Activity },
  { value: "98%", label: "Satisfaction", icon: Star },
  { value: "24/7", label: "Support", icon: Clock },
];

const steps = [
  {
    number: "01",
    title: "Search Specialists",
    description: "Browse verified doctors by specialty, location, and availability. Read real patient reviews.",
  },
  {
    number: "02",
    title: "Book Appointment",
    description: "Select your preferred time and pay securely through our protected wallet system.",
  },
  {
    number: "03",
    title: "Get Treated",
    description: "Meet your doctor, get treated, and track your health progress all in one place.",
  },
];

const specialties = [
  "Cardiology", "Dermatology", "Orthopedics", "Neurology",
  "Primary Care", "Pediatrics", "Psychiatry", "Dentistry"
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50 pt-8 pb-20 lg:pt-16 lg:pb-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Trusted by 100,000+ patients
              </span>
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              America&apos;s Best Doctors,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                At Your Service
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Connect with top-verified medical specialists across the United States. 
              Book appointments, pay securely, and track your health—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all hover:shadow-xl hover:shadow-cyan-200">
                  <Search className="h-5 w-5 mr-2" />
                  Find a Doctor
                </Button>
              </Link>
              <Link href="/auth/register?role=professional">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 border-2 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50">
                  <Stethoscope className="h-5 w-5 mr-2 text-cyan-600" />
                  Are You a Doctor?
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Licensed Physicians</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Background Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur shadow-lg shadow-slate-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Find Care by Specialty
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From primary care to specialists, find the right doctor for your needs
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                href={`/search?specialty=${encodeURIComponent(specialty)}`}
                className="group"
              >
                <div className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 transition-all">
                  {specialty}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 bg-cyan-100 text-cyan-700">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How Vitalia Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Getting quality healthcare has never been easier. Three simple steps to better health.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                <div className="p-8 rounded-2xl bg-white shadow-lg shadow-slate-100 hover:shadow-xl transition-shadow">
                  <div className="text-5xl font-bold text-cyan-100 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-cyan-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 bg-violet-100 text-violet-700">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Healthcare You Can Trust
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We built Vitalia with one mission: making quality healthcare accessible, safe, and convenient.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`h-14 w-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-cyan-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4 bg-emerald-100 text-emerald-700">
              Patient Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
            Join thousands of Americans who trust Vitalia for their healthcare needs. 
            Your first appointment is just a few clicks away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 bg-white text-cyan-700 hover:bg-cyan-50 shadow-xl">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 text-white border-2 border-white/30 hover:bg-white/10">
                Browse Doctors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-900">HIPAA Compliant</p>
              <p className="text-sm text-slate-500">Your data is protected</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-cyan-500 mb-2" />
              <p className="font-semibold text-slate-900">Board Certified</p>
              <p className="text-sm text-slate-500">Verified specialists</p>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard className="h-8 w-8 text-violet-500 mb-2" />
              <p className="font-semibold text-slate-900">Secure Payment</p>
              <p className="text-sm text-slate-500">Protected transactions</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-blue-500 mb-2" />
              <p className="font-semibold text-slate-900">24/7 Support</p>
              <p className="text-sm text-slate-500">Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { 
  Search, Shield, CreditCard, Calendar, Heart, Star,
  Clock, CheckCircle, MapPin, Award, Phone, ChevronRight,
  Activity, Stethoscope, ArrowRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, title: "Verified Doctors Only", description: "Every physician is licensed and credentialed. Your safety is our priority.", color: "#10B981", bg: "bg-emerald-50" },
  { icon: CreditCard, title: "Secure Payments", description: "Your money is protected until services are rendered. 100% safe transactions.", color: "#8B5CF6", bg: "bg-violet-50" },
  { icon: Calendar, title: "Instant Booking", description: "Book appointments in seconds. See real-time availability and confirm instantly.", color: "#0057ff", bg: "bg-blue-50" },
  { icon: Heart, title: "Health Tracking", description: "Monitor your vitals, set reminders, and share with your doctor.", color: "#EC4899", bg: "bg-pink-50" },
  { icon: Activity, title: "Top US Doctors", description: "Access America's best medical specialists. World-class healthcare.", color: "#0057ff", bg: "bg-blue-50" },
  { icon: Clock, title: "24/7 Support", description: "Our care team is always here for you. Get help anytime.", color: "#F59E0B", bg: "bg-amber-50" },
];

const testimonials = [
  { name: "Sarah Mitchell", location: "Austin, Texas", text: "I found an incredible cardiologist through Vitalia. The whole process was seamless, and I felt confident knowing the doctor was verified.", avatar: "SM" },
  { name: "Michael Rodriguez", location: "Miami, Florida", text: "As a busy professional, Vitalia saved me so much time. I booked a specialist, paid securely, and had my appointment within days.", avatar: "MR" },
  { name: "Jennifer Chen", location: "Seattle, Washington", text: "The health tracking feature is amazing. I can monitor my metrics and share them directly with my doctor during appointments.", avatar: "JC" },
];

const stats = [
  { value: "5,000+", label: "Verified Doctors", icon: Stethoscope, color: "text-blue-600" },
  { value: "50+", label: "Specialties", icon: Activity, color: "text-emerald-600" },
  { value: "98%", label: "Satisfaction", icon: Star, color: "text-amber-500" },
  { value: "24/7", label: "Support", icon: Clock, color: "text-purple-600" },
];

const steps = [
  { number: "01", title: "Search Specialists", description: "Browse verified doctors by specialty, location, and availability. Read real patient reviews." },
  { number: "02", title: "Book Appointment", description: "Select your preferred time and pay securely through our protected wallet system." },
  { number: "03", title: "Get Treated", description: "Meet your doctor, get treated, and track your health progress all in one place." },
];

const specialties = ["Cardiology", "Dermatology", "Orthopedics", "Neurology", "Primary Care", "Pediatrics", "Psychiatry", "Dentistry"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-slate-50 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        
        <div className="main-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-blue-100 border border-blue-100 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Trusted by 100,000+ patients</span>
            </div>
            
            <h1 className="mb-6 tracking-tight">
              America&apos;s Best Doctors,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                At Your Service
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with top-verified medical specialists across the United States. 
              Book appointments, pay securely, and track your health—all in one place.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link href="/search">
                <Button size="lg" className="text-base px-8">
                  <Search className="w-5 h-5" />
                  Find a Doctor
                </Button>
              </Link>
              <Link href="/auth/register?role=professional">
                <Button variant="outline" size="lg" className="text-base px-8">
                  <Stethoscope className="w-5 h-5" />
                  Are You a Doctor?
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: CheckCircle, text: "Licensed Physicians" },
                { icon: Shield, text: "Background Checked" },
                { icon: CreditCard, text: "Secure Payments" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 text-center hover:-translate-y-1 transition-all duration-300">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALTIES SECTION */}
      <section className="py-20 bg-white">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="mb-4">Find Care by Specialty</h2>
            <p className="text-slate-500 font-medium">From primary care to specialists, find the right doctor for your needs</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                href={`/search?specialty=${encodeURIComponent(specialty)}`}
                className="px-6 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-full text-slate-700 hover:text-blue-600 font-semibold text-sm transition-all duration-200"
              >
                {specialty}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">Simple Process</span>
            <h2 className="mb-4">How Vitalia Works</h2>
            <p className="text-slate-500 font-medium">Getting quality healthcare has never been easier. Three simple steps to better health.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl font-bold text-blue-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-100 rounded-full items-center justify-center text-blue-400">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-sm font-semibold mb-4">Why Choose Us</span>
            <h2 className="mb-4">Healthcare You Can Trust</h2>
            <p className="text-slate-500 font-medium">We built Vitalia with one mission: making quality healthcare accessible, safe, and convenient.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: feature.bg }}>
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-semibold mb-4">Patient Stories</span>
            <h2>Loved by Thousands</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        </div>
        <div className="main-container relative z-10 text-center">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10">Join thousands of Americans who trust Vitalia for their healthcare needs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="secondary" size="lg" className="text-base px-8 bg-white text-blue-600 hover:bg-blue-50">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="text-base px-8 text-white border-white/50 hover:bg-white/10 hover:border-white">
                Browse Doctors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="main-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, color: "text-emerald-500", title: "HIPAA Compliant", desc: "Your data is protected" },
              { icon: Award, color: "text-blue-600", title: "Board Certified", desc: "Verified specialists" },
              { icon: CreditCard, color: "text-violet-500", title: "Secure Payment", desc: "Protected transactions" },
              { icon: Phone, color: "text-blue-600", title: "24/7 Support", desc: "Always here to help" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

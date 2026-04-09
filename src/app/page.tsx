import Link from "next/link";
import { 
  Search, Shield, CreditCard, Calendar, Heart, Star,
  Clock, CheckCircle, MapPin, Award, Phone, ChevronRight,
  Activity, Stethoscope, Users, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, title: "Verified Doctors Only", description: "Every physician is licensed and credentialed. Your safety is our priority.", color: "#10B981", bg: "bg-emerald-50" },
  { icon: CreditCard, title: "Secure Payments", description: "Your money is protected until services are rendered. 100% safe transactions.", color: "#8B5CF6", bg: "bg-violet-50" },
  { icon: Calendar, title: "Instant Booking", description: "Book appointments in seconds. See real-time availability and confirm instantly.", color: "#0066CC", bg: "bg-blue-50" },
  { icon: Heart, title: "Health Tracking", description: "Monitor your vitals, set reminders, and share with your doctor.", color: "#EC4899", bg: "bg-pink-50" },
  { icon: Globe, title: "Top US Doctors", description: "Access America's best medical specialists. World-class healthcare.", color: "#0066CC", bg: "bg-blue-50" },
  { icon: Clock, title: "24/7 Support", description: "Our care team is always here for you. Get help anytime.", color: "#F59E0B", bg: "bg-amber-50" },
];

const testimonials = [
  { name: "Sarah Mitchell", location: "Austin, Texas", text: "I found an incredible cardiologist through Vitalia. The whole process was seamless, and I felt confident knowing the doctor was verified.", avatar: "SM" },
  { name: "Michael Rodriguez", location: "Miami, Florida", text: "As a busy professional, Vitalia saved me so much time. I booked a specialist, paid securely, and had my appointment within days.", avatar: "MR" },
  { name: "Jennifer Chen", location: "Seattle, Washington", text: "The health tracking feature is amazing. I can monitor my metrics and share them directly with my doctor during appointments.", avatar: "JC" },
];

const stats = [
  { value: "5,000+", label: "Verified Doctors", icon: Stethoscope },
  { value: "50+", label: "Specialties", icon: Activity },
  { value: "98%", label: "Satisfaction", icon: Star },
  { value: "24/7", label: "Support", icon: Clock },
];

const steps = [
  { number: "01", title: "Search Specialists", description: "Browse verified doctors by specialty, location, and availability. Read real patient reviews." },
  { number: "02", title: "Book Appointment", description: "Select your preferred time and pay securely through our protected wallet system." },
  { number: "03", title: "Get Treated", description: "Meet your doctor, get treated, and track your health progress all in one place." },
];

const specialties = ["Cardiology", "Dermatology", "Orthopedics", "Neurology", "Primary Care", "Pediatrics", "Psychiatry", "Dentistry"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="main-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="w-4 h-4" />
              Trusted by 100,000+ patients
            </div>
            
            <h1>
              America&apos;s Best Doctors,{" "}
              <span>At Your Service</span>
            </h1>
            
            <p>
              Connect with top-verified medical specialists across the United States. 
              Book appointments, pay securely, and track your health—all in one place.
            </p>
            
            <div className="hero-buttons">
              <Link href="/search" className="btn btn-primary btn-lg">
                <Search className="w-5 h-5" />
                Find a Doctor
              </Link>
              <Link href="/auth/register?role=professional" className="btn btn-secondary btn-lg">
                <Stethoscope className="w-5 h-5" />
                Are You a Doctor?
              </Link>
            </div>
            
            <div className="trust-badges">
              <div className="trust-badge">
                <CheckCircle className="w-5 h-5" />
                Licensed Physicians
              </div>
              <div className="trust-badge">
                <CheckCircle className="w-5 h-5" />
                Background Checked
              </div>
              <div className="trust-badge">
                <CheckCircle className="w-5 h-5" />
                Secure Payments
              </div>
            </div>
          </div>
          
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALTIES SECTION */}
      <section className="section bg-white">
        <div className="main-container">
          <div className="section-header">
            <h2>Find Care by Specialty</h2>
            <p>From primary care to specialists, find the right doctor for your needs</p>
          </div>
          
          <div className="specialties-grid">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                href={`/search?specialty=${encodeURIComponent(specialty)}`}
                className="specialty-tag"
              >
                {specialty}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="main-container">
          <div className="section-header">
            <span className="section-badge" style={{ background: '#EBF5FF', color: '#0066CC' }}>Simple Process</span>
            <h2>How Vitalia Works</h2>
            <p>Getting quality healthcare has never been easier. Three simple steps to better health.</p>
          </div>
          
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="step-connector">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section bg-white">
        <div className="main-container">
          <div className="section-header">
            <span className="section-badge" style={{ background: '#F3E8FF', color: '#8B5CF6' }}>Why Choose Us</span>
            <h2>Healthcare You Can Trust</h2>
            <p>We built Vitalia with one mission: making quality healthcare accessible, safe, and convenient.</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card shadow-card">
                <div className="feature-icon" style={{ background: feature.bg }}>
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="main-container">
          <div className="section-header">
            <span className="section-badge" style={{ background: '#DCFCE7', color: '#22C55E' }}>Patient Stories</span>
            <h2>Loved by Thousands</h2>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div>
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-location">
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
      <section className="cta-section">
        <div className="main-container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of Americans who trust Vitalia for their healthcare needs.</p>
          <div className="cta-buttons">
            <Link href="/auth/register" className="btn btn-white btn-lg">
              Create Free Account
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/search" className="btn btn-outline-white btn-lg">
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="trust-row">
        <div className="main-container">
          <div className="trust-row-grid">
            <div className="trust-item">
              <Shield className="w-8 h-8" style={{ color: '#22C55E' }} />
              <h4>HIPAA Compliant</h4>
              <p>Your data is protected</p>
            </div>
            <div className="trust-item">
              <Award className="w-8 h-8" style={{ color: '#0066CC' }} />
              <h4>Board Certified</h4>
              <p>Verified specialists</p>
            </div>
            <div className="trust-item">
              <CreditCard className="w-8 h-8" style={{ color: '#8B5CF6' }} />
              <h4>Secure Payment</h4>
              <p>Protected transactions</p>
            </div>
            <div className="trust-item">
              <Phone className="w-8 h-8" style={{ color: '#0066CC' }} />
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { 
  Search, 
  Shield, 
  Wallet, 
  Calendar, 
  Heart,
  Star,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Search,
    title: "Find Trusted Professionals",
    description: "Search verified medical professionals by specialty, location, and availability. All credentials verified.",
  },
  {
    icon: Shield,
    title: "Verified Credentials",
    description: "Every professional undergoes a thorough document verification process before joining our platform.",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    description: "Your money is held safely until services are completed. Withdraw earnings easily as a professional.",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book appointments with real-time availability. Get reminders before your scheduled visits.",
  },
  {
    icon: Heart,
    title: "Health Tracking",
    description: "Monitor your health metrics, get alerts for abnormal values, and share data with your doctor.",
  },
  {
    icon: Globe,
    title: "International Reach",
    description: "Access medical professionals from around the world. Healthcare without borders.",
  },
];

const testimonials = [
  {
    name: "María García",
    location: "Mexico City",
    text: "I found an amazing cardiologist from Spain through Vitalia. The whole process was seamless and the doctor was fantastic.",
    rating: 5,
  },
  {
    name: "John Smith",
    location: "New York, USA",
    text: "As a medical professional, Vitalia helped me reach patients I never could before. Great platform!",
    rating: 5,
  },
  {
    name: "Ana Rodríguez",
    location: "Buenos Aires",
    text: "The health tracking feature is incredible. I can monitor my diabetes metrics and share them directly with my doctor.",
    rating: 5,
  },
];

const stats = [
  { value: "10,000+", label: "Verified Professionals" },
  { value: "50+", label: "Countries" },
  { value: "100,000+", label: "Appointments" },
  { value: "4.9/5", label: "Average Rating" },
];

const specialties = [
  "Cardiology", "Dermatology", "Orthopedics", "Neurology",
  "Pediatrics", "Ophthalmology", "General Medicine", "Dentistry"
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-[--primary]/5 to-[--background] py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[--primary]/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[--secondary]/10 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="default" className="mb-4">
              Your Health Without Borders
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-[--text-primary] sm:text-5xl lg:text-6xl">
              Find the Right Medical Care,{" "}
              <span className="text-[--primary]">Anywhere in the World</span>
            </h1>
            <p className="mt-6 text-lg text-[--text-secondary] max-w-2xl mx-auto">
              Connect with verified medical professionals globally. Book appointments, 
              track your health, and manage your healthcare journey—all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/search">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Find a Doctor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register?role=professional">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Join as Professional
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:max-w-4xl lg:mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[--primary] sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-[--text-muted]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[--text-primary]">
              Browse by Specialty
            </h2>
            <p className="mt-2 text-[--text-secondary]">
              Find specialists in the field you need
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((specialty) => (
              <Link
                key={specialty}
                href={`/search?specialty=${encodeURIComponent(specialty)}`}
              >
                <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-[--primary]/5 cursor-pointer">
                  {specialty}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[--text-primary]">
              Why Choose Vitalia?
            </h2>
            <p className="mt-4 text-lg text-[--text-secondary] max-w-2xl mx-auto">
              We make international healthcare accessible, secure, and convenient
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="h-12 w-12 rounded-[--radius-lg] bg-[--primary]/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-[--primary]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[--text-primary] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[--text-secondary]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[--text-primary]">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-[--text-secondary]">
              Trusted by patients and professionals worldwide
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-[--surface]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[--accent] text-[--accent]" />
                    ))}
                  </div>
                  <p className="text-[--text-secondary] mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-[--primary]/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-[--primary]">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[--text-primary]">
                        {testimonial.name}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-[--text-muted]">
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

      <section className="py-20 bg-[--primary]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of patients and medical professionals on Vitalia. 
              Your health journey starts here.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white hover:text-[--primary]">
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-[--radius-md] bg-[--success]/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-[--success]" />
              </div>
              <div>
                <h3 className="font-semibold text-[--text-primary]">Verified Professionals</h3>
                <p className="mt-1 text-sm text-[--text-secondary]">
                  All doctors and specialists verified before joining
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-[--radius-md] bg-[--success]/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-[--success]" />
              </div>
              <div>
                <h3 className="font-semibold text-[--text-primary]">24/7 Support</h3>
                <p className="mt-1 text-sm text-[--text-secondary]">
                  Our team is always here to help you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-[--radius-md] bg-[--success]/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-[--success]" />
              </div>
              <div>
                <h3 className="font-semibold text-[--text-primary]">Secure Payments</h3>
                <p className="mt-1 text-sm text-[--text-secondary]">
                  Your money is protected until service is delivered
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

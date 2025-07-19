import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, BarChart3, Shield, ArrowRight, CheckCircle, Star, Award, Globe, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Maternal Health Monitoring",
      description: "Comprehensive tracking of maternal health indicators with real-time alerts"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Health Coverage",
      description: "Monitor health data across villages, blocks, and districts seamlessly"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "AI-powered insights and predictive analytics for better health outcomes"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Compliant",
      description: "Bank-grade security with role-based access and data privacy protection"
    }
  ];

  const stats = [
    { number: "50K+", label: "Families Monitored", icon: <Users className="w-6 h-6" /> },
    { number: "200+", label: "Health Centers", icon: <Heart className="w-6 h-6" /> },
    { number: "15", label: "Districts Covered", icon: <Globe className="w-6 h-6" /> },
    { number: "99.9%", label: "System Uptime", icon: <Zap className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "District Health Officer",
      content: "This system has revolutionized how we monitor rural health. The real-time data helps us make informed decisions quickly.",
      rating: 5
    },
    {
      name: "Ram Kumar",
      role: "Gram Panchayat Secretary",
      content: "Easy to use interface and comprehensive reporting. It has made our monthly health data collection so much more efficient.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
  {/* Faint blended background image */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: "url('/dist/assets/gp2.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.18,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
  {/* Existing blue/green gradients and blobs */}
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-transparent to-green-600/20"></div>
  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full"></div>
</div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img
                src="/dist/assets/logo.png"
                alt="Logo"
                className="w-12 h-12 rounded-xl border-2 border-blue-400 shadow-md bg-white object-contain"
              />
              <div>
                <span className="text-2xl font-bold text-white">Rural Health Monitor</span>
                <p className="text-blue-200 text-sm">Transforming Healthcare</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="font-semibold">Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Animated background blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob1 z-0" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-blob2 z-0" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 relative z-10">
          <div className="relative w-full max-w-xs md:max-w-sm mb-8 md:mb-0 animate-fadein-slideup" style={{ animationDelay: '0.1s' }}>
            <img
              src="/dist/assets/gp2.png"
              alt="Gram Panchayat Office"
              className="w-full h-[260px] object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-900/40 via-transparent to-green-400/10 pointer-events-none" />
          </div>
          <div className="flex-1 text-center md:text-left bg-white/80 rounded-2xl shadow-xl border border-blue-100 p-8 md:p-12 backdrop-blur-md animate-fadein-slideup" style={{ animationDelay: '0.25s' }}>
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-700 text-sm font-medium backdrop-blur-sm border border-blue-400/30 animate-fadein" style={{ animationDelay: '0.4s' }}>
                <Award className="w-4 h-4 mr-2" />
                 Health Monitoring Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-8 leading-tight drop-shadow animate-fadein-slideup" style={{ animationDelay: '0.35s' }}>
              Transforming
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent block">
                Rural Healthcare
              </span>
              <span className="text-4xl md:text-5xl">Monitoring</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-800 mb-10 max-w-3xl mx-auto leading-relaxed animate-fadein" style={{ animationDelay: '0.45s' }}>
              Comprehensive health monitoring system for rural communities. Track maternal health, child nutrition, immunization, and infectious diseases with real-time data collection, AI-powered analytics, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.07] animate-fadein"
                style={{ animationDelay: '0.55s' }}
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <button className="border-2 border-blue-400/30 text-blue-700 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 backdrop-blur-sm animate-fadein" style={{ animationDelay: '0.65s' }}>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadein {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadein-slideup {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: none; }
          }
          @keyframes blob1 {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.1) translateY(20px); }
          }
          @keyframes blob2 {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.08) translateY(-18px); }
          }
          .animate-fadein { animation: fadein 0.7s both; }
          .animate-fadein-slideup { animation: fadein-slideup 0.8s both; }
          .animate-blob1 { animation: blob1 7s ease-in-out infinite alternate; }
          .animate-blob2 { animation: blob2 8s ease-in-out infinite alternate; }
        `}</style>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-4 text-blue-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Comprehensive Health Monitoring
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our platform provides end-to-end health monitoring solutions with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-300 mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring Modules */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Health Monitoring Modules
            </h2>
            <p className="text-xl text-blue-100">
              Track critical health indicators across all demographics
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Maternal Health Tracking",
              "Child Immunization Records", 
              "Malnutrition Monitoring",
              "Infectious Disease Surveillance",
              "Adolescent Health Programs",
              "Sanitation & Hygiene Tracking",
              "TB & Leprosy Patient Management",
              "Under-age Marriage Prevention",
              "High-Risk Pregnancy Monitoring"
            ].map((module, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 flex items-center space-x-4 hover:bg-white/20 transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">{module}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Trusted by Healthcare Professionals
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-6 text-lg italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-blue-300">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Rural Healthcare?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of healthcare professionals already using our platform
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Rural Health Monitor</span>
              <p className="text-blue-200 text-sm">Transforming Healthcare</p>
            </div>
          </div>
          <div className="text-center text-blue-200">
            <p>&copy; 2025 Rural Health Monitoring System. Building healthier communities through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
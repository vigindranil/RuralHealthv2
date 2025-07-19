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
      <div className="absolute inset-0">
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
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Gram Panchayat Office"
            className="w-full max-w-xs md:max-w-sm rounded-2xl shadow-xl border-4 border-white mb-8 md:mb-0"
            style={{ objectFit: 'cover', height: '260px' }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium backdrop-blur-sm border border-blue-400/30">
                <Award className="w-4 h-4 mr-2" />
                Award-Winning Health Monitoring Platform
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transforming
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent block">
                Rural Healthcare
              </span>
              <span className="text-5xl md:text-6xl">Monitoring</span>
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Comprehensive health monitoring system for rural communities. Track maternal health, 
              child nutrition, immunization, and infectious diseases with real-time data collection, 
              AI-powered analytics, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <button className="border-2 border-white/30 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
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
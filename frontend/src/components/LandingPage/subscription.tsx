import React, { useState } from "react";
import { Check, Mail, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Subscription: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const plans = [
    {
      name: "Starter",
      description: "Ideal for small schools or individual courses starting out.",
      price: billingPeriod === "monthly" ? "0" : "0",
      features: [
        "Issue up to 10 certificates / mo",
        "Standard verification templates",
        "Public QR verification portal",
        "Basic email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Best for medium institutions, colleges, and training academies.",
      price: billingPeriod === "monthly" ? "49" : "39",
      features: [
        "Issue up to 500 certificates / mo",
        "Custom branded certificate templates",
        "Bulk CSV recipient imports",
        "Secure API integrations",
        "Priority 24/7 email support",
      ],
      cta: "Choose Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large universities and global organizations requiring custom solutions.",
      price: "Custom",
      features: [
        "Unlimited monthly certificate issues",
        "Dedicated private blockchain node",
        "Single Sign-On (SSO) & SAML",
        "Dedicated account manager",
        "Custom SLA and 24/7 phone support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-8 relative overflow-hidden bg-slate-950 text-white select-none">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3D876C]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D876C]/10 border border-[#3D876C]/20 text-[#3D876C] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={12} /> Pricing & Subscription
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Simple, Transparent Subscriptions
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Choose the right plan to verify, issue, and manage your institution's tamper-proof credentials on the blockchain.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-white" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(prev => prev === "monthly" ? "annually" : "monthly")}
              className="relative w-12 h-6 bg-slate-800 rounded-full border border-slate-700 p-0.5 transition-colors cursor-pointer"
            >
              <div 
                className={`w-4 h-4 bg-[#3D876C] rounded-full transition-transform ${
                  billingPeriod === "annually" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "annually" ? "text-white" : "text-slate-400"}`}>
              Annually <span className="text-[10px] bg-[#3D876C]/20 text-[#3D876C] px-1.5 py-0.5 rounded font-bold uppercase">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Subscription Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-8 flex flex-col justify-between transition-all duration-300 border bg-slate-900/60 backdrop-blur-md ${
                plan.popular 
                  ? "border-[#3D876C] shadow-lg shadow-[#3D876C]/10 scale-105 z-10" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-[#3D876C] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 h-12">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex flex-col mb-8">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && <span className="text-sm text-slate-400 font-medium">$</span>}
                    <span className="text-4xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-xs text-slate-400 font-medium ml-1">
                        / month
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1.5 h-4">
                    {plan.price === "Custom" 
                      ? "Custom contracts" 
                      : plan.name === "Starter" 
                      ? "Free forever" 
                      : billingPeriod === "monthly" 
                      ? "Billed monthly" 
                      : `Billed annually ($${Number(plan.price) * 12}/yr)`}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-300 text-xs">
                      <Check size={14} className="text-[#3D876C] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.name === "Enterprise" ? (
                <a
                  href="mailto:support@authentix.com"
                  className="w-full text-center py-3 px-4 rounded-lg font-bold text-xs cursor-pointer tracking-wider uppercase transition-all bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  to="/auth/register"
                  className={`w-full text-center py-3 px-4 rounded-lg font-bold text-xs cursor-pointer tracking-wider uppercase transition-all ${
                    plan.popular
                      ? "bg-[#3D876C] hover:bg-[#2C6450] text-white shadow-md shadow-[#3D876C]/20"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div id="newsletter" className="relative rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
          {/* Subtle decoration inside */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#3D876C]/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="max-w-xl relative z-10">
            <div className="flex items-center gap-2 text-[#3D876C] mb-2">
              <Mail size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Stay updated</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              Subscribe to the Authentix Newsletter
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Get monthly updates on blockchain security, certificate template designs, and industry verification standards delivered directly to your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto relative z-10 flex-shrink-0">
            {isSubscribed ? (
              <div className="bg-[#3D876C]/10 border border-[#3D876C]/30 text-[#3D876C] px-6 py-4 rounded-lg text-sm font-semibold flex items-center gap-2 animate-fade-in">
                <Check size={18} /> Thank you! You've successfully subscribed.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full sm:w-[450px]">
                <input
                  type="email"
                  required
                  placeholder="Enter your institutional email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-white/10 hover:border-white/15 focus:border-[#3D876C] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#3D876C] hover:bg-[#2C6450] text-white font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Subscribe <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

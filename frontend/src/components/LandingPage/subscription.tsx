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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3b82f6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold uppercase tracking-wider mb-4">
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
                className={`w-4 h-4 bg-[#3b82f6] rounded-full transition-transform ${
                  billingPeriod === "annually" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "annually" ? "text-white" : "text-slate-400"}`}>
              Annually <span className="text-[10px] bg-[#3b82f6]/20 text-[#3b82f6] px-1.5 py-0.5 rounded font-bold uppercase">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Subscription Plans Cards */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center mb-24 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 border bg-slate-900/60 backdrop-blur-xl w-full ${
                plan.popular 
                  ? "border-[var(--lp-primary)] shadow-[0_0_40px_rgba(59,130,246,0.15)] lg:scale-110 z-20 lg:-my-8 py-12 px-10 bg-gradient-to-b from-slate-900/90 to-blue-950/40" 
                  : "border-white/10 hover:border-white/20 lg:w-80 opacity-90 hover:opacity-100 z-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[var(--lp-primary)] to-[var(--lp-accent)] text-white text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className={`font-black mb-2 ${plan.popular ? 'text-3xl text-white' : 'text-xl text-slate-200'}`}>
                  {plan.name}
                </h3>
                <p className={`leading-relaxed mb-6 h-12 ${plan.popular ? 'text-sm text-slate-300' : 'text-xs text-slate-400'}`}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex flex-col mb-8">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && <span className="text-lg text-slate-400 font-medium">$</span>}
                    <span className={`font-extrabold tracking-tight ${plan.popular ? 'text-5xl text-white' : 'text-4xl text-slate-200'}`}>
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-sm text-slate-400 font-medium ml-1">
                        / month
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-2 h-4">
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
                    <li key={feature} className={`flex items-start gap-3 ${plan.popular ? 'text-slate-200 text-sm font-medium' : 'text-slate-400 text-xs'}`}>
                      <Check size={16} className="text-[var(--lp-primary)] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.name === "Enterprise" ? (
                <a
                  href="mailto:support@vericert.com"
                  className="w-full text-center py-3.5 px-4 rounded-xl font-bold text-xs cursor-pointer tracking-widest uppercase transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  to="/auth/register"
                  className={`w-full text-center py-3.5 px-4 rounded-xl font-bold text-xs cursor-pointer tracking-widest uppercase transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[var(--lp-primary)] to-[var(--lp-accent)] hover:opacity-90 text-white shadow-lg shadow-[var(--lp-primary)]/20 hover:-translate-y-0.5"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
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
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="max-w-xl relative z-10">
            <div className="flex items-center gap-2 text-[#3b82f6] mb-2">
              <Mail size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Stay updated</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              Subscribe to the VeriCert Newsletter
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Get monthly updates on blockchain security, certificate template designs, and industry verification standards delivered directly to your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto relative z-10 flex-shrink-0">
            {isSubscribed ? (
              <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] px-6 py-4 rounded-lg text-sm font-semibold flex items-center gap-2 animate-fade-in">
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
                  className="flex-1 bg-slate-950/80 border border-white/10 hover:border-white/15 focus:border-[#3b82f6] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
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

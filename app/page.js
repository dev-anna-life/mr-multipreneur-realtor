'use client'

import { useState, useEffect, useRef } from 'react'

function Reveal({ children, className = '' }) {
  const [show, setShow] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShow(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  )
}

function AnimatedCounter({ target, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef()
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        const duration = 2000
        const start = performance.now()
        function tick(now) {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          setCount(Math.floor(progress * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>
}

function FormCard() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [consent, setConsent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!consent) return
    setSending(true)
    const name = e.target.fullName.value
    const phone = e.target.phone.value
    const email = e.target.email.value
    const budget = e.target.budget.value
    const data = { name, email, phone, budget, source: 'Contact Form' }
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSubmitted(true)
      e.target.reset()
      setConsent(false)
      try { fbq('track', 'Lead'); } catch(e) {}
      const msg = encodeURIComponent(`Hello Harrison, I'm interested in investing.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nBudget: ${budget}`)
      window.open(`https://wa.me/2347048322531?text=${msg}`, '_blank')
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-6 py-8 text-center animate-fadeUp">
        <div className="text-4xl mb-3">{'\u2713'}</div>
        <p className="font-semibold">Thank you!</p>
        <p className="text-sm mt-1">I'll reach out to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold text-navy uppercase tracking-wide mb-1.5 block">Full Name</label>
        <input type="text" name="fullName" required placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy placeholder:text-gray-300" />
      </div>
      <div>
        <label className="text-sm font-semibold text-navy uppercase tracking-wide mb-1.5 block">Phone Number</label>
        <input type="tel" name="phone" required placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy placeholder:text-gray-300" />
      </div>
      <div>
        <label className="text-sm font-semibold text-navy uppercase tracking-wide mb-1.5 block">Email Address</label>
        <input type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy placeholder:text-gray-300" />
      </div>
      <div>
        <label className="text-sm font-semibold text-navy uppercase tracking-wide mb-1.5 block">Select a Budget</label>
        <select name="budget" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy bg-white">
          <option value="">Select a Budget</option>
          <option value="Under ₦2M">Under ₦2M</option>
          <option value="₦2M - ₦5M">₦2M - ₦5M</option>
          <option value="₦5M - ₦10M">₦5M - ₦10M</option>
          <option value="₦10M - ₦20M">₦10M - ₦20M</option>
          <option value="₦20M - ₦50M">₦20M - ₦50M</option>
          <option value="₦50M+">₦50M+</option>
        </select>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gold accent-gold" />
        <span className="text-sm text-slate leading-relaxed">I consent to having information processed in order to receive personalised marketing material via email in accordance with the Privacy Policy.</span>
      </label>
      <button type="submit" disabled={sending || !consent} className="bg-navy text-cream py-3.5 rounded-xl font-bold text-sm hover:bg-charcoal transition-all mt-2 w-full cursor-pointer disabled:opacity-50">
        {sending ? 'Sending...' : 'Get Instant Access'}
      </button>
      <p className="text-sm text-slate/50 text-center mt-2">Your information is 100% safe. We never share your data.</p>
    </form>
  )
}

const features = [
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Verified Documentation', desc: 'Every plot comes with full legal backing and authenticated survey plans for complete peace of mind.' },
  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Location Advantage', desc: 'Situated in a rapidly developing corridor with proven appreciation and growing infrastructure.' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Affordable Payment', desc: 'Flexible installment plans designed to make land ownership accessible without financial strain.' },
  { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Infrastructure Quality', desc: 'Well planned roads, drainage, and utility access already mapped out across the estate.' },
  { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', title: 'Instant Allocation', desc: 'Same day plot allocation once payment is confirmed. No unnecessary delays or bureaucracy.' },
  { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'Long Term Return', desc: 'High growth corridor with proven year on year appreciation for maximum investment yield.' },
]

const investmentPlans = [
  { size: '300sqm', label: 'Entry Level', price: '₦2.5M', tag: null, features: ['Perfect for first time investors', 'Flexible 12 month payment plan', 'Verified C of O documentation', 'Great resale value potential'] },
  { size: '500sqm', label: 'Most Popular', price: '₦4.0M', tag: 'Best Value', features: ['Ideal for family home construction', 'Premium location within estate', 'Flexible 18 month payment plan', 'Highest appreciation rate'] },
  { size: '1000sqm', label: 'Premium', price: '₦7.5M', tag: 'Wealth Builder', features: ['Double plot for maximum returns', 'Corner plot premium positioning', 'Flexible 24 month payment plan', 'Best long term investment value'] },
]

export default function Home() {
  const [showBackTop, setShowBackTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowBackTop(window.scrollY > 500)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <a href="#" className="font-display font-black text-xl tracking-tight text-cream">
            MrMultipreneur<span className="text-gold">.</span>
          </a>
          <div>
            <a href="#book-inspection" className="bg-gold text-navy px-5 py-2 rounded-full text-sm font-bold hover:bg-gold-light transition-all">Book for Inspection</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen bg-navy pt-24 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center py-16 relative z-10">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-gold/20">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              Trusted Real Estate Consultant
            </div>
            <h1 className="font-display font-black text-4xl md:text-7xl leading-tight text-cream mb-8">
              Build Wealth Through<br /><span className="text-gold">Strategic Real Estate</span><br />Investment
            </h1>
            <p className="text-cream/60 text-sm md:text-base leading-relaxed max-w-lg">
              Own a verified land in a rapidly developing corridor with flexible payment plans and exceptional appreciation potential.
            </p>
          </div>
          <div id="book-inspection" className="animate-fadeUp scroll-mt-24" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl"><FormCard /></div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="py-10 md:py-14 px-6 md:px-12 bg-navy border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 md:gap-12 justify-center flex-wrap">
            <div className="text-center"><div className="font-display font-black text-3xl md:text-4xl text-gold"><AnimatedCounter target={500} suffix="+" /></div><div className="text-xs text-cream/50 mt-1 uppercase tracking-wider">Plot Sold</div></div>
            <div className="text-center"><div className="font-display font-black text-3xl md:text-4xl text-gold"><AnimatedCounter target={98} suffix="%" /></div><div className="text-xs text-cream/50 mt-1 uppercase tracking-wider">Customer Satisfaction</div></div>
            <div className="text-center"><div className="font-display font-black text-3xl md:text-4xl text-gold"><AnimatedCounter target={12} suffix="+" /></div><div className="text-xs text-cream/50 mt-1 uppercase tracking-wider">Payment Plan</div></div>
            <div className="text-center"><div className="font-display font-black text-3xl md:text-4xl text-gold"><AnimatedCounter target={3} suffix={'\u00d7'} /></div><div className="text-xs text-cream/50 mt-1 uppercase tracking-wider">Appreciation</div></div>
          </div>
        </div>
      </section>

      {/* WHY THIS ESTATE */}
      <Reveal>
        <section id="why-this-estate" className="py-24 px-6 md:px-12 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Why This Estate</p>
              <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight">Built for Smart Investors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center text-gold text-2xl mb-5 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} /></svg>
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy mb-3">{f.title}</h3>
                  <p className="text-slate text-base leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* INVESTMENT OPTIONS */}
      <Reveal>
        <section id="investment-options" className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Investment Options</p>
              <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight">Choose Your Plot Size</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {investmentPlans.map((plan, i) => (
                <div key={i} className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${i === 1 ? 'border-gold bg-gold/5 scale-105 md:scale-110' : 'border-gray-100 bg-white'}`}>
                  {plan.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {plan.tag}
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-display font-black text-navy">{plan.size}</div>
                    <div className="text-sm text-slate mt-1">{plan.label}</div>
                  </div>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-display font-black text-gold">{plan.price}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate">
                        <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a href="#book-inspection" className={`block text-center py-3 rounded-xl font-bold text-sm transition-all w-full ${i === 1 ? 'bg-gold text-navy hover:bg-gold-light' : 'bg-navy text-cream hover:bg-charcoal'}`}>
                    Select Plan
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* BOOK YOUR FREE SITE INSPECTION */}
      <Reveal>
        <section className="py-24 px-6 md:px-12 bg-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold rounded-full blur-[120px]" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Still Have Doubts?</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-cream leading-tight mb-6">Book Your Free Site Inspection</h2>
            <p className="text-cream/60 text-base leading-relaxed max-w-2xl mx-auto mb-10">
              We understand that buying land is a big decision. That's why we invite you to visit the property in person, verify every document, and see the development for yourself. No pressure, no rush, just the facts so you can make an informed choice.
            </p>
            <a href="#book-inspection" className="inline-block bg-gold text-navy px-10 py-4 rounded-full font-bold text-base hover:bg-gold-light transition-all">
              Reserve Inspection Slot
            </a>
          </div>
        </section>
      </Reveal>

      <footer className="bg-gradient-to-r from-navy via-navy/90 to-charcoal text-cream/80 text-sm py-6 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <a href="tel:+2347048322531" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div><div className="text-xs text-cream/40 uppercase tracking-wider">Phone</div><div className="text-sm font-medium text-cream/90 group-hover:text-gold transition-colors">+234 7048322531</div></div>
            </a>
            <a href="mailto:Eponixlimited@gmail.com" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div><div className="text-xs text-cream/40 uppercase tracking-wider">Email</div><div className="text-sm font-medium text-cream/90 group-hover:text-gold transition-colors">Eponixlimited@gmail.com</div></div>
            </a>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div><div className="text-xs text-cream/40 uppercase tracking-wider">Locations</div><div className="text-sm font-medium text-cream/90">Asaba <span className="text-gold/50 mx-1">|</span> Anambra <span className="text-gold/50 mx-1">|</span> Enugu</div></div>
            </div>
            <a href="https://wa.me/2347048322531?text=Hello%20Harrison%2C%20I'd%20like%20to%20book%20a%20property%20inspection." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div><div className="text-xs text-cream/40 uppercase tracking-wider">WhatsApp</div><div className="text-sm font-medium text-cream/90 group-hover:text-gold transition-colors">WhatsApp Us</div></div>
            </a>
          </div>
          <div className="text-center mt-6 pt-4 border-t border-white/5">
            <p className="text-xs text-cream/30">Built by <span className="text-gold/60">Dev Anna</span></p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/2347048322531?text=Hello%20Harrison%2C%20I'd%20like%20to%20book%20a%20property%20inspection."
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { try { fbq('track', 'Contact'); } catch(e) {} }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-float cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-50 w-12 h-12 bg-gold text-navy rounded-full flex items-center justify-center shadow-lg hover:bg-gold-light transition-all duration-300 cursor-pointer ${showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
      </button>
    </>
  )
}

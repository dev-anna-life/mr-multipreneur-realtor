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
    const data = {
      name: e.target.fullName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      source: 'Contact Form',
    }
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

const services = [
  { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'Buying a Home', desc: 'Find your perfect property with personalized guidance through every step of the purchasing process.' },
  { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Selling Properties', desc: 'Maximize your property value with strategic pricing, staging, and targeted marketing campaigns.' },
  { icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', title: 'Rental Services', desc: 'Reliable rental solutions for landlords and tenants, from listings to lease agreements.' },
  { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'Real Estate Investment', desc: 'Data driven investment advice to help you build wealth through strategic property acquisitions.' },
  { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Property Development', desc: 'End to end support for development projects, from land acquisition to completed structures.' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Consultation', desc: 'One on one expert advice on market trends, property valuation, and investment strategy.' },
]

const testimonials = [
  { text: '"Harrison helped me find my first home and made the entire process stress free. Highly recommended!"', name: 'Chioma A.', role: 'First time Buyer' },
  { text: '"Sold my property in record time thanks to his marketing strategy. Professional and results driven."', name: 'Emeka O.', role: 'Property Seller' },
  { text: '"The best real estate agent I have worked with. Honest, knowledgeable, and truly cares about his clients."', name: 'Amara N.', role: 'Investor' },
]

const aboutItems = [
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Trusted track record of successful transactions' },
  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Deep knowledge of local neighborhoods and market trends' },
  { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Personalized service from start to closing' },
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
            <div className="flex gap-4 md:gap-6 mt-6 justify-center flex-wrap">
              <div className="text-center"><div className="font-display font-black text-2xl md:text-3xl text-gold"><AnimatedCounter target={500} suffix="+" /></div><div className="text-xs text-cream/50 mt-1">Plot Sold</div></div>
              <div className="text-center"><div className="font-display font-black text-2xl md:text-3xl text-gold"><AnimatedCounter target={95} suffix="%" /></div><div className="text-xs text-cream/50 mt-1">Client Satisfaction</div></div>
              <div className="text-center"><div className="font-display font-black text-2xl md:text-3xl text-gold"><AnimatedCounter target={12} suffix="+" /></div><div className="text-xs text-cream/50 mt-1">Monthly Installment</div></div>
              <div className="text-center"><div className="font-display font-black text-2xl md:text-3xl text-gold"><AnimatedCounter target={3} suffix={'\u00d7'} /></div><div className="text-xs text-cream/50 mt-1">Potential</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Reveal>
        <section id="services" className="py-24 px-6 md:px-12 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">What I Offer</p>
              <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight">Expert Real Estate Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center text-gold text-2xl mb-5 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy mb-3">{s.title}</h3>
                  <p className="text-slate text-base leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* WHY CHOOSE */}
      <Reveal>
        <section id="about" className="py-12 md:py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 md:items-center">
            <div className="animate-float order-2 md:order-none">
              <div className="w-full max-w-sm mx-auto md:max-w-none aspect-[4/5] md:aspect-[3/4] bg-navy rounded-3xl flex items-center justify-center overflow-hidden shadow-xl">
                <img src="/assets/harrison-profile.jpeg" alt="Harrison Ugochukwu" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="order-1 md:order-none space-y-3">
              <div>
                <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Why Choose Me</p>
                <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight mb-3">Harrison Ugochukwu</h2>
                <p className="text-slate leading-relaxed">
                  With years of hands on experience in the Nigerian real estate market, I bring local expertise, market insight, and a genuine commitment to helping you find the right property. Whether you're buying your first home, selling a property, or looking to invest, I'm here to make the process smooth and successful.
                </p>
              </div>
              <div className="space-y-4">
                {aboutItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                    <span className="text-base text-slate">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 md:px-12 bg-navy">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Testimonials</p>
              <h2 className="font-display font-black text-4xl md:text-5xl text-cream leading-tight">What My Clients Say</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="opacity-0 translate-y-8" style={{ animation: `fadeUp 0.7s ease ${i * 0.2}s forwards` }}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full hover:-translate-y-1 hover:border-gold/30 transition-all duration-500">
                  <div className="text-gold text-lg mb-5">{'\u2605\u2605\u2605\u2605\u2605'}</div>
                  <p className="text-cream/80 text-base leading-relaxed mb-6 italic">&ldquo;{t.text.replace(/^"|"$/g, '')}&rdquo;</p>
                  <div><div className="font-semibold text-cream text-base">{t.name}</div><div className="text-cream/40 text-sm mt-0.5">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <Reveal>
        <section id="contact" className="py-24 px-6 md:px-12 bg-cream">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold text-sm font-bold uppercase tracking-widest mb-3">Get in Touch</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight mb-6">Let's Find Your Perfect Property</h2>
            <p className="text-slate text-base max-w-lg mx-auto mb-12">Ready to take the next step? Reach out and I'll get back to you within 24 hours.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <a href="tel:+2347048322531" className="bg-white rounded-2xl p-6 border border-gray-100 block hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <p className="text-base font-semibold text-navy">Phone</p>
                <p className="text-sm text-slate mt-1">+234 7048322531</p>
              </a>
              <a href="mailto:Eponixlimited@gmail.com" className="bg-white rounded-2xl p-6 border border-gray-100 block hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-base font-semibold text-navy">Email</p>
                <p className="text-sm text-slate mt-1">Eponixlimited@gmail.com</p>
              </a>
              <a href="https://maps.google.com/maps/search/Old%20Anwai%20Rd%2C%20Asaba%2C%20Delta%2C%20Nigeria/@6.2264,6.7034,17z?hl=en" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-100 block hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p className="text-base font-semibold text-navy">Location</p>
                <p className="text-sm text-slate mt-1">Old Anwai Rd, Asaba, Delta</p>
              </a>
              <a href="https://wa.me/2347048322531?text=Hello%20Harrison%2C%20I'd%20like%20to%20book%20a%20property%20inspection." target="_blank" rel="noopener noreferrer" onClick={() => { try { fbq('track', 'Contact'); } catch(e) {} }} className="bg-white rounded-2xl p-6 border border-gray-100 block hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <p className="text-base font-semibold text-navy">WhatsApp</p>
                <p className="text-sm text-slate mt-1">Chat Instantly</p>
              </a>
            </div>
            <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <FormCard />
            </div>
          </div>
        </section>
      </Reveal>

      <footer className="bg-navy text-cream/40 text-xs text-center py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="font-display font-black text-lg text-cream mb-2">MrMultipreneur<span className="text-gold">.</span></div>
          <p className="text-cream/30">Real Estate Consultant</p>
          <div className="flex justify-center gap-5 mt-6 mb-6">
            <a href="https://x.com/mrmultiprenuer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-cream/70 hover:bg-gold hover:text-navy hover:scale-110 transition-all duration-300 border border-white/10" aria-label="X / Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/harrison-ugochukwu-mrmultiprenuer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-cream/70 hover:bg-gold hover:text-navy hover:scale-110 transition-all duration-300 border border-white/10" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://youtube.com/@harrison_ugochukwu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-cream/70 hover:bg-gold hover:text-navy hover:scale-110 transition-all duration-300 border border-white/10" aria-label="YouTube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.instagram.com/mrmultiprenuer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-cream/70 hover:bg-gold hover:text-navy hover:scale-110 transition-all duration-300 border border-white/10" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/Ugochukwu.H" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-cream/70 hover:bg-gold hover:text-navy hover:scale-110 transition-all duration-300 border border-white/10" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
          <p className="mt-4 text-cream/20">Built by <span className="text-gold/60">Dev Anna</span></p>
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

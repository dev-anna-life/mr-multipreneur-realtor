'use client'

import { useState } from 'react'

function FormCard({ formId, title, subtitle, isHero }) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      source: isHero ? 'Hero Form' : 'Contact Section',
    }
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSubmitted(true)
      e.target.reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-6 py-8 text-center">
        <div className="text-4xl mb-3">{'\u2713'}</div>
        <p className="font-semibold">Thank you!</p>
        <p className="text-sm mt-1">I'll reach out to you shortly.</p>
      </div>
    )
  }

  return (
    <div className={isHero ? 'bg-white rounded-3xl p-8 md:p-10 shadow-2xl' : ''}>
      {title && <h2 className="font-display font-bold text-2xl text-navy mb-2">{title}</h2>}
      {subtitle && <p className="text-slate text-sm mb-8">{subtitle}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wide mb-1.5 block">Full Name</label>
          <input type="text" name="name" required placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy placeholder:text-gray-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wide mb-1.5 block">Email Address</label>
          <input type="email" name="email" required placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy placeholder:text-gray-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy uppercase tracking-wide mb-1.5 block">Phone Number</label>
          <input type="tel" name="phone" required placeholder="+234 XXX XXX XXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold transition-colors text-navy placeholder:text-gray-300" />
        </div>
        <button type="submit" disabled={sending} className="bg-navy text-cream py-3.5 rounded-xl font-bold text-sm hover:bg-charcoal transition-all mt-2 w-full cursor-pointer disabled:opacity-50">
          {sending ? 'Sending...' : 'Send Message'}
        </button>
        {isHero && <p className="text-xs text-slate/50 text-center mt-2">Your information is safe and will not be shared.</p>}
      </form>
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <a href="#" className="font-display font-black text-xl tracking-tight text-cream">
            Harrison<span className="text-gold">.</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#services" className="hidden md:inline text-cream/70 text-sm hover:text-gold transition-colors">Services</a>
            <a href="#about" className="hidden md:inline text-cream/70 text-sm hover:text-gold transition-colors">About</a>
            <a href="#contact" className="bg-gold text-navy px-5 py-2 rounded-full text-sm font-bold hover:bg-gold-light transition-all">Get in Touch</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen bg-navy pt-24 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center py-16">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-gold/20">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              Trusted Real Estate Consultant
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-tight text-cream mb-6">
              Find Your<br /><span className="text-gold">Dream Home</span><br />Today
            </h1>
            <p className="text-cream/60 text-base leading-relaxed max-w-lg mb-8">
              Expert guidance for buyers, sellers, and investors. From first,time homes to luxury estates &mdash; let's make your next move your best move.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="#contact" className="bg-gold text-navy px-8 py-3 rounded-full font-bold text-sm hover:bg-gold-light transition-all flex items-center gap-2">
                Schedule a Consultation <span className="text-lg">&rarr;</span>
              </a>
              <a href="#services" className="border border-cream/20 text-cream px-8 py-3 rounded-full font-medium text-sm hover:bg-cream/10 transition-all">
                Explore Services
              </a>
            </div>
            <div className="flex gap-8 mt-12">
              <div><div className="font-display font-black text-3xl text-gold">50+</div><div className="text-xs text-cream/50 mt-1">Properties Sold</div></div>
              <div><div className="font-display font-black text-3xl text-gold">200+</div><div className="text-xs text-cream/50 mt-1">Happy Clients</div></div>
              <div><div className="font-display font-black text-3xl text-gold">4.9</div><div className="text-xs text-cream/50 mt-1">Client Rating</div></div>
            </div>
          </div>

          <div className="animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <FormCard isHero title="Interested in a property?" subtitle="Leave your details and I'll get back to you" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">What I Offer</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight">Expert Real Estate Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'Buying a Home', desc: 'Find your perfect property with personalized guidance through every step of the purchasing process.' },
              { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Selling Properties', desc: 'Maximize your property value with strategic pricing, staging, and targeted marketing campaigns.' },
              { icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', title: 'Rental Services', desc: 'Reliable rental solutions for landlords and tenants &mdash; from listings to lease agreements.' },
              { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'Real Estate Investment', desc: 'Data,driven investment advice to help you build wealth through strategic property acquisitions.' },
              { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Property Development', desc: 'End,to,end support for development projects &mdash; from land acquisition to completed structures.' },
              { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Consultation', desc: 'One,on,one expert advice on market trends, property valuation, and investment strategy.' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold text-xl mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-3">{s.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="about" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-full aspect-[3/4] bg-navy rounded-3xl flex items-center justify-center overflow-hidden">
              <img src="/assets/harrison-profile.jpeg" alt="Harrison Ugochukwu" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div>
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Why Choose Me</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight mb-6">Harrison Ugochukwu</h2>
            <p className="text-slate leading-relaxed mb-6">
              With years of hands,on experience in the Nigerian real estate market, I bring local expertise, market insight, and a genuine commitment to helping you find the right property. Whether you're buying your first home, selling a property, or looking to invest &mdash; I'm here to make the process smooth and successful.
            </p>
            <div className="space-y-4">
              {[
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Trusted track record of successful transactions' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Deep knowledge of local neighborhoods and market trends' },
                { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Personalized service from start to closing' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                  <span className="text-sm text-slate">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 md:px-12 bg-navy">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-cream leading-tight">What My Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stars: '\u2605\u2605\u2605\u2605\u2605', text: '"Harrison helped me find my first home and made the entire process stress,free. Highly recommended!"', name: 'Chioma A.', role: 'First,time Buyer' },
              { stars: '\u2605\u2605\u2605\u2605\u2605', text: '"Sold my property in record time thanks to his marketing strategy. Professional and results,driven."', name: 'Emeka O.', role: 'Property Seller' },
              { stars: '\u2605\u2605\u2605\u2605\u2605', text: '"The best real estate agent I have worked with. Honest, knowledgeable, and truly cares about his clients."', name: 'Amara N.', role: 'Investor' },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="text-gold text-lg mb-4">{t.stars}</div>
                <p className="text-cream/70 text-sm leading-relaxed mb-6">{t.text}</p>
                <div><div className="font-semibold text-cream text-sm">{t.name}</div><div className="text-cream/40 text-xs">{t.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Get in Touch</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-navy leading-tight mb-6">Let's Find Your Perfect Property</h2>
          <p className="text-slate text-base max-w-lg mx-auto mb-12">Ready to take the next step? Reach out and I'll get back to you within 24 hours.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <p className="text-sm font-semibold text-navy">Phone</p>
              <p className="text-xs text-slate mt-1">+234 7048322531</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-sm font-semibold text-navy">Email</p>
              <p className="text-xs text-slate mt-1">Eponixlimited@gmail.com</p>
            </div>
            <a href="https://maps.google.com/maps/search/Old%20Anwai%20Rd%2C%20Asaba%2C%20Delta%2C%20Nigeria/@6.2264,6.7034,17z?hl=en" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-100 block hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <p className="text-sm font-semibold text-navy">Location</p>
              <p className="text-xs text-slate mt-1">Old Anwai Rd, Asaba, Delta</p>
            </a>
          </div>
          <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <FormCard isHero={false} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-cream/40 text-xs text-center py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="font-display font-black text-lg text-cream mb-2">Harrison<span className="text-gold">.</span></div>
          <p className="text-cream/30">MrMultipreneur &middot; Real Estate</p>
          <p className="mt-4 text-cream/20">Built by <span className="text-gold/60">Dev Anna</span></p>
        </div>
      </footer>
    </>
  )
}

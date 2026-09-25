'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CalendarDays, Check, Crown, Gift, LogIn, QrCode, Sparkles, UserPlus } from 'lucide-react'

// Custom Salon Brand Configuration for Bon-Bon
const SALON_CONFIG = {
  name: 'Bon-Bon',
  accent: '#E07A5F', // Warm pastel coral/terracotta
  logo: 'BB',
  bookingUrl: 'https://www.bon-bon.com/',
  masterPin: '1234',
}

type ViewState = 'scan_filter' | 'join_form' | 'stamp_form' | 'passport'

export default function Page() {
  const [view, setView] = useState<ViewState>('scan_filter')
  
  // Client Data
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [stamps, setStamps] = useState(0)
  const [isFirstJoin, setIsFirstJoin] = useState(false)
  
  // Security & Modals
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // 1. First-time client registration flow
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !phone) return
    setIsFirstJoin(true)
    setStamps(1)
    setShowSuccessModal(true)
    setView('passport')
  }

  // 2. Returning client visit / stamp flow
  const handleStampSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setIsFirstJoin(false)

    // Reward redemption check on 6th visit
    if (stamps === 5) {
      if (pin !== SALON_CONFIG.masterPin) {
        setPinError(true)
        return
      }
      setStamps(0)
      setPin('')
      setPinError(false)
    } else {
      setStamps((prev) => Math.min(5, prev + 1))
    }

    setShowSuccessModal(true)
    setView('passport')
  }

  return (
    <main style={{ '--accent': SALON_CONFIG.accent } as React.CSSProperties} className="min-h-screen bg-[#FAFAFA] px-4 py-5 text-[#2B2D42] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-md flex-col">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 py-2">
          <div className="flex items-center gap-3 text-left">
            <span className="flex size-11 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-sm font-semibold tracking-[0.2em] text-[var(--accent)]">
              {SALON_CONFIG.logo}
            </span>
            <div>
              <span className="block text-[15px] font-semibold tracking-wide text-gray-900">{SALON_CONFIG.name}</span>
              <span className="text-xs text-gray-500">Digital Loyalty Pass</span>
            </div>
          </div>
        </header>

        {/* VIEW 1: INITIAL QR SCAN FILTER */}
        {view === 'scan_filter' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
            <div className="text-center">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                <QrCode className="size-7" />
              </span>
              <h1 className="text-2xl font-light text-gray-900">Welcome to <span className="font-semibold">{SALON_CONFIG.name}</span></h1>
              <p className="mt-2 text-xs text-gray-500">Select an option below to collect today's stamp</p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button onClick={() => setView('join_form')} className="flex items-center justify-between rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-5 text-left transition hover:bg-[var(--accent)]/10">
                <div className="flex items-center gap-4">
                  <UserPlus className="size-6 text-[var(--accent)]" />
                  <div>
                    <p className="text-base font-medium text-gray-900">Join Loyalty Program</p>
                    <p className="text-xs text-gray-500">First time here? Register in seconds</p>
                  </div>
                </div>
              </button>

              <button onClick={() => setView('stamp_form')} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:bg-gray-100">
                <div className="flex items-center gap-4">
                  <LogIn className="size-6 text-gray-600" />
                  <div>
                    <p className="text-base font-medium text-gray-900">Returning Client / Stamp Card</p>
                    <p className="text-xs text-gray-500">Already joined? Enter phone to stamp</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: JOIN FORM */}
        {view === 'join_form' && (
          <motion.form onSubmit={handleJoinSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
            <h2 className="text-xl font-medium text-gray-900">New Client Registration</h2>
            <p className="mt-1 text-xs text-gray-500">Fill in your details once to receive your first stamp.</p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-gray-500">
                First Name
                <input required value={userName} onChange={(e) => setUserName(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--accent)]" placeholder="e.g. Sarah" />
              </label>

              <label className="flex flex-col gap-2 text-xs text-gray-500">
                Phone Number
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--accent)]" placeholder="(555) 012-3456" />
              </label>

              <button type="submit" className="mt-2 rounded-xl bg-[var(--accent)] py-4 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/20">
                Register & Get Stamp #1
              </button>
              
              <button type="button" onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-gray-400 hover:text-gray-600">
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 3: STAMP FORM */}
        {view === 'stamp_form' && (
          <motion.form onSubmit={handleStampSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
            <h2 className="text-xl font-medium text-gray-900">{stamps === 5 ? 'Redeem VIP Reward' : 'Stamp Loyalty Card'}</h2>
            <p className="mt-1 text-xs text-gray-500">{stamps === 5 ? 'Staff master PIN required to redeem.' : 'Enter your phone number to collect today\'s stamp.'}</p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-gray-500">
                Phone Number
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--accent)]" placeholder="(555) 012-3456" />
              </label>

              {stamps === 5 && (
                <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4">
                  <Sparkles className="mb-1 size-5 text-[var(--accent)]" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Reward Unlocked: $20 Off Service</p>
                  <label className="mt-3 flex flex-col gap-1.5 text-xs text-gray-500">
                    Enter 4-Digit Staff PIN
                    <input type="password" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value); setPinError(false); }} className={`rounded-lg border ${pinError ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} px-3 py-2 text-center text-gray-900 outline-none`} placeholder="••••" />
                  </label>
                  {pinError && <p className="mt-1 text-[11px] text-red-500">Incorrect staff PIN. Try again.</p>}
                </div>
              )}

              <button type="submit" className="mt-2 rounded-xl bg-[var(--accent)] py-4 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/20">
                {stamps === 5 ? 'Verify & Redeem Reward' : 'Collect Today\'s Stamp'}
              </button>

              <button type="button" onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-gray-400 hover:text-gray-600">
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 4: DIGITAL PASSPORT */}
        {view === 'passport' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col">
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Loyalty Passport</p>
                <h1 className="mt-1 text-2xl font-light tracking-tight text-gray-900">
                  {isFirstJoin ? (
                    <>Welcome, <span className="font-semibold">{userName || 'Valued Guest'}</span></>
                  ) : (
                    <>Welcome back, <span className="font-semibold">{userName || 'Valued Guest'}</span></>
                  )}
                </h1>
              </div>
              <span className="flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
                <Gift className="size-3.5" /> Active Card
              </span>
            </div>

            <section className="mt-5 rounded-[28px] border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Your Progress</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {stamps < 5 ? `${5 - stamps} visit${5 - stamps === 1 ? '' : 's'} away from your VIP reward` : 'VIP Reward Unlocked!'}
                  </p>
                </div>
                <span className="text-3xl font-light text-[var(--accent)]">{stamps}<span className="text-lg text-gray-300">/5</span></span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }, (_, index) => {
                  const filled = index < stamps
                  const reward = index === 5
                  return (
                    <div key={index} className={`relative flex aspect-square items-center justify-center rounded-2xl border ${filled ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10' : reward ? 'border-[var(--accent)]/20 bg-gray-50' : 'border-gray-100 bg-gray-50/50'}`}>
                      <span className="absolute left-2.5 top-2 text-[10px] text-gray-400">0{index + 1}</span>
                      {filled ? (
                        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent)] text-white"><Check className="size-5" /></span>
                      ) : reward ? (
                        <Crown className="size-5 text-[var(--accent)]" />
                      ) : (
                        <span className="size-2 rounded-full bg-gray-200" />
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <motion.div animate={{ width: `${(stamps / 5) * 100}%` }} className="h-full rounded-full bg-[var(--accent)]" />
              </div>
            </section>

            <section className="mt-6 flex flex-col gap-3">
              <a href={SALON_CONFIG.bookingUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/20 transition hover:opacity-95">
                <CalendarDays className="size-4" /> Book Next Visit
              </a>

              <button onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-gray-400 hover:text-gray-600">
                Simulate Counter QR Scan
              </button>
            </section>
          </motion.div>
        )}

        <p className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
          Secure Digital Pass · {SALON_CONFIG.name}
        </p>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 sm:items-center">
            <motion.div initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-sm rounded-[28px] border border-gray-100 bg-white p-6 text-center shadow-2xl">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <BadgeCheck className="size-8" />
              </span>
              
              <h2 className="mt-5 text-xl font-medium text-gray-900">
                {isFirstJoin ? `Welcome, ${userName}!` : `Welcome back, ${userName || 'Valued Guest'}!`}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {stamps === 0 
                  ? 'Your VIP reward has been redeemed!' 
                  : `You're ${5 - stamps} visit${5 - stamps === 1 ? '' : 's'} away from your VIP reward!`}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <a href={SALON_CONFIG.bookingUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white">
                  Book Next Appointment
                </a>
                <button onClick={() => setShowSuccessModal(false)} className="rounded-xl border border-gray-200 py-3 text-sm text-gray-500 hover:text-gray-900">
                  View Passport Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

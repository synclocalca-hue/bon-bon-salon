'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CalendarDays, Check, Crown, Gift, LogIn, QrCode, Sparkles, UserPlus } from 'lucide-react'

// Custom Luxury Brand Configuration for Bon-Bon Salon
const SALON_CONFIG = {
  name: 'Bon-Bon Salon',
  accent: '#18181B', // Rich luxury black
  champagne: '#C5A880', // Subtle luxury champagne gold
  logo: 'BON',
  bookingUrl: 'https://www.fresha.com/providers/bon-bon-salon-cw6ojgcx?share=&pId=192747&allOffer=true',
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
    <main className="min-h-screen bg-[#FBFBFB] px-4 py-5 text-[#18181B] sm:px-6 font-sans">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-md flex-col">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 py-2">
          <div className="flex items-center gap-3 text-left">
            <span className="flex size-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-bold tracking-[0.2em] text-zinc-900">
              {SALON_CONFIG.logo}
            </span>
            <div>
              <span className="block text-[15px] font-semibold tracking-wider text-zinc-900 uppercase">{SALON_CONFIG.name}</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Digital Loyalty Pass</span>
            </div>
          </div>
        </header>

        {/* VIEW 1: INITIAL QR SCAN FILTER */}
        {view === 'scan_filter' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/40">
            <div className="text-center">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                <QrCode className="size-7" />
              </span>
              <h1 className="text-2xl font-light tracking-wide text-zinc-900">Welcome to <span className="font-semibold">{SALON_CONFIG.name}</span></h1>
              <p className="mt-2 text-xs text-zinc-400">Select an option below to collect today's stamp</p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button onClick={() => setView('join_form')} className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-left transition hover:bg-zinc-800 text-white shadow-md">
                <div className="flex items-center gap-4">
                  <UserPlus className="size-6 text-white" />
                  <div>
                    <p className="text-base font-medium text-white">Join Loyalty Program</p>
                    <p className="text-xs text-zinc-400">First time here? Register in seconds</p>
                  </div>
                </div>
              </button>

              <button onClick={() => setView('stamp_form')} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 text-left transition hover:bg-zinc-100">
                <div className="flex items-center gap-4">
                  <LogIn className="size-6 text-zinc-700" />
                  <div>
                    <p className="text-base font-medium text-zinc-900">Returning Client / Stamp Card</p>
                    <p className="text-xs text-zinc-400">Already joined? Enter phone to stamp</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: JOIN FORM */}
        {view === 'join_form' && (
          <motion.form onSubmit={handleJoinSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/40">
            <h2 className="text-xl font-medium text-zinc-900">New Client Registration</h2>
            <p className="mt-1 text-xs text-zinc-400">Fill in your details once to receive your first stamp.</p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-zinc-400">
                First Name
                <input required value={userName} onChange={(e) => setUserName(e.target.value)} className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900" placeholder="e.g. Sarah" />
              </label>

              <label className="flex flex-col gap-2 text-xs text-zinc-400">
                Phone Number
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900" placeholder="(555) 012-3456" />
              </label>

              <button type="submit" className="mt-2 rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800">
                Register & Get Stamp #1
              </button>
              
              <button type="button" onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-zinc-400 hover:text-zinc-600">
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 3: STAMP FORM */}
        {view === 'stamp_form' && (
          <motion.form onSubmit={handleStampSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/40">
            <h2 className="text-xl font-medium text-zinc-900">{stamps === 5 ? 'Redeem VIP Reward' : 'Stamp Loyalty Card'}</h2>
            <p className="mt-1 text-xs text-zinc-400">{stamps === 5 ? 'Staff master PIN required to redeem.' : 'Enter your phone number to collect today\'s stamp.'}</p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-zinc-400">
                Phone Number
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900" placeholder="(555) 012-3456" />
              </label>

              {stamps === 5 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                  <Sparkles className="mb-1 size-5 text-amber-700" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">Reward Unlocked: VIP Service Discount</p>
                  <label className="mt-3 flex flex-col gap-1.5 text-xs text-zinc-500">
                    Enter 4-Digit Staff PIN
                    <input type="password" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value); setPinError(false); }} className={`rounded-lg border ${pinError ? 'border-red-500 bg-red-50' : 'border-zinc-200 bg-white'} px-3 py-2 text-center text-zinc-900 outline-none`} placeholder="••••" />
                  </label>
                  {pinError && <p className="mt-1 text-[11px] text-red-500">Incorrect staff PIN. Try again.</p>}
                </div>
              )}

              <button type="submit" className="mt-2 rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800">
                {stamps === 5 ? 'Verify & Redeem Reward' : 'Collect Today\'s Stamp'}
              </button>

              <button type="button" onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-zinc-400 hover:text-zinc-600">
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
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Loyalty Passport</p>
                <h1 className="mt-1 text-2xl font-light tracking-tight text-zinc-900">
                  {isFirstJoin ? (
                    <>Welcome, <span className="font-semibold">{userName || 'Valued Guest'}</span></>
                  ) : (
                    <>Welcome back, <span className="font-semibold">{userName || 'Valued Guest'}</span></>
                  )}
                </h1>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-800">
                <Gift className="size-3.5 text-amber-700" /> Active Card
              </span>
            </div>

            <section className="mt-5 rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-xl shadow-zinc-200/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Your Progress</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {stamps < 5 ? `${5 - stamps} visit${5 - stamps === 1 ? '' : 's'} away from your VIP reward` : 'VIP Reward Unlocked!'}
                  </p>
                </div>
                <span className="text-3xl font-light text-zinc-900">{stamps}<span className="text-lg text-zinc-300">/5</span></span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }, (_, index) => {
                  const filled = index < stamps
                  const reward = index === 5
                  return (
                    <div key={index} className={`relative flex aspect-square items-center justify-center rounded-2xl border ${filled ? 'border-zinc-900 bg-zinc-900 text-white' : reward ? 'border-amber-300/80 bg-amber-50/50' : 'border-zinc-100 bg-zinc-50/50'}`}>
                      <span className={`absolute left-2.5 top-2 text-[10px] ${filled ? 'text-zinc-400' : 'text-zinc-400'}`}>0{index + 1}</span>
                      {filled ? (
                        <span className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-900"><Check className="size-4 stroke-[3]" /></span>
                      ) : reward ? (
                        <Crown className="size-5 text-amber-700" />
                      ) : (
                        <span className="size-2 rounded-full bg-zinc-200" />
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <motion.div animate={{ width: `${(stamps / 5) * 100}%` }} className="h-full rounded-full bg-zinc-900" />
              </div>
            </section>

            <section className="mt-6 flex flex-col gap-3">
              <a href={SALON_CONFIG.bookingUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800">
                <CalendarDays className="size-4" /> Book Next Visit
              </a>

              <button onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-zinc-400 hover:text-zinc-600">
                Simulate Counter QR Scan
              </button>
            </section>
          </motion.div>
        )}

        <p className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Secure Digital Pass · {SALON_CONFIG.name}
        </p>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-900/40 backdrop-blur-sm p-4 sm:items-center">
            <motion.div initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-sm rounded-[28px] border border-zinc-100 bg-white p-6 text-center shadow-2xl">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-900 text-white">
                <BadgeCheck className="size-8" />
              </span>
              
              <h2 className="mt-5 text-xl font-medium text-zinc-900">
                {isFirstJoin ? `Welcome, ${userName}!` : `Welcome back, ${userName || 'Valued Guest'}!`}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {stamps === 0 
                  ? 'Your VIP reward has been redeemed!' 
                  : `You're ${5 - stamps} visit${5 - stamps === 1 ? '' : 's'} away from your VIP reward!`}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <a href={SALON_CONFIG.bookingUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white">
                  Book Next Appointment
                </a>
                <button onClick={() => setShowSuccessModal(false)} className="rounded-xl border border-zinc-200 py-3 text-sm text-zinc-500 hover:text-zinc-900">
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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Premium() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [step, setStep] = useState('plans') // plans | payment | processing | success
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [error, setError] = useState('')

  const plans = {
    monthly: { label: 'Monthly Plan', price: '₹149', period: 'per month · cancel anytime', save: null },
    yearly:  { label: 'Annual Plan',  price: '₹999', period: 'per year · only ₹83/month', save: 'Best Value — Save 33%' },
  }

  const features = [
    '700+ films — Hollywood, Bollywood, Tollywood, Marathi & more',
    '4K Ultra HD streaming + Dolby Atmos Audio',
    'Exclusive originals & early access releases',
    'Multi-language subtitles & dubbing',
    'Unlimited offline downloads',
    'Zero ads. Ever. Guaranteed.',
  ]

  const handleSelectPlan = (plan) => {
    if (!user) return navigate('/signup')
    setSelectedPlan(plan)
    setStep('payment')
    setError('')
  }

  const handlePay = async () => {
    // Validation
    if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) return setError('Please enter a valid UPI ID (e.g. name@upi)')
    } else {
      if (cardNo.replace(/\s/g,'').length < 16) return setError('Enter valid 16-digit card number')
      if (!cardName) return setError('Enter cardholder name')
      if (!cardExp) return setError('Enter expiry date')
      if (cardCvv.length < 3) return setError('Enter valid CVV')
    }
    setError('')
    setStep('processing')

    // Fake 2 second payment processing
    await new Promise(r => setTimeout(r, 2000))

    try {
      await axios.post('/api/premium/subscribe', { plan: selectedPlan })
      setStep('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Try again.')
      setStep('payment')
    }
  }

  // ── SUCCESS SCREEN ──────────────────────────────────────
  if (step === 'success') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🎉</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '48px', fontWeight: 300, color: '#C9A84C', marginBottom: '16px' }}>Welcome to Premium!</div>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '40px' }}>Your {selectedPlan} plan is now active. Enjoy 4K, ad-free cinema!</p>
        <button onClick={() => navigate('/')} style={{ padding: '14px 48px', background: '#C9A84C', color: '#0A0A0A', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
          Start Watching →
        </button>
      </div>
    </div>
  )

  // ── PROCESSING SCREEN ───────────────────────────────────
  if (step === 'processing') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid #C9A84C', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '2px' }}>Processing Payment...</p>
        <p style={{ color: '#444', fontSize: '11px', marginTop: '8px' }}>Please do not close this window</p>
      </div>
    </div>
  )

  // ── PAYMENT MODAL ───────────────────────────────────────
  if (step === 'payment') return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '480px', background: '#111', border: '1px solid rgba(201,168,76,0.3)', padding: '48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: 300, color: '#E8CC7A' }}>Complete Payment</div>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', marginTop: '4px' }}>
              {plans[selectedPlan]?.label} · {plans[selectedPlan]?.price}
            </div>
          </div>
          <button onClick={() => setStep('plans')} style={{ background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Payment method tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {['upi', 'card'].map(m => (
            <button key={m} onClick={() => setPaymentMethod(m)} style={{
              flex: 1, padding: '10px', background: paymentMethod === m ? '#C9A84C' : 'transparent',
              border: `1px solid ${paymentMethod === m ? '#C9A84C' : 'rgba(201,168,76,0.25)'}`,
              color: paymentMethod === m ? '#0A0A0A' : '#aaa',
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer'
            }}>
              {m === 'upi' ? '📱 UPI' : '💳 Card'}
            </button>
          ))}
        </div>

        {/* UPI Form */}
        {paymentMethod === 'upi' && (
          <div>
            <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', padding: '16px', marginBottom: '20px', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '2px', marginBottom: '8px' }}>SUPPORTED UPI APPS</div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '20px' }}>
                <span title="GPay">🟢</span>
                <span title="PhonePe">🟣</span>
                <span title="Paytm">🔵</span>
                <span title="BHIM">🟠</span>
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '8px' }}>Google Pay · PhonePe · Paytm · BHIM</div>
            </div>
            <label style={lbl}>UPI ID</label>
            <input
              placeholder="yourname@upi / yourname@okaxis"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              style={inp}
            />
            <div style={{ fontSize: '10px', color: '#444', marginTop: '6px', marginBottom: '24px' }}>
              Example: pujan@okicici · 9876543210@ybl
            </div>
          </div>
        )}

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <div>
            <label style={lbl}>Card Number</label>
            <input placeholder="1234 5678 9012 3456" value={cardNo}
              onChange={e => setCardNo(e.target.value.replace(/[^\d]/g,'').replace(/(.{4})/g,'$1 ').trim())}
              maxLength={19} style={{ ...inp, marginBottom: '16px' }} />

            <label style={lbl}>Cardholder Name</label>
            <input placeholder="PUJAN SHARMA" value={cardName}
              onChange={e => setCardName(e.target.value.toUpperCase())}
              style={{ ...inp, marginBottom: '16px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Expiry</label>
                <input placeholder="MM/YY" value={cardExp}
                  onChange={e => setCardExp(e.target.value)}
                  maxLength={5} style={inp} />
              </div>
              <div>
                <label style={lbl}>CVV</label>
                <input placeholder="•••" type="password" value={cardCvv}
                  onChange={e => setCardCvv(e.target.value)}
                  maxLength={3} style={inp} />
              </div>
            </div>
            <div style={{ height: 24 }} />
          </div>
        )}

        {error && <div style={{ color: '#ff7070', fontSize: '12px', marginBottom: '16px', padding: '10px', background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.2)' }}>{error}</div>}

        {/* Pay button */}
        <button onClick={handlePay} style={{ width: '100%', padding: '16px', background: '#C9A84C', color: '#0A0A0A', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
          Pay {plans[selectedPlan]?.price} →
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: '#333', letterSpacing: '1px' }}>
          🔒 SECURED · 256-BIT SSL ENCRYPTION
        </div>
      </div>
    </div>
  )

  // ── PLANS PAGE ──────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', background: '#111', backgroundImage: 'radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.07) 0%,transparent 70%)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 64px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#C9A84C', display: 'block', marginBottom: '16px' }}>✦ Cineverse Premium</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, marginBottom: '20px', lineHeight: 1.1 }}>
            All Industries. <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Zero Limits.</em>
          </h1>
          <p style={{ fontSize: '14px', color: '#aaa', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto', fontWeight: 300 }}>
            Hollywood, Bollywood, Tollywood, Marathi & more — 700+ films, 4K streaming, zero ads.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '60px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', border: '1px solid rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.03)' }}>
              <span style={{ width: 28, height: 28, flexShrink: 0, border: '1px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '12px' }}>◈</span>
              <span style={{ fontSize: '12px', color: '#ccc' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plan Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Monthly */}
          <div style={{ padding: '44px 36px', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.03)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>Monthly Plan</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '64px', fontWeight: 300, lineHeight: 1, marginBottom: '8px' }}>₹149</div>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '36px' }}>per month · cancel anytime</div>
            <button onClick={() => handleSelectPlan('monthly')} style={{ width: '100%', padding: '14px', border: '1px solid #C9A84C', background: 'transparent', color: '#C9A84C', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Start Monthly
            </button>
          </div>

          {/* Yearly */}
          <div style={{ padding: '44px 36px', position: 'relative', border: '1px solid #C9A84C', background: 'rgba(201,168,76,0.07)' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: '#C9A84C', color: '#0A0A0A', fontSize: '8px', fontWeight: 700, letterSpacing: '2px', padding: '4px 20px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>✦ Best Value — Save 33%</div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>Annual Plan</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '64px', fontWeight: 300, lineHeight: 1, marginBottom: '8px' }}>₹999</div>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '36px' }}>per year · only ₹83/month</div>
            <button onClick={() => handleSelectPlan('yearly')} style={{ width: '100%', padding: '14px', border: '1px solid #C9A84C', background: '#C9A84C', color: '#0A0A0A', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Start Annual — Best Deal
            </button>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#333', letterSpacing: '1.5px' }}>7-DAY FREE TRIAL · NO CREDIT CARD REQUIRED</p>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }
const inp = { width: '100%', padding: '13px 16px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F0E8', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }
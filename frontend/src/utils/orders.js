// Display metadata for each order status (mirrors the backend Order model)
export const ORDER_STATUS = {
  awaiting_payment: { label: 'Awaiting payment', color: 'var(--yellow)', bg: 'rgba(245,158,11,0.12)', pending: true,
    hint: 'Transfer the exact amount to the account shown, then tap "I have made payment".' },
  awaiting_receipt: { label: 'Upload receipt', color: 'var(--yellow)', bg: 'rgba(245,158,11,0.12)', pending: true,
    hint: 'Upload your transfer receipt so we can confirm your payment.' },
  under_review: { label: 'Under review', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', pending: true,
    hint: "We're confirming your payment. Your crypto will be sent once it's verified." },
  completed: { label: 'Completed', color: 'var(--green)', bg: 'var(--green-light)',
    hint: 'Your crypto has been sent to your wallet.' },
  rejected: { label: 'Rejected', color: 'var(--red)', bg: 'var(--red-light)',
    hint: "We couldn't confirm this payment." },
  cancelled: { label: 'Cancelled', color: 'var(--text-muted)', bg: 'rgba(100,116,139,0.15)',
    hint: 'This order was cancelled.' },
  expired: { label: 'Expired', color: 'var(--text-muted)', bg: 'rgba(100,116,139,0.15)',
    hint: 'The payment window ended before payment was confirmed.' },
}

export const isPending = (status) => !!ORDER_STATUS[status]?.pending

// The steps shown on the order page
export const ORDER_STEPS = [
  { key: 'created', label: 'Order placed' },
  { key: 'paid', label: 'Payment sent' },
  { key: 'review', label: 'Payment confirmed' },
  { key: 'done', label: 'Crypto sent' },
]

export const stepIndex = (status) =>
  ({ awaiting_payment: 0, awaiting_receipt: 1, under_review: 2, completed: 4 })[status] ?? 0

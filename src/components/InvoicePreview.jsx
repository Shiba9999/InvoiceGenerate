import React from 'react'
import { Printer, FileText, Users, MapPin, Calendar, IndianRupee } from 'lucide-react'

function InvoicePreview({
  businessInfo,
  customerInfo,
  invoiceNumber,
  selectedItems,
  guestCount,
  customFlatCharges,
  discountRate,
  taxRate,
  deliveryCharge,
  handlePrint,
  invoiceTheme = 'navy',
  setInvoiceTheme,
  isMobile = false
}) {
  // ── Calculations ────────────────────────────────────────────────────────────
  const platePerCost    = selectedItems.reduce((acc, curr) => acc + curr.unitPrice, 0)
  const baseSubtotal    = platePerCost * guestCount
  const discountAmount  = baseSubtotal * (discountRate / 100)
  const afterDiscount   = baseSubtotal - discountAmount
  const taxAmount       = afterDiscount * (taxRate / 100)
  const flatChargesTotal = customFlatCharges.reduce((acc, curr) => acc + curr.amount, 0)
  const grandTotal      = afterDiscount + taxAmount + parseFloat(deliveryCharge || 0) + flatChargesTotal
  const perPlateCost    = guestCount > 0 && selectedItems.length > 0
    ? (grandTotal / guestCount).toFixed(2) : null

  // ── Category ordering ───────────────────────────────────────────────────────
  const categoryOrder = [
    'Welcome Drinks','Soup Disc','Veg Starter','Non Veg Starter',
    'Moglai Counter','Plate Counter','Main Course (Veg)',
    'Main Course (Non Veg)','Desert','Counters','Custom Dish'
  ]

  const groupedItems = {}
  selectedItems.forEach(item => {
    const cat = item.category || 'Custom Dish'
    if (!groupedItems[cat]) groupedItems[cat] = []
    groupedItems[cat].push(item)
  })

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    let ia = categoryOrder.indexOf(a); let ib = categoryOrder.indexOf(b)
    if (ia === -1) ia = 99; if (ib === -1) ib = 99
    return ia - ib
  })

  let globalItemIndex = 1

  // ════════════════════════════════════════════════════════════════════════════
  // MOBILE SUMMARY VIEW — compact, single-screen, no scroll
  // ════════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div className="mobile-preview-root">

        {/* ── Header card ── */}
        <div className="mp-header-card">
          <div className="mp-header-left">
            <div className="mp-brand">{businessInfo.name}</div>
            <div className="mp-inv-num">INV #{invoiceNumber}</div>
          </div>
          <div className="mp-header-right">
            <button className="mp-print-btn" onClick={handlePrint}>
              <Printer size={15} /> Print PDF
            </button>
            <select
              className="mp-theme-select"
              value={invoiceTheme}
              onChange={e => setInvoiceTheme(e.target.value)}
            >
              <optgroup label="Light">
                <option value="navy">Navy & Teal</option>
                <option value="emerald">Emerald</option>
                <option value="indigo">Indigo</option>
                <option value="slate">Slate</option>
                <option value="burgundy">Burgundy</option>
                <option value="light">Minimal</option>
                <option value="amber">Amber Gold</option>
                <option value="rosegold">Rose Gold</option>
              </optgroup>
              <optgroup label="Dark">
                <option value="dark">Dark 🌙</option>
                <option value="synthwave">Synthwave ⚡</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* ── Event info strip ── */}
        <div className="mp-info-strip">
          <div className="mp-info-chip">
            <Users size={13} />
            <span>{guestCount} plates</span>
          </div>
          <div className="mp-info-chip">
            <Calendar size={13} />
            <span>{customerInfo.eventDate || '—'}</span>
          </div>
          {customerInfo.eventVenue && (
            <div className="mp-info-chip">
              <MapPin size={13} />
              <span>{customerInfo.eventVenue}</span>
            </div>
          )}
        </div>

        {/* ── Items list ── */}
        <div className="mp-items-section">
          <div className="mp-section-label">
            <FileText size={13} />
            Selected Items ({selectedItems.length})
          </div>

          {selectedItems.length === 0 ? (
            <div className="mp-empty">
              No items yet. Go to Build tab to add food items.
            </div>
          ) : (
            <div className="mp-items-list">
              {sortedCategories.map(cat => (
                <React.Fragment key={cat}>
                  <div className="mp-cat-row">{cat}</div>
                  {groupedItems[cat].map(item => (
                    <div className="mp-item-row" key={item.id}>
                      <span className="mp-item-name">{item.name}</span>
                      <span className="mp-item-total">
                        ₹{(item.unitPrice * guestCount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* ── Totals card ── */}
        <div className="mp-totals-card">
          <div className="mp-totals-row">
            <span>Subtotal ({selectedItems.length} items)</span>
            <span>₹{baseSubtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountRate > 0 && (
            <div className="mp-totals-row mp-discount">
              <span>Discount ({discountRate}%)</span>
              <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="mp-totals-row">
              <span>Tax ({taxRate}%)</span>
              <span>+₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {parseFloat(deliveryCharge) > 0 && (
            <div className="mp-totals-row">
              <span>Delivery</span>
              <span>+₹{parseFloat(deliveryCharge).toLocaleString('en-IN')}</span>
            </div>
          )}
          {customFlatCharges.map(c => (
            <div className="mp-totals-row" key={c.id}>
              <span>{c.name}</span>
              <span>+₹{c.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="mp-grand-total-row">
            <span>Grand Total</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          {perPlateCost && (
            <div className="mp-per-plate">
              <IndianRupee size={11} />{perPlateCost} per plate
            </div>
          )}
        </div>

        {/* ── Payment info ── */}
        {(businessInfo.upiId || businessInfo.qrCodeUrl || businessInfo.bankAcc) && (
          <div className="mp-payment-card">
            <div className="mp-section-label" style={{ marginBottom: 8 }}>Payment</div>
            <div className="mp-payment-row">
              {businessInfo.qrCodeUrl && (
                <img src={businessInfo.qrCodeUrl} alt="QR" className="mp-qr-img" />
              )}
              <div className="mp-payment-details">
                {businessInfo.upiId && (
                  <div className="mp-upi">📱 {businessInfo.upiId}</div>
                )}
                {businessInfo.bankName && (
                  <div className="mp-bank-line">{businessInfo.bankName}</div>
                )}
                {businessInfo.bankAcc && (
                  <div className="mp-bank-line">A/C: {businessInfo.bankAcc}</div>
                )}
                {businessInfo.bankIfsc && (
                  <div className="mp-bank-line">IFSC: {businessInfo.bankIfsc}</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DESKTOP — full A4 invoice document (unchanged)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <main className="preview-panel">
      {/* Floating Tool Controls */}
      <div className="preview-header-actions no-print">
        <div className="preview-title-block">
          <span className="preview-heading">Invoice Sheet Preview</span>
          <span className="badge">A4 Vector Print Ready</span>
        </div>
        <div className="action-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="theme-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Style Theme:</span>
            <select
              className="form-select"
              value={invoiceTheme}
              onChange={e => setInvoiceTheme(e.target.value)}
              style={{ width: '220px', padding: '6px 12px', fontSize: '0.8rem', height: '36px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <optgroup label="Modern Light Themes">
                <option value="navy">Midnight Navy & Teal</option>
                <option value="emerald">Forest Emerald & Mint</option>
                <option value="indigo">Royal Indigo & Lavender</option>
                <option value="slate">Slate Blue & Charcoal</option>
                <option value="burgundy">Burgundy & Crimson</option>
                <option value="light">Classic Minimal Light</option>
                <option value="amber">Amber Gold & Foil</option>
                <option value="rosegold">Champagne & Rose Gold</option>
              </optgroup>
              <optgroup label="Innovative Dark Themes">
                <option value="dark">Midnight Premium Dark 🌙</option>
                <option value="synthwave">Cyberpunk Synthwave ⚡</option>
              </optgroup>
            </select>
          </div>
          <button className="action-btn action-btn-primary print-trigger-btn" onClick={handlePrint} style={{ height: '36px', padding: '0 16px' }}>
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Invoice Sheet */}
      <div className={`invoice-sheet-container theme-${invoiceTheme}`}>
        <div className="invoice-sheet-top">
          <div className="invoice-header">
            <div className="invoice-brand">
              <span className="invoice-brand-name">{businessInfo.name}</span>
              <span className="invoice-brand-tagline">{businessInfo.tagline}</span>
              <span className="invoice-brand-address">
                {businessInfo.address}
                {businessInfo.phone && `\nMob: ${businessInfo.phone}`}
                {businessInfo.email && `\nEmail: ${businessInfo.email}`}
              </span>
            </div>
            <div className="invoice-meta-block">
              <span className="invoice-title-label">Invoice</span>
              <span className="invoice-number-label">INV #{invoiceNumber}</span>
              <div className="invoice-meta-dates">
                <span className="invoice-meta-item">Date: <span className="invoice-meta-value">{new Date().toLocaleDateString()}</span></span>
                <span className="invoice-meta-item">Event Date: <span className="invoice-meta-value">{customerInfo.eventDate || 'N/A'}</span></span>
                <span className="invoice-meta-item">Service Type: <span className="invoice-meta-value">{customerInfo.eventType}</span></span>
              </div>
            </div>
          </div>

          <div className="invoice-billing-grid">
            <div className="billing-col">
              <div className="billing-section-title">Client Details</div>
              <div className="billing-detail-name">{customerInfo.name || 'Valued Customer'}</div>
              {customerInfo.phone && <div className="billing-detail-item"><span className="billing-detail-label">Phone:</span><span>{customerInfo.phone}</span></div>}
              {customerInfo.email && <div className="billing-detail-item"><span className="billing-detail-label">Email:</span><span>{customerInfo.email}</span></div>}
            </div>
            <div className="billing-col">
              <div className="billing-section-title">Event Logistics</div>
              <div className="billing-detail-item"><span className="billing-detail-label">Venue:</span><span>{customerInfo.eventVenue || 'To Be Specified'}</span></div>
              <div className="billing-detail-item"><span className="billing-detail-label">Guests Count:</span><span className="plates-count-highlight">{guestCount} plates</span></div>
            </div>
          </div>

          <div className="invoice-table-container">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th className="col-idx">#</th>
                  <th className="col-desc">Selected Catering Menu Items</th>
                  <th className="col-cat">Category</th>
                  <th className="col-price">Per Plate</th>
                  <th className="col-qty">Plates</th>
                  <th className="col-total">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.length === 0 ? (
                  <tr><td colSpan="6" className="table-empty-row">No items selected. Add foods from the sidebar catalog to generate calculation lines.</td></tr>
                ) : (
                  sortedCategories.map(categoryName => (
                    <React.Fragment key={categoryName}>
                      <tr className="invoice-category-header-row">
                        <td colSpan="6" className="invoice-category-header-cell">
                          <span className="category-header-bullet">•</span> {categoryName.toUpperCase()}
                        </td>
                      </tr>
                      {groupedItems[categoryName].map(item => {
                        const idx = globalItemIndex++
                        return (
                          <tr key={item.id} className="invoice-item-row">
                            <td className="col-idx">{idx}</td>
                            <td className="col-desc" style={{ paddingLeft: '24px', fontWeight: '600' }}>{item.name}</td>
                            <td className="col-cat">{item.category}</td>
                            <td className="col-price">₹{item.unitPrice.toFixed(2)}</td>
                            <td className="col-qty">{guestCount}</td>
                            <td className="col-total">₹{(item.unitPrice * guestCount).toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="invoice-sheet-bottom">
          <div className="invoice-summary-block">
            <div className="payment-info-box">
              <div className="bank-details-card">
                <div className="bank-details-title">Bank Details for Payment Transfer</div>
                <div className="bank-detail-row"><span>Beneficiary Bank:</span><span className="bank-detail-val">{businessInfo.bankName}</span></div>
                <div className="bank-detail-row"><span>Account Number:</span><span className="bank-detail-val">{businessInfo.bankAcc}</span></div>
                <div className="bank-detail-row"><span>IFSC Code:</span><span className="bank-detail-val">{businessInfo.bankIfsc}</span></div>
                {businessInfo.upiId && (
                  <div className="bank-detail-row upi-row">
                    <span>UPI ID:</span>
                    <span className="bank-detail-val upi-val">📱 {businessInfo.upiId}</span>
                  </div>
                )}
              </div>
              {businessInfo.qrCodeUrl && (
                <div className="invoice-qr-block">
                  <div className="invoice-qr-label">Scan to Pay</div>
                  <img src={businessInfo.qrCodeUrl} alt="Payment QR Code" className="invoice-qr-img" />
                  {businessInfo.upiId && <div className="invoice-qr-upi">{businessInfo.upiId}</div>}
                </div>
              )}
              {businessInfo.terms && (
                <div className="invoice-notes-block">
                  <div className="terms-header">Terms & Conditions</div>
                  <div className="terms-body-text">{businessInfo.terms}</div>
                </div>
              )}
            </div>

            <div className="totals-computation-box">
              <div className="totals-table">
                <div className="totals-row"><span>Catering Items Subtotal ({selectedItems.length} items):</span><span>₹{baseSubtotal.toFixed(2)}</span></div>
                {discountRate > 0 && <div className="totals-row totals-row-accent discount-highlight"><span>Discount ({discountRate}%):</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
                {discountRate > 0 && <div className="totals-row"><span>After Discount Subtotal:</span><span>₹{afterDiscount.toFixed(2)}</span></div>}
                {taxRate > 0 && <div className="totals-row"><span>Taxes ({taxRate}%):</span><span>+₹{taxAmount.toFixed(2)}</span></div>}
                {parseFloat(deliveryCharge) > 0 && <div className="totals-row"><span>Delivery & Transport:</span><span>+₹{parseFloat(deliveryCharge).toFixed(2)}</span></div>}
                {customFlatCharges.length > 0 && (
                  <div className="flat-charges-breakdown">
                    <div className="billing-section-title flat-breakdown-title">Flat Charges Details</div>
                    {customFlatCharges.map(charge => (
                      <div key={charge.id} className="totals-row flat-detail-row"><span>{charge.name}:</span><span>+₹{charge.amount.toFixed(2)}</span></div>
                    ))}
                    <div className="totals-row flat-summary-row"><span>Extra Add-ons Subtotal:</span><span>+₹{flatChargesTotal.toFixed(2)}</span></div>
                  </div>
                )}
                <div className="grand-total-row"><span>Grand Total:</span><span className="grand-total-primary">₹{grandTotal.toFixed(2)}</span></div>
                {perPlateCost && (
                  <div className="effective-plate-cost-tag">
                    Effective Cost: <span className="highlight-tag">₹{perPlateCost} / plate</span> (per guest)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="invoice-footer">
            <span className="invoice-footer-thanks">Thank you for letting us serve you!</span>
            <div className="signature-block">
              <div className="signature-line"></div>
              <div className="signature-label">Authorized Signature</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default InvoicePreview

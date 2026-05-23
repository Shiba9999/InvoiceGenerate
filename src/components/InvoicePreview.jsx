import React from 'react'
import { Printer } from 'lucide-react'

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
  setInvoiceTheme
}) {
  // Math calculations
  const platePerCost = selectedItems.reduce((acc, curr) => acc + curr.unitPrice, 0)
  const baseSubtotal = platePerCost * guestCount
  const discountAmount = baseSubtotal * (discountRate / 100)
  const afterDiscount = baseSubtotal - discountAmount
  const taxAmount = afterDiscount * (taxRate / 100)
  const flatChargesTotal = customFlatCharges.reduce((acc, curr) => acc + curr.amount, 0)
  const grandTotal = afterDiscount + taxAmount + parseFloat(deliveryCharge || 0) + flatChargesTotal

  // Standard Catering Course Order for Menu Grouping
  const categoryOrder = [
    'Welcome Drinks',
    'Soup Disc',
    'Veg Starter',
    'Non Veg Starter',
    'Moglai Counter',
    'Plate Counter',
    'Main Course (Veg)',
    'Main Course (Non Veg)',
    'Desert',
    'Counters',
    'Custom Dish'
  ]

  // Group items by category
  const groupedItems = {}
  selectedItems.forEach(item => {
    const cat = item.category || 'Custom Dish'
    if (!groupedItems[cat]) {
      groupedItems[cat] = []
    }
    groupedItems[cat].push(item)
  })

  // Sort categories chronologically
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    let idxA = categoryOrder.indexOf(a)
    let idxB = categoryOrder.indexOf(b)
    if (idxA === -1) idxA = 99
    if (idxB === -1) idxB = 99
    return idxA - idxB
  })

  let globalItemIndex = 1

  return (
    <main className="preview-panel">
      {/* Floating Tool Controls above Invoice Sheet */}
      <div className="preview-header-actions no-print">
        <div className="preview-title-block">
          <span className="preview-heading">Invoice Sheet Preview</span>
          <span className="badge">A4 Vector Print Ready</span>
        </div>
        <div className="action-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="theme-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Style Theme:</span>
            <select 
              id="invoice-theme-select"
              className="form-select" 
              value={invoiceTheme} 
              onChange={(e) => setInvoiceTheme(e.target.value)}
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

      {/* ----------------- ACTUAL INVOICE PRINT SHEET ----------------- */}
      <div className={`invoice-sheet-container theme-${invoiceTheme}`}>
        
        {/* Header Block: Brand, Slogan, and Invoice Meta Details */}
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

          {/* Customer Details & Event Logistics Grid */}
          <div className="invoice-billing-grid">
            <div className="billing-col">
              <div className="billing-section-title">Client Details</div>
              <div className="billing-detail-name">{customerInfo.name || 'Valued Customer'}</div>
              {customerInfo.phone && (
                <div className="billing-detail-item">
                  <span className="billing-detail-label">Phone:</span>
                  <span>{customerInfo.phone}</span>
                </div>
              )}
              {customerInfo.email && (
                <div className="billing-detail-item">
                  <span className="billing-detail-label">Email:</span>
                  <span>{customerInfo.email}</span>
                </div>
              )}
            </div>

            <div className="billing-col">
              <div className="billing-section-title">Event Logistics</div>
              <div className="billing-detail-item">
                <span className="billing-detail-label">Venue:</span>
                <span>{customerInfo.eventVenue || 'To Be Specified'}</span>
              </div>
              <div className="billing-detail-item">
                <span className="billing-detail-label">Guests Count:</span>
                <span className="plates-count-highlight">{guestCount} plates</span>
              </div>
            </div>
          </div>

          {/* Menu Items Table */}
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
                  <tr>
                    <td colSpan="6" className="table-empty-row">
                      No items selected. Add foods from the sidebar catalog to generate calculation lines.
                    </td>
                  </tr>
                ) : (
                  sortedCategories.map(categoryName => (
                    <React.Fragment key={categoryName}>
                      {/* Beautiful category sub-header row */}
                      <tr className="invoice-category-header-row">
                        <td colSpan="6" className="invoice-category-header-cell">
                          <span className="category-header-bullet">•</span> {categoryName.toUpperCase()}
                        </td>
                      </tr>
                      {/* Items under this category */}
                      {groupedItems[categoryName].map(item => {
                        const currentIdx = globalItemIndex++
                        return (
                          <tr key={item.id} className="invoice-item-row">
                            <td className="col-idx">{currentIdx}</td>
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

        {/* Bottom Calculations, Terms, and Signatures Block */}
        <div className="invoice-sheet-bottom">
          <div className="invoice-summary-block">
            {/* Payment Details & Bank Details */}
            <div className="payment-info-box">
              <div className="bank-details-card">
                <div className="bank-details-title">Bank Details for Payment Transfer</div>
                <div className="bank-detail-row">
                  <span>Beneficiary Bank:</span>
                  <span className="bank-detail-val">{businessInfo.bankName}</span>
                </div>
                <div className="bank-detail-row">
                  <span>Account Number:</span>
                  <span className="bank-detail-val">{businessInfo.bankAcc}</span>
                </div>
                <div className="bank-detail-row">
                  <span>IFSC Code:</span>
                  <span className="bank-detail-val">{businessInfo.bankIfsc}</span>
                </div>
                {businessInfo.upiId && (
                  <div className="bank-detail-row upi-row">
                    <span>UPI ID:</span>
                    <span className="bank-detail-val upi-val">📱 {businessInfo.upiId}</span>
                  </div>
                )}
              </div>

              {/* QR Code block */}
              {businessInfo.qrCodeUrl && (
                <div className="invoice-qr-block">
                  <div className="invoice-qr-label">Scan to Pay</div>
                  <img 
                    src={businessInfo.qrCodeUrl} 
                    alt="Payment QR Code" 
                    className="invoice-qr-img"
                  />
                  {businessInfo.upiId && (
                    <div className="invoice-qr-upi">{businessInfo.upiId}</div>
                  )}
                </div>
              )}

              {businessInfo.terms && (
                <div className="invoice-notes-block">
                  <div className="terms-header">Terms & Conditions</div>
                  <div className="terms-body-text">{businessInfo.terms}</div>
                </div>
              )}
            </div>

            {/* Totals Computations */}
            <div className="totals-computation-box">
              <div className="totals-table">
                <div className="totals-row">
                  <span>Catering Items Subtotal ({selectedItems.length} items):</span>
                  <span>₹{baseSubtotal.toFixed(2)}</span>
                </div>
                
                {discountRate > 0 && (
                  <div className="totals-row totals-row-accent discount-highlight">
                    <span>Discount ({discountRate}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {discountRate > 0 && (
                  <div className="totals-row">
                    <span>After Discount Subtotal:</span>
                    <span>₹{afterDiscount.toFixed(2)}</span>
                  </div>
                )}

                {taxRate > 0 && (
                  <div className="totals-row">
                    <span>Taxes ({taxRate}%):</span>
                    <span>+₹{taxAmount.toFixed(2)}</span>
                  </div>
                )}

                {parseFloat(deliveryCharge) > 0 && (
                  <div className="totals-row">
                    <span>Delivery & Transport:</span>
                    <span>+₹{parseFloat(deliveryCharge).toFixed(2)}</span>
                  </div>
                )}

                {customFlatCharges.length > 0 && (
                  <div className="flat-charges-breakdown">
                    <div className="billing-section-title flat-breakdown-title">Flat Charges Details</div>
                    {customFlatCharges.map(charge => (
                      <div key={charge.id} className="totals-row flat-detail-row">
                        <span>{charge.name}:</span>
                        <span>+₹{charge.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="totals-row flat-summary-row">
                      <span>Extra Add-ons Subtotal:</span>
                      <span>+₹{flatChargesTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="grand-total-row">
                  <span>Grand Total:</span>
                  <span className="grand-total-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
                
                {guestCount > 0 && selectedItems.length > 0 && (
                  <div className="effective-plate-cost-tag">
                    Effective Cost: <span className="highlight-tag">₹{(grandTotal / guestCount).toFixed(2)} / plate</span> (per guest)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Print Signature & Greetings */}
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

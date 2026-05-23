import React, { useState } from 'react'
import { 
  Search, Plus, Trash2, History, Save, 
  Settings, CreditCard, Sparkles, AlertCircle, RefreshCw, Calendar, Phone, Mail, MapPin 
} from 'lucide-react'
import { LAXMI_FOOD_ITEMS, LAXMI_CATEGORIES } from '../foods'

function SidebarConfig({
  customerInfo,
  setCustomerInfo,
  guestCount,
  setGuestCount,
  invoiceNumber,
  setInvoiceNumber,
  selectedItems,
  setSelectedItems,
  customFlatCharges,
  setCustomFlatCharges,
  taxRate,
  setTaxRate,
  discountRate,
  setDiscountRate,
  deliveryCharge,
  setDeliveryCharge,
  businessInfo,
  setBusinessInfo,
  savedInvoices,
  activeSidebarTab,
  setActiveSidebarTab,
  handleResetInvoice,
  handleSaveInvoice,
  handleLoadInvoice,
  handleDeleteHistoryInvoice,
  handleAddFood,
  handleRemoveFood,
  handleUpdateItemPrice,
  handleAddCustomFood,
  handleAddFlatCharge,
  handleRemoveFlatCharge
}) {
  // Local UI States for forms
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [customItemName, setCustomItemName] = useState('')
  const [customItemPrice, setCustomItemPrice] = useState('')
  const [flatChargeName, setFlatChargeName] = useState('')
  const [flatChargeAmount, setFlatChargeAmount] = useState('')

  // Filter Catalog
  const filteredFoods = LAXMI_FOOD_ITEMS.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Submit wrappers
  const onAddCustomFood = (e) => {
    e.preventDefault()
    if (!customItemName || !customItemPrice) return
    handleAddCustomFood(customItemName, customItemPrice)
    setCustomItemName('')
    setCustomItemPrice('')
  }

  const onAddFlatCharge = (e) => {
    e.preventDefault()
    if (!flatChargeName || !flatChargeAmount) return
    handleAddFlatCharge(flatChargeName, flatChargeAmount)
    setFlatChargeName('')
    setFlatChargeAmount('')
  }

  const platePerCost = selectedItems.reduce((acc, curr) => acc + curr.unitPrice, 0)

  return (
    <aside className="configurator-sidebar no-print">
      {/* Sidebar Header & Navigation Tabs */}
      <div className="sidebar-header-nav">
        <div className="sidebar-branding-row">
          <div className="sidebar-logo-block">
            <Sparkles size={22} className="logo-sparkle" />
            <h2 className="sidebar-logo-title">Laxmi Catering</h2>
          </div>
          <button className="tab-btn reset-btn" onClick={handleResetInvoice} title="Start a fresh invoice draft">
            <RefreshCw size={12} /> <span className="btn-label-desktop">New Draft</span>
          </button>
        </div>
        
        <div className="sidebar-nav-tabs">
          <button 
            className={`tab-btn nav-tab ${activeSidebarTab === 'menu' ? 'active' : ''}`} 
            onClick={() => setActiveSidebarTab('menu')}
          >
            Order Details
          </button>
          <button 
            className={`tab-btn nav-tab ${activeSidebarTab === 'profile' ? 'active' : ''}`} 
            onClick={() => setActiveSidebarTab('profile')}
          >
            Settings
          </button>
          <button 
            className={`tab-btn nav-tab ${activeSidebarTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveSidebarTab('history')}
          >
            History <span className="history-badge">{savedInvoices.length}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Form Body */}
      <div className="sidebar-content">
        
        {/* TAB 1: MENU BUILDER & LOGISTICS */}
        {activeSidebarTab === 'menu' && (
          <>
            {/* Customer & Event Details */}
            <div className="form-section">
              <h3 className="section-title"><Calendar size={16} /> Customer & Event</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Customer Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Ramesh Kumar"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="e.g. 9437442533"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="customer@gmail.com"
                    value={customerInfo.email}
                    onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={customerInfo.eventDate}
                    onChange={e => setCustomerInfo({...customerInfo, eventDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select 
                    className="form-select" 
                    value={customerInfo.eventType}
                    onChange={e => setCustomerInfo({...customerInfo, eventType: e.target.value})}
                  >
                    <option value="Marriage Catering">Marriage Catering</option>
                    <option value="Reception Ceremony">Reception Ceremony</option>
                    <option value="Thread Ceremony">Thread Ceremony</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Private Feast">Private Feast</option>
                    <option value="Other Function">Other Function</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Venue / Event Address</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Royal Mandap, Bhubaneswar"
                    value={customerInfo.eventVenue}
                    onChange={e => setCustomerInfo({...customerInfo, eventVenue: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Guests (Plate Count)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1"
                    value={guestCount}
                    onChange={e => setGuestCount(Math.max(1, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Invoice Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Selected Items Configurator */}
            <div className="form-section">
              <h3 className="section-title"><Sparkles size={16} /> Selected Menu ({selectedItems.length})</h3>
              {selectedItems.length === 0 ? (
                <div className="empty-state-card">
                  No items selected yet. Choose items from the catalog below!
                </div>
              ) : (
                <div className="selected-list">
                  {selectedItems.map((item) => (
                    <div className="selected-item" key={item.id}>
                      <div className="selected-item-name">
                        {item.name}
                        <span className="selected-item-category">{item.category}</span>
                      </div>
                      <div className="selected-item-price-adjuster">
                        <span className="currency-label">₹</span>
                        <input 
                          type="number" 
                          className="selected-item-price-input" 
                          value={item.unitPrice} 
                          onChange={(e) => handleUpdateItemPrice(item.id, e.target.value)}
                        />
                        <span className="per-plate-label">/pl</span>
                      </div>
                      <button className="selected-item-remove" onClick={() => handleRemoveFood(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="base-plate-cost-banner">
                <span>Base Per-Plate Price:</span>
                <span className="cost-value">₹{platePerCost}</span>
              </div>
            </div>

            {/* Food Catalog */}
            <div className="form-section menu-catalog-section">
              <h3 className="section-title"><Plus size={16} /> Food Selection Catalog</h3>
              
              <div className="search-bar-container">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search foods (e.g. Mutton, Soup)..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="tabs-container">
                {LAXMI_CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    className={`tab-btn filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="food-grid">
                {filteredFoods.map(food => {
                  const isSelected = selectedItems.some(item => item.id === food.id)
                  return (
                    <div 
                      key={food.id} 
                      className={`food-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isSelected && handleAddFood(food)}
                    >
                      <div className="food-card-info">
                        <span className="food-card-name">{food.name}</span>
                        <span className="food-card-price">₹{food.unitPrice} per plate</span>
                        <span className="food-card-category">{food.category}</span>
                      </div>
                      <button className="food-card-add" disabled={isSelected}>
                        <Plus size={14} />
                      </button>
                    </div>
                  )
                })}
                {filteredFoods.length === 0 && (
                  <div className="catalog-empty-notice">
                    No matching items found.
                  </div>
                )}
              </div>
            </div>

            {/* Add Custom Dish */}
            <div className="form-section">
              <h3 className="section-title"><Plus size={16} /> Add Custom Dish (Per-Plate)</h3>
              <form onSubmit={onAddCustomFood} className="custom-adder">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Fish Tandoori Special"
                  value={customItemName}
                  onChange={e => setCustomItemName(e.target.value)}
                  style={{ flex: 2 }}
                />
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="₹ Price"
                  value={customItemPrice}
                  onChange={e => setCustomItemPrice(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="action-btn action-btn-primary icon-only-btn" title="Add custom dish">
                  <Plus size={16} />
                </button>
              </form>
            </div>

            {/* Flat Charges */}
            <div className="form-section">
              <h3 className="section-title"><Plus size={16} /> Flat Event Fees (Add-ons)</h3>
              <form onSubmit={onAddFlatCharge} className="custom-adder" style={{ marginBottom: '12px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Stage Setup / Transport Fee"
                  value={flatChargeName}
                  onChange={e => setFlatChargeName(e.target.value)}
                  style={{ flex: 2 }}
                />
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="₹ Fee"
                  value={flatChargeAmount}
                  onChange={e => setFlatChargeAmount(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="action-btn action-btn-primary icon-only-btn" title="Add flat charge">
                  <Plus size={16} />
                </button>
              </form>

              {customFlatCharges.length > 0 && (
                <div className="flat-charges-list">
                  {customFlatCharges.map(charge => (
                    <div className="selected-item flat-charge-item" key={charge.id}>
                      <span className="selected-item-name">{charge.name}</span>
                      <span className="flat-charge-val">₹{charge.amount}</span>
                      <button className="selected-item-remove" onClick={() => handleRemoveFlatCharge(charge.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing Adjusters */}
            <div className="form-section">
              <h3 className="section-title"><Settings size={16} /> Taxes, Discounts & Transport</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Discount %</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0" 
                    max="100"
                    value={discountRate}
                    onChange={e => setDiscountRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tax Rate %</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0"
                    value={taxRate}
                    onChange={e => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Delivery / Transport Charge (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0"
                    value={deliveryCharge}
                    onChange={e => setDeliveryCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: BUSINESS SETTINGS */}
        {activeSidebarTab === 'profile' && (
          <div className="sidebar-profile-column">
            <div className="form-section">
              <h3 className="section-title"><Settings size={16} /> Catering Details</h3>
              <div className="profile-inputs-stack">
                <div className="form-group">
                  <label className="form-label">Catering Brand Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={businessInfo.name}
                    onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Slogan / Tagline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={businessInfo.tagline}
                    onChange={e => setBusinessInfo({...businessInfo, tagline: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Contact</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={businessInfo.phone}
                    onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={businessInfo.email}
                    onChange={e => setBusinessInfo({...businessInfo, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Physical Address / Proprietor</label>
                  <textarea 
                    className="form-textarea" 
                    rows="3"
                    value={businessInfo.address}
                    onChange={e => setBusinessInfo({...businessInfo, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title"><CreditCard size={16} /> Bank Details (Payment)</h3>
              <div className="profile-inputs-stack">
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={businessInfo.bankName}
                    onChange={e => setBusinessInfo({...businessInfo, bankName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={businessInfo.bankAcc}
                    onChange={e => setBusinessInfo({...businessInfo, bankAcc: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={businessInfo.bankIfsc}
                    onChange={e => setBusinessInfo({...businessInfo, bankIfsc: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title"><AlertCircle size={16} /> Terms & Conditions</h3>
              <div className="form-group">
                <textarea 
                  className="form-textarea" 
                  rows="4"
                  value={businessInfo.terms}
                  onChange={e => setBusinessInfo({...businessInfo, terms: e.target.value})}
                />
              </div>
            </div>
            
            <button className="action-btn action-btn-primary" onClick={() => {
              localStorage.setItem('laxmi_catering_profile', JSON.stringify(businessInfo))
              alert('Business Settings saved locally!')
            }}>
              <Save size={16} /> Save Profile Settings
            </button>
          </div>
        )}

        {/* TAB 3: SAVED DRAFTS HISTORY LOG */}
        {activeSidebarTab === 'history' && (
          <div className="history-section">
            <h3 className="section-title"><History size={16} /> Saved Invoices Log</h3>
            {savedInvoices.length === 0 ? (
              <div className="history-empty-card">
                No saved invoices found. Save drafts to view them here.
              </div>
            ) : (
              <div className="history-list">
                {savedInvoices.map((inv) => (
                  <div key={inv.id} className="history-item" onClick={() => handleLoadInvoice(inv)}>
                    <div className="history-item-details">
                      <span className="history-item-title">{inv.customerInfo.name || 'Unnamed Client'}</span>
                      <span className="history-item-sub">{inv.id} • {inv.dateSaved}</span>
                      <span className="history-item-price">₹{inv.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="history-item-actions">
                      <button className="history-item-btn" onClick={(e) => handleDeleteHistoryInvoice(e, inv.id)} title="Delete from history">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Sticky Footer Actions */}
      <div className="sidebar-footer">
        <button className="action-btn action-btn-primary" onClick={handleSaveInvoice}>
          <Save size={16} /> Save Draft to History
        </button>
      </div>
    </aside>
  )
}

export default SidebarConfig

import { useState, useEffect } from 'react'
import SidebarConfig from './components/SidebarConfig'
import InvoicePreview from './components/InvoicePreview'
import './App.css'

function App() {
  // --- CENTRALIZED STATE MANAGEMENT ---
  const [selectedItems, setSelectedItems] = useState([])
  const [customFlatCharges, setCustomFlatCharges] = useState([])
  const [guestCount, setGuestCount] = useState(200)
  
  const [taxRate, setTaxRate] = useState(0)
  const [discountRate, setDiscountRate] = useState(0)
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: new Date().toISOString().split('T')[0],
    eventVenue: '',
    eventType: 'Marriage Catering'
  })

  const [businessInfo, setBusinessInfo] = useState({
    name: 'Laxmi Nrusingha Catering',
    tagline: 'Specialist in Delicious Food & Marriage Catering',
    phone: '9437442533, 9777512777',
    email: 'laxmicatering.gedanana@gmail.com',
    address: 'Proprietor: GEDA NANA\nBhubaneswar, Odisha, India',
    bankName: 'State Bank of India (SBI)',
    bankAcc: '31245678901',
    bankIfsc: 'SBIN0001234',
    upiId: '',
    qrCodeUrl: '',
    terms: '1. 40% advance payment required to book and block the date.\n2. Guest plate count confirmation must be done 3 days before the event.\n3. Balance must be cleared on the event day itself.\n4. Standard terms and conditions apply.'
  })

  const [savedInvoices, setSavedInvoices] = useState([])
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [activeSidebarTab, setActiveSidebarTab] = useState('menu')
  const [invoiceTheme, setInvoiceTheme] = useState(() => {
    return localStorage.getItem('laxmi_catering_invoice_theme') || 'navy'
  })

  // Mobile view: 'build' | 'preview'
  const [mobileView, setMobileView] = useState('build')

  useEffect(() => {
    localStorage.setItem('laxmi_catering_invoice_theme', invoiceTheme)
  }, [invoiceTheme])

  useEffect(() => {
    if (!invoiceNumber) generateNewInvoiceNumber()
  }, [])

  const generateNewInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    setInvoiceNumber(`LNC-${year}-${rand}`)
  }

  useEffect(() => {
    const savedProfile = localStorage.getItem('laxmi_catering_profile')
    if (savedProfile) {
      setBusinessInfo(JSON.parse(savedProfile))
    } else {
      localStorage.setItem('laxmi_catering_profile', JSON.stringify(businessInfo))
    }
    const storedInvoices = localStorage.getItem('laxmi_catering_invoices_history')
    if (storedInvoices) setSavedInvoices(JSON.parse(storedInvoices))
  }, [])

  const handleAddFood = (food) => {
    if (selectedItems.some(item => item.id === food.id)) return
    setSelectedItems([...selectedItems, { ...food }])
  }

  const handleRemoveFood = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id))
  }

  const handleUpdateItemPrice = (id, newPrice) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === id ? { ...item, unitPrice: parseFloat(newPrice) || 0 } : item
    ))
  }

  const handleAddCustomFood = (name, price) => {
    setSelectedItems([...selectedItems, {
      id: 'custom_food_' + Date.now(),
      name,
      category: 'Custom Dish',
      unitPrice: parseFloat(price) || 0,
      isCustom: true
    }])
  }

  const handleAddFlatCharge = (name, amount) => {
    setCustomFlatCharges([...customFlatCharges, {
      id: 'flat_' + Date.now(),
      name,
      amount: parseFloat(amount) || 0
    }])
  }

  const handleRemoveFlatCharge = (id) => {
    setCustomFlatCharges(customFlatCharges.filter(item => item.id !== id))
  }

  const handleSaveInvoice = () => {
    const platePerCost = selectedItems.reduce((acc, curr) => acc + curr.unitPrice, 0)
    const baseSubtotal = platePerCost * guestCount
    const discountAmount = baseSubtotal * (discountRate / 100)
    const afterDiscount = baseSubtotal - discountAmount
    const taxAmount = afterDiscount * (taxRate / 100)
    const flatChargesTotal = customFlatCharges.reduce((acc, curr) => acc + curr.amount, 0)
    const grandTotal = afterDiscount + taxAmount + parseFloat(deliveryCharge || 0) + flatChargesTotal

    const newInvoice = {
      id: invoiceNumber, customerInfo, selectedItems, customFlatCharges,
      guestCount, taxRate, discountRate, deliveryCharge, grandTotal,
      invoiceTheme, dateSaved: new Date().toLocaleDateString()
    }

    let updatedHistory = []
    const index = savedInvoices.findIndex(inv => inv.id === invoiceNumber)
    if (index > -1) {
      updatedHistory = [...savedInvoices]
      updatedHistory[index] = newInvoice
    } else {
      updatedHistory = [newInvoice, ...savedInvoices]
    }

    setSavedInvoices(updatedHistory)
    localStorage.setItem('laxmi_catering_invoices_history', JSON.stringify(updatedHistory))
    alert(`Draft INV #${invoiceNumber} successfully saved!`)
  }

  const handleLoadInvoice = (inv) => {
    setInvoiceNumber(inv.id)
    setCustomerInfo(inv.customerInfo)
    setSelectedItems(inv.selectedItems || [])
    setCustomFlatCharges(inv.customFlatCharges || [])
    setGuestCount(inv.guestCount || 200)
    setTaxRate(inv.taxRate ?? 0)
    setDiscountRate(inv.discountRate ?? 0)
    setDeliveryCharge(inv.deliveryCharge ?? 0)
    if (inv.invoiceTheme) setInvoiceTheme(inv.invoiceTheme)
    setActiveSidebarTab('menu')
  }

  const handleDeleteHistoryInvoice = (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this invoice from history?')) return
    const updated = savedInvoices.filter(inv => inv.id !== id)
    setSavedInvoices(updated)
    localStorage.setItem('laxmi_catering_invoices_history', JSON.stringify(updated))
  }

  const handleResetInvoice = () => {
    if (!confirm('Clear all entries and start a new invoice?')) return
    setSelectedItems([])
    setCustomFlatCharges([])
    setGuestCount(200)
    setDiscountRate(0)
    setDeliveryCharge(0)
    setCustomerInfo({
      name: '', phone: '', email: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventVenue: '', eventType: 'Marriage Catering'
    })
    generateNewInvoiceNumber()
  }

  const handlePrint = () => window.print()

  const sharedProps = {
    businessInfo, customerInfo, invoiceNumber, selectedItems,
    guestCount, customFlatCharges, discountRate, taxRate, deliveryCharge,
    invoiceTheme, setInvoiceTheme, handlePrint
  }

  return (
    <div className="app-container">
      {/* ── DESKTOP: side-by-side layout ── */}
      <div className="desktop-layout">
        <SidebarConfig
          customerInfo={customerInfo} setCustomerInfo={setCustomerInfo}
          guestCount={guestCount} setGuestCount={setGuestCount}
          invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
          selectedItems={selectedItems} setSelectedItems={setSelectedItems}
          customFlatCharges={customFlatCharges} setCustomFlatCharges={setCustomFlatCharges}
          taxRate={taxRate} setTaxRate={setTaxRate}
          discountRate={discountRate} setDiscountRate={setDiscountRate}
          deliveryCharge={deliveryCharge} setDeliveryCharge={setDeliveryCharge}
          businessInfo={businessInfo} setBusinessInfo={setBusinessInfo}
          savedInvoices={savedInvoices}
          activeSidebarTab={activeSidebarTab} setActiveSidebarTab={setActiveSidebarTab}
          handleResetInvoice={handleResetInvoice} handleSaveInvoice={handleSaveInvoice}
          handleLoadInvoice={handleLoadInvoice} handleDeleteHistoryInvoice={handleDeleteHistoryInvoice}
          handleAddFood={handleAddFood} handleRemoveFood={handleRemoveFood}
          handleUpdateItemPrice={handleUpdateItemPrice} handleAddCustomFood={handleAddCustomFood}
          handleAddFlatCharge={handleAddFlatCharge} handleRemoveFlatCharge={handleRemoveFlatCharge}
        />
        <InvoicePreview {...sharedProps} />
      </div>

      {/* ── MOBILE: full-screen tab switcher ── */}
      <div className="mobile-layout">
        {/* Top bar */}
        <div className="mobile-topbar">
          <div className="mobile-brand">
            <span className="mobile-brand-name">Laxmi Catering</span>
            {selectedItems.length > 0 && (
              <span className="mobile-item-badge">{selectedItems.length} items</span>
            )}
          </div>
          <button className="mobile-new-btn" onClick={handleResetInvoice}>New</button>
        </div>

        {/* Tab content — full screen scrollable */}
        <div className="mobile-content">
          {mobileView === 'build' && (
            <SidebarConfig
              customerInfo={customerInfo} setCustomerInfo={setCustomerInfo}
              guestCount={guestCount} setGuestCount={setGuestCount}
              invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
              selectedItems={selectedItems} setSelectedItems={setSelectedItems}
              customFlatCharges={customFlatCharges} setCustomFlatCharges={setCustomFlatCharges}
              taxRate={taxRate} setTaxRate={setTaxRate}
              discountRate={discountRate} setDiscountRate={setDiscountRate}
              deliveryCharge={deliveryCharge} setDeliveryCharge={setDeliveryCharge}
              businessInfo={businessInfo} setBusinessInfo={setBusinessInfo}
              savedInvoices={savedInvoices}
              activeSidebarTab={activeSidebarTab} setActiveSidebarTab={setActiveSidebarTab}
              handleResetInvoice={handleResetInvoice} handleSaveInvoice={handleSaveInvoice}
              handleLoadInvoice={handleLoadInvoice} handleDeleteHistoryInvoice={handleDeleteHistoryInvoice}
              handleAddFood={handleAddFood} handleRemoveFood={handleRemoveFood}
              handleUpdateItemPrice={handleUpdateItemPrice} handleAddCustomFood={handleAddCustomFood}
              handleAddFlatCharge={handleAddFlatCharge} handleRemoveFlatCharge={handleRemoveFlatCharge}
              isMobile={true}
            />
          )}
          {mobileView === 'preview' && (
            <InvoicePreview {...sharedProps} isMobile={true} />
          )}
        </div>

        {/* Bottom navigation bar */}
        <nav className="mobile-bottom-nav">
          <button
            className={`mobile-nav-btn ${mobileView === 'build' ? 'active' : ''}`}
            onClick={() => setMobileView('build')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Build</span>
          </button>
          <button
            className="mobile-nav-btn mobile-save-center"
            onClick={handleSaveInvoice}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>Save</span>
          </button>
          <button
            className={`mobile-nav-btn ${mobileView === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileView('preview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Preview</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default App

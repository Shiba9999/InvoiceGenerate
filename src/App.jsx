import { useState, useEffect } from 'react'
import SidebarConfig from './components/SidebarConfig'
import InvoicePreview from './components/InvoicePreview'
import './App.css'

function App() {
  // --- CENTRALIZED STATE MANAGEMENT ---
  const [selectedItems, setSelectedItems] = useState([])
  const [customFlatCharges, setCustomFlatCharges] = useState([])
  const [guestCount, setGuestCount] = useState(200) // Default 200 guests for catering
  
  // Tax / Discounts / Delivery
  const [taxRate, setTaxRate] = useState(0) // default 0%
  const [discountRate, setDiscountRate] = useState(0) // default 0%
  const [deliveryCharge, setDeliveryCharge] = useState(0) // default 0
  
  // Customer & Event Info
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: new Date().toISOString().split('T')[0],
    eventVenue: '',
    eventType: 'Marriage Catering'
  })

  // Business Profile - PREFILLED WITH LAXMI NRUSINGHA CATERING DETAILS
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Laxmi Nrusingha Catering',
    tagline: 'Specialist in Delicious Food & Marriage Catering',
    phone: '9437442533, 9777512777',
    email: 'laxmicatering.gedanana@gmail.com',
    address: 'Proprietor: GEDA NANA\nBhubaneswar, Odisha, India',
    bankName: 'State Bank of India (SBI)',
    bankAcc: '31245678901',
    bankIfsc: 'SBIN0001234',
    terms: '1. 40% advance payment required to book and block the date.\n2. Guest plate count confirmation must be done 3 days before the event.\n3. Balance must be cleared on the event day itself.\n4. Standard terms and conditions apply.'
  })

  // Invoices History State
  const [savedInvoices, setSavedInvoices] = useState([])
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [activeSidebarTab, setActiveSidebarTab] = useState('menu') // 'menu' | 'profile' | 'history'
  const [invoiceTheme, setInvoiceTheme] = useState(() => {
    return localStorage.getItem('laxmi_catering_invoice_theme') || 'navy'
  })

  useEffect(() => {
    localStorage.setItem('laxmi_catering_invoice_theme', invoiceTheme)
  }, [invoiceTheme])

  // --- AUTO INVOICE NUMBER GENERATION ---
  useEffect(() => {
    if (!invoiceNumber) {
      generateNewInvoiceNumber()
    }
  }, [])

  const generateNewInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    setInvoiceNumber(`LNC-${year}-${rand}`)
  }

  // --- LOCALSTORAGE PERSISTENCE ---
  useEffect(() => {
    // Load Business Profile
    const savedProfile = localStorage.getItem('laxmi_catering_profile')
    if (savedProfile) {
      setBusinessInfo(JSON.parse(savedProfile))
    } else {
      localStorage.setItem('laxmi_catering_profile', JSON.stringify(businessInfo))
    }
    
    // Load Saved Invoices
    const storedInvoices = localStorage.getItem('laxmi_catering_invoices_history')
    if (storedInvoices) {
      setSavedInvoices(JSON.parse(storedInvoices))
    }
  }, [])

  // --- HANDLER LOGICS ---
  const handleAddFood = (food) => {
    if (selectedItems.some(item => item.id === food.id)) return
    setSelectedItems([...selectedItems, { ...food }])
  }

  const handleRemoveFood = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id))
  }

  const handleUpdateItemPrice = (id, newPrice) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.id === id) {
        return { ...item, unitPrice: parseFloat(newPrice) || 0 }
      }
      return item
    }))
  }

  const handleAddCustomFood = (name, price) => {
    const newCustomFood = {
      id: 'custom_food_' + Date.now(),
      name: name,
      category: 'Custom Dish',
      unitPrice: parseFloat(price) || 0,
      isCustom: true
    }
    setSelectedItems([...selectedItems, newCustomFood])
  }

  const handleAddFlatCharge = (name, amount) => {
    const newFlat = {
      id: 'flat_' + Date.now(),
      name: name,
      amount: parseFloat(amount) || 0
    }
    setCustomFlatCharges([...customFlatCharges, newFlat])
  }

  const handleRemoveFlatCharge = (id) => {
    setCustomFlatCharges(customFlatCharges.filter(item => item.id !== id))
  }

  const handleSaveInvoice = () => {
    // Math calculations
    const platePerCost = selectedItems.reduce((acc, curr) => acc + curr.unitPrice, 0)
    const baseSubtotal = platePerCost * guestCount
    const discountAmount = baseSubtotal * (discountRate / 100)
    const afterDiscount = baseSubtotal - discountAmount
    const taxAmount = afterDiscount * (taxRate / 100)
    const flatChargesTotal = customFlatCharges.reduce((acc, curr) => acc + curr.amount, 0)
    const grandTotal = afterDiscount + taxAmount + parseFloat(deliveryCharge || 0) + flatChargesTotal

    const newInvoice = {
      id: invoiceNumber,
      customerInfo,
      selectedItems,
      customFlatCharges,
      guestCount,
      taxRate,
      discountRate,
      deliveryCharge,
      grandTotal,
      invoiceTheme,
      dateSaved: new Date().toLocaleDateString()
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
    alert(`Draft INV #${invoiceNumber} successfully saved to local history!`)
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
    if (!confirm('Are you sure you want to delete this invoice from history?')) return
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
      name: '',
      phone: '',
      email: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventVenue: '',
      eventType: 'Marriage Catering'
    })
    generateNewInvoiceNumber()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="app-container">
      {/* Sidebar Control Panel */}
      <SidebarConfig
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        invoiceNumber={invoiceNumber}
        setInvoiceNumber={setInvoiceNumber}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        customFlatCharges={customFlatCharges}
        setCustomFlatCharges={setCustomFlatCharges}
        taxRate={taxRate}
        setTaxRate={setTaxRate}
        discountRate={discountRate}
        setDiscountRate={setDiscountRate}
        deliveryCharge={deliveryCharge}
        setDeliveryCharge={setDeliveryCharge}
        businessInfo={businessInfo}
        setBusinessInfo={setBusinessInfo}
        savedInvoices={savedInvoices}
        activeSidebarTab={activeSidebarTab}
        setActiveSidebarTab={setActiveSidebarTab}
        handleResetInvoice={handleResetInvoice}
        handleSaveInvoice={handleSaveInvoice}
        handleLoadInvoice={handleLoadInvoice}
        handleDeleteHistoryInvoice={handleDeleteHistoryInvoice}
        handleAddFood={handleAddFood}
        handleRemoveFood={handleRemoveFood}
        handleUpdateItemPrice={handleUpdateItemPrice}
        handleAddCustomFood={handleAddCustomFood}
        handleAddFlatCharge={handleAddFlatCharge}
        handleRemoveFlatCharge={handleRemoveFlatCharge}
      />

      {/* Real-time PDF / Printing preview Panel */}
      <InvoicePreview
        businessInfo={businessInfo}
        customerInfo={customerInfo}
        invoiceNumber={invoiceNumber}
        selectedItems={selectedItems}
        guestCount={guestCount}
        customFlatCharges={customFlatCharges}
        discountRate={discountRate}
        taxRate={taxRate}
        deliveryCharge={deliveryCharge}
        handlePrint={handlePrint}
        invoiceTheme={invoiceTheme}
        setInvoiceTheme={setInvoiceTheme}
      />
    </div>
  )
}

export default App

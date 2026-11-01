/* =========================================================================
   AI MedCare - React Equipment Fleet & Maintenance Management Module
   Lab Exercise 5 & 6: Domain-Based React Application
   Features:
   - React 18 Functional Components & JSX
   - React useState(), useEffect(), useMemo() Hooks
   - Form Handling & Validation
   - Multiple Input Fields
   - Radio Buttons (Operational Status)
   - Select Dropdown (Department Category)
   - Reusable Components (Card, Modal, Stats, Toolbar, Toasts)
   - CRUD Operations (Create, Read, Update, Delete)
   - Dynamic Live Search Filtering & Sorting
   - Local Storage Persistence & JSON-Server (REST API) Compatibility
   ========================================================================= */

const { useState, useEffect, useMemo, useRef } = React;

// Default initial equipment seed data
const DEFAULT_FLEET = [
    {
        id: "EQ-104",
        name: "Intensive Patient Vital Monitor",
        dept: "ICU - Ward 4",
        category: "icu",
        type: "Patient Monitor",
        status: "Operational",
        health: 96,
        temp: 22.4,
        vibration: 0.12,
        hours: 1420,
        errors: 0,
        lastService: "2026-08-15",
        image: "images/patients_monitor.png",
        spec: "Multi-parameter 15-inch ECG/SpO2/NIBP Monitor",
        desc: "Monitors real-time heart rate, blood pressure, and oxygen saturation for critical ICU patients."
    },
    {
        id: "EQ-208",
        name: "Servo-Air ICU Mechanical Ventilator",
        dept: "ICU - Unit 12",
        category: "icu",
        type: "Ventilator",
        status: "Monitor",
        health: 74,
        temp: 28.1,
        vibration: 0.85,
        hours: 3840,
        errors: 2,
        lastService: "2026-06-10",
        image: "images/ventilator.png",
        spec: "Turbine-driven lung ventilator with flow sensors",
        desc: "Provides continuous mechanical ventilation support. Sensor drift detected during recent 24h cycle."
    },
    {
        id: "EQ-302",
        name: "Digital Radiography X-Ray & CT System",
        dept: "Radiology - Bay 2",
        category: "radiology",
        type: "X-Ray / CT System",
        status: "Attention",
        health: 45,
        temp: 34.2,
        vibration: 1.45,
        hours: 5600,
        errors: 5,
        lastService: "2026-04-02",
        image: "images/imaging_system.png",
        spec: "High-frequency 80kW X-ray generator & detector tube",
        desc: "Tube anode thermal load exceeding baseline. Maintenance inspection advised within 7 days."
    },
    {
        id: "EQ-411",
        name: "Volumetric Infusion Smart Pump",
        dept: "Surgical - OR 3",
        category: "surgery",
        type: "Infusion Pump",
        status: "Operational",
        health: 98,
        temp: 21.0,
        vibration: 0.05,
        hours: 890,
        errors: 0,
        lastService: "2026-09-01",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
        spec: "Micro-stepper infusion pump with bubble detector",
        desc: "Delivers precision intravenous medication with anti-free flow safety locks."
    },
    {
        id: "EQ-505",
        name: "12-Lead Digital ECG Machine",
        dept: "Cardiology - Rm 101",
        category: "cardiology",
        type: "ECG Machine",
        status: "Operational",
        health: 91,
        temp: 23.5,
        vibration: 0.18,
        hours: 2150,
        errors: 1,
        lastService: "2026-07-20",
        image: "images/patients_monitor.png",
        spec: "High-resolution 12-channel electrocardiograph",
        desc: "Records cardiac electrical activity. Thermal printer calibration verified."
    },
    {
        id: "EQ-612",
        name: "Anesthesia Delivery Workstation",
        dept: "Surgical - OR 1",
        category: "surgery",
        type: "Anesthesia System",
        status: "Monitor",
        health: 81,
        temp: 26.3,
        vibration: 0.42,
        hours: 4120,
        errors: 1,
        lastService: "2026-05-18",
        image: "images/ventilator.png",
        spec: "Closed-circuit anesthesia machine with vaporizer",
        desc: "Gas mixing and vaporizer pressure monitored in normal operating range."
    }
];

const LOCAL_STORAGE_KEY = "ai_medcare_equipment_fleet";
const JSON_SERVER_URL = "http://localhost:5000/equipment";

// Helper for image fallbacks
const getValidImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80";
    return img;
};

// =========================================================================
// REUSABLE SUB-COMPONENT 1: Toast Notification
// =========================================================================
function ToastNotification({ toast, onClose }) {
    if (!toast) return null;
    const isSuccess = toast.type === "success";
    const isDanger = toast.type === "danger";

    return (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-bounce bg-white/95 border-teal-500/30 text-slate-900">
            <span className="text-xl">
                {isSuccess ? "✅" : isDanger ? "🗑️" : "ℹ️"}
            </span>
            <div>
                <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">{toast.title || "Fleet Notification"}</p>
                <p className="text-xs text-slate-600 font-medium">{toast.message}</p>
            </div>
            <button onClick={onClose} className="ml-3 text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
        </div>
    );
}

// =========================================================================
// REUSABLE SUB-COMPONENT 2: Fleet Statistics Bar
// =========================================================================
function FleetStatsBar({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 text-center">
                <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Total Fleet</p>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.total}</p>
                <span className="text-[10px] text-teal-600 font-semibold">Active Records</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-200/80 text-center">
                <p className="text-[11px] font-bold uppercase text-green-700 tracking-wider">Operational</p>
                <p className="text-2xl font-black text-green-600 font-mono mt-1">{stats.operational}</p>
                <span className="text-[10px] text-green-600 font-semibold">Optimal Health</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-yellow-200/80 text-center">
                <p className="text-[11px] font-bold uppercase text-yellow-700 tracking-wider">Inspection</p>
                <p className="text-2xl font-black text-yellow-600 font-mono mt-1">{stats.monitor}</p>
                <span className="text-[10px] text-yellow-600 font-semibold">Monitor Closely</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-200/80 text-center">
                <p className="text-[11px] font-bold uppercase text-red-700 tracking-wider">Maintenance</p>
                <p className="text-2xl font-black text-red-600 font-mono mt-1">{stats.attention}</p>
                <span className="text-[10px] text-red-600 font-semibold">Action Required</span>
            </div>
            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-4 shadow-md text-white text-center">
                <p className="text-[11px] font-bold uppercase text-teal-200 tracking-wider">Fleet Avg Health</p>
                <p className="text-2xl font-black font-mono mt-1">{stats.avgHealth}%</p>
                <span className="text-[10px] text-teal-200 font-semibold">Telemetry Score</span>
            </div>
        </div>
    );
}

// =========================================================================
// REUSABLE SUB-COMPONENT 3: Equipment Filter & Search Toolbar
// =========================================================================
function EquipmentFilterToolbar({
    categories,
    activeCategory,
    onSelectCategory,
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    onOpenAddModal,
    onResetFleet,
    resultCount,
    totalCount,
    isJsonServer
}) {
    return (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map(cat => {
                        const isActive = activeCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => onSelectCategory(cat.key)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-teal-700 text-white shadow-md shadow-teal-700/20 scale-105"
                                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Primary Action: Add Equipment CTA */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={onOpenAddModal}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                        <span className="text-base font-black">+</span>
                        <span>Add New Equipment</span>
                    </button>

                    <button
                        onClick={onResetFleet}
                        title="Restore initial default sample fleet"
                        className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition"
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>

            {/* Sub-toolbar: Search & Sort Controls */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Dynamic Search Box (Bonus Requirement) */}
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Dynamic Search (e.g. EQ-104, Ventilator, ICU, X-Ray)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 font-medium transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
                    {/* Results Counter */}
                    <span className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        Showing <strong className="text-teal-700">{resultCount}</strong> of {totalCount} records
                    </span>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500">Sort:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        >
                            <option value="health-desc">Health (High to Low)</option>
                            <option value="health-asc">Health (Low to High)</option>
                            <option value="hours-desc">Hours (Highest Wear)</option>
                            <option value="hours-asc">Hours (Lowest Wear)</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="id-asc">Equipment ID</option>
                        </select>
                    </div>

                    {/* Storage Status Tag */}
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span className={`w-2 h-2 rounded-full ${isJsonServer ? "bg-cyan-500" : "bg-emerald-500"}`}></span>
                        <span>{isJsonServer ? "REST API (db.json)" : "LocalStorage"}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

// =========================================================================
// REUSABLE SUB-COMPONENT 4: Individual Equipment Card
// =========================================================================
function EquipmentCard({ item, onRead, onUpdate, onDelete }) {
    let badgeClass = "bg-green-100 text-green-700 border-green-200";
    let statusDot = "bg-green-500";
    let statusLabel = "Operational";

    if (item.status === "Monitor" || item.status === "Inspection Required") {
        badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
        statusDot = "bg-yellow-500 animate-pulse";
        statusLabel = "Inspection Required";
    } else if (item.status === "Attention" || item.status === "Maintenance Due") {
        badgeClass = "bg-red-100 text-red-700 border-red-200";
        statusDot = "bg-red-500 animate-ping";
        statusLabel = "Maintenance Due";
    }

    const healthColor =
        item.health > 80 ? "text-green-600" :
        item.health > 60 ? "text-yellow-600" : "text-red-600";

    const barColor =
        item.health > 80 ? "bg-green-500" :
        item.health > 60 ? "bg-yellow-500" : "bg-red-500";

    return (
        <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 card-hover flex flex-col justify-between transition-all duration-300">
            <div>
                {/* Image Banner & Header Overlays */}
                <div className="h-48 overflow-hidden relative group bg-slate-900">
                    <img
                        src={getValidImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>

                    {/* Operational Status Radio-selected badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass} shadow-md backdrop-blur-md`}>
                            <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                            {statusLabel}
                        </span>
                    </div>

                    {/* ID and Category Tag */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-teal-300 border border-teal-500/30">
                            {item.id}
                        </span>
                        <span className="bg-teal-950/80 text-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">
                            {item.category}
                        </span>
                    </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6">
                    <div className="mb-2">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1" title={item.name}>
                            {item.name}
                        </h3>
                        <p className="text-xs text-teal-700 font-semibold mt-0.5">
                            📍 {item.dept}
                        </p>
                    </div>

                    <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2">
                        {item.desc || item.spec}
                    </p>

                    {/* Telemetry Grid Preview */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                        <div className="bg-slate-50 p-2 rounded-xl">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Hours</p>
                            <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{item.hours}h</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Temp</p>
                            <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{item.temp}°C</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Vibration</p>
                            <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{item.vibration}</p>
                        </div>
                    </div>

                    {/* Health Score Meter */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">Predictive Health Score</span>
                            <span className={`font-bold font-mono ${healthColor}`}>{item.health}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${item.health}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Action Buttons: Read (View), Update (Edit), Delete */}
            <div className="p-6 pt-0 space-y-2">
                <button
                    onClick={() => onRead(item)}
                    className="w-full py-2.5 rounded-xl bg-teal-50 text-teal-800 font-bold hover:bg-teal-700 hover:text-white transition flex items-center justify-center gap-2 text-xs shadow-sm"
                >
                    <span>🔍 View Detailed Telemetry</span>
                    <span>→</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onUpdate(item)}
                        className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-1.5 text-xs border border-slate-200"
                    >
                        <span>✏️ Edit</span>
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition flex items-center justify-center gap-1.5 text-xs border border-rose-200"
                    >
                        <span>🗑️ Delete</span>
                    </button>
                </div>
            </div>
        </article>
    );
}

// =========================================================================
// REUSABLE SUB-COMPONENT 5: Form Modal (CREATE and UPDATE)
// Satisfies: Form Handling, Multiple Input Fields, Radio Buttons, Select Dropdown
// =========================================================================
function EquipmentFormModal({ isOpen, isEditing, initialData, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        dept: "",
        category: "icu",
        type: "Patient Monitor",
        status: "Operational",
        health: 95,
        temp: 24.0,
        vibration: 0.15,
        hours: 1200,
        errors: 0,
        lastService: "2026-08-01",
        image: "images/patients_monitor.png",
        spec: "",
        desc: ""
    });

    const [formErrors, setFormErrors] = useState({});

    // Populate form data when modal opens (or switch between Create and Update)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // New record preset
            const randomNum = Math.floor(100 + Math.random() * 899);
            setFormData({
                id: `EQ-${randomNum}`,
                name: "",
                dept: "ICU - Ward 2",
                category: "icu",
                type: "Ventilator",
                status: "Operational",
                health: 92,
                temp: 23.5,
                vibration: 0.2,
                hours: 850,
                errors: 0,
                lastService: new Date().toISOString().split("T")[0],
                image: "images/ventilator.png",
                spec: "Standard Medical Precision Device",
                desc: "Real-time clinical equipment monitored by AI MedCare telemetry."
            });
        }
        setFormErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    // Multiple input fields event handler
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Form submission validation
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.id || !formData.id.trim()) errors.id = "Equipment ID is required.";
        if (!formData.name || !formData.name.trim()) errors.name = "Equipment name is required.";
        if (!formData.dept || !formData.dept.trim()) errors.dept = "Department is required.";
        if (formData.hours === "" || formData.hours < 0) errors.hours = "Operating hours must be >= 0.";
        if (formData.temp === "") errors.temp = "Temperature is required.";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        onSubmit({
            ...formData,
            health: Number(formData.health) || 90,
            hours: Number(formData.hours) || 0,
            temp: Number(formData.temp) || 24,
            vibration: Number(formData.vibration) || 0.1,
            errors: Number(formData.errors) || 0
        });
    };

    const presetImages = [
        { label: "Patient Monitor", url: "images/patients_monitor.png" },
        { label: "Ventilator", url: "images/ventilator.png" },
        { label: "X-Ray CT", url: "images/imaging_system.png" }
    ];

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto">
                
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
                    <div>
                        <span className="text-xs font-mono bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md font-bold">
                            {isEditing ? "UPDATE EQUIPMENT RECORD" : "CREATE NEW RECORD"}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 mt-2">
                            {isEditing ? `Edit Equipment: ${formData.id}` : "Register New Medical Equipment"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            React Controlled Form with validation, radio selectors, and multiple input types.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-800 text-2xl font-bold w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Controlled Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Row 1: ID and Equipment Name */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Equipment ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                disabled={isEditing}
                                placeholder="e.g. EQ-701"
                                className={`w-full bg-slate-50 border ${
                                    formErrors.id ? "border-red-500 bg-red-50/30" : "border-slate-200"
                                } rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-500`}
                            />
                            {formErrors.id && <p className="text-[11px] text-red-600 mt-1">{formErrors.id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Equipment Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Servo ICU Ventilator"
                                className={`w-full bg-slate-50 border ${
                                    formErrors.name ? "border-red-500 bg-red-50/30" : "border-slate-200"
                                } rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-teal-500`}
                            />
                            {formErrors.name && <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>}
                        </div>
                    </div>

                    {/* Row 2: Department & Category (SELECT DROPDOWN - Mandatory) */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Hospital Department <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="dept"
                                value={formData.dept}
                                onChange={handleChange}
                                placeholder="e.g. ICU - Unit 08"
                                className={`w-full bg-slate-50 border ${
                                    formErrors.dept ? "border-red-500 bg-red-50/30" : "border-slate-200"
                                } rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-teal-500`}
                            />
                            {formErrors.dept && <p className="text-[11px] text-red-600 mt-1">{formErrors.dept}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Select Dropdown (Department Category) <span className="text-teal-600 font-normal">● Mandatory</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-800"
                            >
                                <option value="icu">ICU Units (Intensive Care)</option>
                                <option value="radiology">Radiology & CT Imaging</option>
                                <option value="surgery">Surgical Operating Room</option>
                                <option value="cardiology">Cardiology Diagnostics</option>
                                <option value="laboratory">Pathology & Bio-Lab</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: RADIO BUTTONS (Operational Status - Mandatory Requirement) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Radio Buttons (Operational Status) <span className="text-teal-600 font-normal">● Mandatory</span>
                        </label>
                        <div className="grid sm:grid-cols-3 gap-3">
                            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                                formData.status === "Operational"
                                    ? "bg-green-50 border-green-500 text-green-900 font-bold shadow-sm"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Operational"
                                    checked={formData.status === "Operational"}
                                    onChange={handleChange}
                                    className="accent-green-600 cursor-pointer"
                                />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                <span className="text-xs">Operational</span>
                            </label>

                            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                                formData.status === "Monitor"
                                    ? "bg-yellow-50 border-yellow-500 text-yellow-900 font-bold shadow-sm"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Monitor"
                                    checked={formData.status === "Monitor"}
                                    onChange={handleChange}
                                    className="accent-yellow-500 cursor-pointer"
                                />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                                <span className="text-xs">Monitor Closely</span>
                            </label>

                            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                                formData.status === "Attention"
                                    ? "bg-red-50 border-red-500 text-red-900 font-bold shadow-sm"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Attention"
                                    checked={formData.status === "Attention"}
                                    onChange={handleChange}
                                    className="accent-red-600 cursor-pointer"
                                />
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                                <span className="text-xs">Attention Required</span>
                            </label>
                        </div>
                    </div>

                    {/* Row 4: Multiple Input Fields for Telemetry (Hours, Temp, Vibration, Health) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Operating Hours</label>
                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Housing Temp (°C)</label>
                            <input
                                type="number"
                                name="temp"
                                value={formData.temp}
                                onChange={handleChange}
                                step="0.1"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Vibration (mm/s)</label>
                            <input
                                type="number"
                                name="vibration"
                                value={formData.vibration}
                                onChange={handleChange}
                                step="0.05"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Health Score %</label>
                            <input
                                type="number"
                                name="health"
                                value={formData.health}
                                onChange={handleChange}
                                min="1"
                                max="100"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500 font-bold text-teal-700"
                            />
                        </div>
                    </div>

                    {/* Row 5: Specification & Last Service Date */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Technical Specification
                            </label>
                            <input
                                type="text"
                                name="spec"
                                value={formData.spec}
                                onChange={handleChange}
                                placeholder="e.g. Turbine lung ventilator with flow sensors"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Last Serviced Date
                            </label>
                            <input
                                type="date"
                                name="lastService"
                                value={formData.lastService}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* Row 6: Image Selection */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Image Asset (URL or Local)
                            </label>
                            <div className="flex gap-1.5">
                                {presetImages.map(preset => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                                        className="text-[10px] font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 px-2 py-0.5 rounded transition"
                                    >
                                        + {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="images/ventilator.png or https://..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Row 7: Clinical Description & Diagnostic Notes */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Clinical Notes & Diagnostic Logs
                        </label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Enter detailed maintenance notes or diagnostic symptoms..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-500"
                        ></textarea>
                    </div>

                    {/* Modal Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-md shadow-teal-700/20 flex items-center gap-1.5"
                        >
                            <span>💾</span>
                            <span>{isEditing ? "Save & Update Record" : "Add Equipment Record"}</span>
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

// =========================================================================
// REUSABLE SUB-COMPONENT 6: Detailed Telemetry View Modal (READ Operation)
// =========================================================================
function TelemetryViewModal({ item, onClose, onScheduleService }) {
    const chartCanvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!item || !chartCanvasRef.current || typeof Chart === "undefined") return;

        const ctx = chartCanvasRef.current.getContext("2d");
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"];
        const baseTemp = Number(item.temp) || 24;
        const tempData = labels.map(() => +(baseTemp + (Math.random() * 2 - 1)).toFixed(1));

        chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Thermal Sensor (°C)",
                    data: tempData,
                    borderColor: "#0f766e",
                    backgroundColor: "rgba(15, 118, 110, 0.12)",
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: "rgba(226, 232, 240, 0.6)" },
                        ticks: { font: { family: "JetBrains Mono", size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: "JetBrains Mono", size: 10 } }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [item]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                    <div>
                        <span className="text-xs font-mono bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md font-bold">
                            {item.id} | {item.dept}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 mt-2">{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono">{item.spec || item.type}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl font-bold">✕</button>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed mb-6">{item.desc}</p>

                {/* 4 Telemetry Indices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Health Index</p>
                        <p className="text-xl font-bold text-teal-700 font-mono mt-1">{item.health}%</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Hours</p>
                        <p className="text-xl font-bold text-slate-800 font-mono mt-1">{item.hours} hrs</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Temperature</p>
                        <p className="text-xl font-bold text-slate-800 font-mono mt-1">{item.temp} °C</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Vibration</p>
                        <p className="text-xl font-bold text-slate-800 font-mono mt-1">{item.vibration} mm/s</p>
                    </div>
                </div>

                {/* Real-time Dynamic Chart */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Thermal Telemetry Trend (Past 24h)
                    </h4>
                    <div className="h-44 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                        <canvas ref={chartCanvasRef}></canvas>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                        Last Serviced: <strong className="text-slate-700">{item.lastService}</strong>
                    </span>
                    <button
                        onClick={() => {
                            onClose();
                            if (onScheduleService) onScheduleService(item);
                        }}
                        className="bg-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-800 transition shadow-md shadow-teal-700/20"
                    >
                        Schedule Maintenance Work Order
                    </button>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// REUSABLE SUB-COMPONENT 7: Delete Confirmation Modal (DELETE Operation)
// =========================================================================
function DeleteConfirmModal({ item, onConfirm, onCancel }) {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center animate-scaleIn">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    ⚠️
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Delete Record</h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    Are you sure you want to remove <strong className="text-slate-900">{item.name}</strong> (<span className="font-mono text-teal-700">{item.id}</span>)? This will remove it from the React state and your local database.
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-600/20"
                    >
                        Yes, Delete Equipment
                    </button>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// MAIN ROOT COMPONENT: EquipmentFleetApp
// =========================================================================
function EquipmentFleetApp() {
    // 1. Core State
    const [equipmentList, setEquipmentList] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("health-desc");

    // 2. Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    // 3. Status feedback & Database flags
    const [toast, setToast] = useState(null);
    const [isJsonServerConnected, setIsJsonServerConnected] = useState(false);

    const categories = [
        { key: "all", label: "All Fleet", icon: "🏥" },
        { key: "icu", label: "ICU Units", icon: "🫁" },
        { key: "radiology", label: "Radiology", icon: "🩻" },
        { key: "surgery", label: "Surgical OR", icon: "🩺" },
        { key: "cardiology", label: "Cardiology", icon: "🫀" }
    ];

    const showToast = (message, type = "success", title = "Fleet Notification") => {
        setToast({ message, type, title });
        setTimeout(() => setToast(null), 3500);
    };

    // 4. Initial Load: Try JSON Server REST API, then fallback to LocalStorage
    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            // First check if JSON-Server is running
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1200);
                const res = await fetch(JSON_SERVER_URL, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0 && isMounted) {
                        setEquipmentList(data);
                        setIsJsonServerConnected(true);
                        // Also sync to local storage
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                        window.equipmentData = data;
                        return;
                    }
                }
            } catch (err) {
                // JSON Server not running; fallback to Local Storage
            }

            // Fallback to LocalStorage (Option 1 in Lab Exercise)
            try {
                const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        if (isMounted) {
                            setEquipmentList(parsed);
                            window.equipmentData = parsed;
                        }
                        return;
                    }
                }
            } catch (e) {
                console.warn("Could not read from local storage", e);
            }

            // Fallback to DEFAULT_FLEET
            if (isMounted) {
                setEquipmentList(DEFAULT_FLEET);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_FLEET));
                window.equipmentData = DEFAULT_FLEET;
            }
        }

        loadInitialData();
        return () => { isMounted = false; };
    }, []);

    // 5. Keep LocalStorage and global window.equipmentData synchronized
    useEffect(() => {
        if (equipmentList.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(equipmentList));
            window.equipmentData = equipmentList;
        }
    }, [equipmentList]);

    // 6. Real-time Computed Fleet Statistics
    const stats = useMemo(() => {
        const total = equipmentList.length;
        const operational = equipmentList.filter(e => e.status === "Operational").length;
        const monitor = equipmentList.filter(e => e.status === "Monitor" || e.status === "Inspection Required").length;
        const attention = equipmentList.filter(e => e.status === "Attention" || e.status === "Maintenance Due").length;
        const avgHealth = total > 0
            ? Math.round(equipmentList.reduce((acc, curr) => acc + (Number(curr.health) || 0), 0) / total)
            : 0;
        return { total, operational, monitor, attention, avgHealth };
    }, [equipmentList]);

    // 7. Filtered & Sorted Equipment Records (Bonus Dynamic Search Feature)
    const filteredAndSortedList = useMemo(() => {
        let result = equipmentList.filter(item => {
            const matchesCategory = activeCategory === "all" || item.category === activeCategory;
            const term = searchTerm.toLowerCase().trim();
            const matchesSearch = term === "" ||
                (item.name && item.name.toLowerCase().includes(term)) ||
                (item.id && item.id.toLowerCase().includes(term)) ||
                (item.dept && item.dept.toLowerCase().includes(term)) ||
                (item.category && item.category.toLowerCase().includes(term)) ||
                (item.spec && item.spec.toLowerCase().includes(term));
            return matchesCategory && matchesSearch;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "health-desc") return (b.health || 0) - (a.health || 0);
            if (sortBy === "health-asc") return (a.health || 0) - (b.health || 0);
            if (sortBy === "hours-desc") return (b.hours || 0) - (a.hours || 0);
            if (sortBy === "hours-asc") return (a.hours || 0) - (b.hours || 0);
            if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
            if (sortBy === "id-asc") return (a.id || "").localeCompare(b.id || "");
            return 0;
        });

        return result;
    }, [equipmentList, activeCategory, searchTerm, sortBy]);

    // =====================================================================
    // CRUD OPERATIONS
    // =====================================================================

    // CREATE: Add new equipment record
    const handleCreateEquipment = async (newRecord) => {
        // Prevent duplicate IDs
        if (equipmentList.some(e => e.id.toLowerCase() === newRecord.id.toLowerCase())) {
            showToast(`ID ${newRecord.id} already exists. Please choose a unique ID.`, "danger", "Creation Error");
            return;
        }

        const updated = [newRecord, ...equipmentList];
        setEquipmentList(updated);
        setIsFormOpen(false);
        showToast(`Equipment ${newRecord.id} successfully added to fleet!`, "success", "Record Created");

        // Optional JSON Server POST
        if (isJsonServerConnected) {
            try {
                await fetch(JSON_SERVER_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newRecord)
                });
            } catch (err) {
                console.warn("JSON-server POST failed, stored in LocalStorage", err);
            }
        }
    };

    // UPDATE: Modify existing equipment record
    const handleUpdateEquipment = async (updatedRecord) => {
        const updated = equipmentList.map(item =>
            item.id === updatedRecord.id ? updatedRecord : item
        );
        setEquipmentList(updated);
        setIsFormOpen(false);
        setEditingItem(null);
        showToast(`Record ${updatedRecord.id} (${updatedRecord.name}) updated successfully!`, "success", "Record Updated");

        // Optional JSON Server PUT
        if (isJsonServerConnected) {
            try {
                await fetch(`${JSON_SERVER_URL}/${updatedRecord.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedRecord)
                });
            } catch (err) {
                console.warn("JSON-server PUT failed, stored in LocalStorage", err);
            }
        }
    };

    // DELETE: Remove equipment record
    const handleDeleteEquipment = async () => {
        if (!deletingItem) return;
        const targetId = deletingItem.id;
        const updated = equipmentList.filter(item => item.id !== targetId);
        setEquipmentList(updated);
        setDeletingItem(null);
        showToast(`Equipment ${targetId} was permanently deleted.`, "danger", "Record Removed");

        // Optional JSON Server DELETE
        if (isJsonServerConnected) {
            try {
                await fetch(`${JSON_SERVER_URL}/${targetId}`, {
                    method: "DELETE"
                });
            } catch (err) {
                console.warn("JSON-server DELETE failed, deleted from LocalStorage", err);
            }
        }
    };

    // Reset fleet back to initial seeds
    const handleResetFleet = () => {
        if (window.confirm("Reset all fleet records back to default sample data?")) {
            setEquipmentList(DEFAULT_FLEET);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_FLEET));
            showToast("Fleet restored to initial factory sample records.", "success", "Fleet Reset");
        }
    };

    return (
        <div className="w-full">
            {/* Toast Alerts */}
            <ToastNotification toast={toast} onClose={() => setToast(null)} />

            {/* Dynamic Fleet Statistics Bar */}
            <FleetStatsBar stats={stats} />

            {/* Toolbar: Category Filters, Dynamic Search, Sort, Add CTA */}
            <EquipmentFilterToolbar
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onOpenAddModal={() => {
                    setEditingItem(null);
                    setIsFormOpen(true);
                }}
                onResetFleet={handleResetFleet}
                resultCount={filteredAndSortedList.length}
                totalCount={equipmentList.length}
                isJsonServer={isJsonServerConnected}
            />

            {/* Equipment Grid (READ Operation) */}
            {filteredAndSortedList.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <span className="text-5xl">🔎</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-3">No Matching Equipment Found</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                        No devices match "{searchTerm}". Try clearing your search term or switching the category tab.
                    </p>
                    <button
                        onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                        className="mt-4 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedList.map(item => (
                        <EquipmentCard
                            key={item.id}
                            item={item}
                            onRead={(selected) => setViewingItem(selected)}
                            onUpdate={(selected) => {
                                setEditingItem(selected);
                                setIsFormOpen(true);
                            }}
                            onDelete={(selected) => setDeletingItem(selected)}
                        />
                    ))}
                </div>
            )}

            {/* CREATE / UPDATE MODAL */}
            <EquipmentFormModal
                isOpen={isFormOpen}
                isEditing={!!editingItem}
                initialData={editingItem}
                onSubmit={editingItem ? handleUpdateEquipment : handleCreateEquipment}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                }}
            />

            {/* READ DETAILS MODAL (Telemetry View) */}
            <TelemetryViewModal
                item={viewingItem}
                onClose={() => setViewingItem(null)}
                onScheduleService={(selected) => {
                    if (typeof openWorkOrderModal === "function") {
                        openWorkOrderModal();
                    }
                }}
            />

            {/* DELETE CONFIRMATION MODAL */}
            <DeleteConfirmModal
                item={deletingItem}
                onConfirm={handleDeleteEquipment}
                onCancel={() => setDeletingItem(null)}
            />
        </div>
    );
}

// Mount the React Application into the DOM
function mountReactFleetApp() {
    const rootElement = document.getElementById("react-equipment-root");
    if (rootElement && typeof ReactDOM !== "undefined" && typeof React !== "undefined") {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<EquipmentFleetApp />);
        console.log("[AI MedCare] React 18 Equipment Fleet mounted successfully.");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountReactFleetApp);
} else {
    mountReactFleetApp();
}

// Legacy fallback
window.initReactFleet = mountReactFleetApp;

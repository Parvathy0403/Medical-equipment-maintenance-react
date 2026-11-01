# AI MedCare — VS Code + Microsoft Edge
## Lab Exercise 5 & 6: Domain-Based React Application Update

### Key Files in this Project:
- `index.html` — Main webpage with integrated React 18 Equipment Fleet Management CRUD module.
- `react-equipment-module.jsx` — Clean JSX Functional Component React source code.
- `db.json` — Database file formatted for JSON-Server REST API simulation.
- `LAB_REPORT.md` — Formal 2-page academic report covering all lab requirements.
- `evidence_screenshots/` — Folder containing captured demonstration screenshots for Create, Read, Update, Delete, and Search.
- `react-app/` — Standalone modular React 18 project folder (Vite + JSX source files).
- `style.css` — Custom styling, glassmorphism, animations, and typography.
- `app.js` — Interactive telemetry predictor, Open-Meteo, Camera AR, YouTube, and Web Speech APIs.

---

### How to Run in VS Code:
1. Open this `AI-MedCare-VSCode` folder directly in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The webpage will open in your browser (Microsoft Edge / Chrome) with full React 18 functionality running out of the box!

---

### Mandatory Lab Exercise 5 & 6 Requirements Implemented:
1. **Functional Components**: Component hierarchy (`EquipmentFleetApp`, `FleetStatsBar`, `EquipmentFilterToolbar`, `EquipmentCard`, `EquipmentFormModal`, `TelemetryViewModal`, `DeleteConfirmModal`).
2. **JSX**: Clean declarative templates for all elements.
3. **useState() Hook**: Multiple state variables managing fleet list, modals, forms, active category, search text, and sort order.
4. **useEffect() & useMemo() Hooks**: Storage sync, Chart.js telemetry rendering, dynamic calculations.
5. **Event Handling**: `onClick`, `onChange`, `onSubmit`, `onReset`.
6. **Form Handling**: Controlled React form with live validation and error alerts.
7. **Multiple Input Fields**: ID, Name, Department, Operating Hours, Temperature, Vibration, Health %, Last Service Date, Image, Notes.
8. **Radio Buttons**: Operational Status selection (`Operational`, `Monitor Closely`, `Attention Required`).
9. **Select Dropdown**: Department Category (`icu`, `radiology`, `surgery`, `cardiology`, `laboratory`).
10. **Reusable Components**: Card, Modal, Stats bar, Toolbar, Toast notifications.
11. **CSS Styling**: Tailwind CSS + custom glassmorphism.
12. **CRUD Operations**:
    - **Create**: Click `+ Add New Equipment`, complete form, save.
    - **Read**: View equipment fleet cards & click `View Detailed Telemetry` to inspect metrics and charts.
    - **Update**: Click `Edit` on any card, modify fields, and save changes.
    - **Delete**: Click `Delete` on any card, confirm in modal dialogue.
13. **(Bonus) Dynamic Search**: Real-time filtering as you type with match counter and clear button.
14. **Database Options**:
    - **Option 1: Local Storage (Default)**: Automatically saves and persists across reloads with zero setup.
    - **Option 2: JSON Server (Recommended)**: Run `npx json-server --watch db.json --port 5000` to simulate a REST API.

---

### Verification & Demonstration:
See `evidence_screenshots/` and `LAB_REPORT.md` for complete visual evidence and demonstration steps.

# Vitalia - Marketplace de Servicios Médicos Internacionales

## 1. Concepto & Visión

Vitalia es un marketplace que conecta pacientes con profesionales de la salud a nivel internacional. La experiencia transmite **confianza médica** y **accesibilidad global**: limpia, profesional pero cálida, como entrar a una clínica moderna con toques humanistas. El usuario debe sentir que está en manos seguras desde el primer click.

**Tagline:** "Tu salud, sin fronteras"

---

## 2. Design Language

### Aesthetic Direction
Medical-tech con alma: inspirando confianza institucional pero sin frialdad. Inspiración: mezcla de Calm app (calma), One Medical (profesionalismo), Airbnb (facilidad de uso).

### Color Palette
```
--primary:        #0D9488    /* Teal 600 - confianza, salud */
--primary-dark:   #0F766E    /* Teal 700 */
--primary-light:  #14B8A6    /* Teal 500 */
--secondary:      #6366F1    /* Indigo 500 - acciones secundarias */
--accent:         #F59E0B    /* Amber 500 - alertas, highlights */
--success:        #22C55E    /* Verde - confirmaciones */
--warning:        #EAB308    /* Amarillo - warnings */
--danger:         #EF4444    /* Rojo - errores, críticos */
--background:     #FAFBFC    /* Gris muy claro */
--surface:        #FFFFFF    /* Blanco - cards */
--text-primary:   #1F2937    /* Gris oscuro */
--text-secondary: #6B7280    /* Gris medio */
--text-muted:     #9CA3AF    /* Gris claro */
--border:         #E5E7EB    /* Bordes suaves */
```

### Typography
```
--font-heading: 'Plus Jakarta Sans', sans-serif    /* Headers, títulos */
--font-body: 'Inter', sans-serif                   /* Cuerpo, legible */
--font-mono: 'JetBrains Mono', monospace           /* Números, códigos */
```
Escala: 12/14/16/18/20/24/30/36/48/60px

### Spacing System
```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### Border Radius
```
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 9999px
```

### Shadows
```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
--shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)
```

### Motion Philosophy
- **Micro-interactions:** 150-200ms, ease-out
- **Page transitions:** 300ms, ease-in-out
- **Loading states:** Skeleton con pulse animation
- **Notifications:** Slide-in desde top-right, 3s auto-dismiss
- **Hover states:** Scale 1.02 + shadow elevation

---

## 3. Layout & Structure

### Arquitectura de Páginas

```
/                           → Landing + búsqueda rápida
/auth/login                 → Login (email + Google)
/auth/register              → Registro (paciente/profesional)
/auth/register/professional → Registro profesional (con docs)

/search                     → Búsqueda de servicios
/service/[id]              → Detalle del servicio
/professional/[id]          → Perfil del profesional

/dashboard                  → Dashboard principal del usuario
/dashboard/appointments     → Mis citas
/dashboard/wallet           → Mi billetera
/dashboard/health           → Seguimiento de salud
/dashboard/settings         → Configuración

/professional               → Portal profesional
/professional/services      → Gestionar servicios
/professional/calendar      → Agenda
/professional/patients      → Pacientes

/admin                      → Panel admin
/admin/users                → Gestión de usuarios
/admin/professionals        → Verificación de profesionales
/admin/transactions         → Transacciones y wallet
/admin/reports              → Reportes
```

### Responsive Strategy
- Mobile-first
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Sidebar colapsable en mobile
- Cards en grid: 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)

---

## 4. Features & Interactions

### 4.1 Autenticación

**Pacientes:**
- Registro con email + password + nombre
- Login con email/password o Google OAuth
- Perfil con: nombre, email, país, teléfono, foto, historial médico básico

**Profesionales:**
- Registro en 3 pasos:
  1. Datos personales + especialidad
  2. Documentos (licencia médica, título, certificados)
  3. Servicios ofrecidos
- Estado: `pending_verification` → `verified` → `rejected`
- Badge visible en perfil: "Profesional Verificado ✓"

### 4.2 Marketplace / Búsqueda

**Filtros:**
- Especialidad médica
- País/ciudad
- Rango de precio
- Idiomas hablados
- Disponibilidad (fecha)
- Rating mínimo
- Verificación de credenciales

**Cards de servicio muestran:**
- Foto profesional
- Nombre + especialidad
- Ubicación
- Precio
- Rating + reviews count
- Badges (verificado, idiomas)
- Disponibilidad próxima

### 4.3 Sistema de Wallet (Escrow)

**Flujo:**
1. Usuario deposita funds (simulado con Stripe/MercadoPago)
2. Saldo aparece en wallet
3. Al reservar: funds se "hold" (escrow) - показывается como "pending"
4. Profesional confirma servicio → funds release al profesional
5. Si cancela: 7 días hold, luego refund si no se concretó

**Transacciones:**
- Deposit (+)
- Reservation hold (pending)
- Release to professional (+)
- Refund (+)
- Withdraw (profesional -)

### 4.4 Reservas y Calendario

**Flujo de reserva:**
1. Usuario selecciona servicio → ve calendario del profesional
2. Elige fecha/hora disponible
3. Confirma reserva → se hace hold en wallet
4. Profesional recibe notificación
5. Profesional confirma/rechaza
6. Si confirmado: countdown hasta fecha
7. Post-servicio: ambos pueden dejar review

**Estados de reserva:**
`pending_confirmation` → `confirmed` → `completed` / `cancelled` / `no_show`

### 4.5 Seguimiento de Salud

**Para el paciente:**
- Agregar métricas custom (peso, presión, azúcar, custom)
- Gráficos de evolución
- Notas por fecha
- Alertas configurables (tomar meds, cita de seguimiento)

**Para el profesional:**
- Puede prescribir métricas a seguir
- Ve historial del paciente (con consentimiento)
- Puede dejar notas en el perfil del paciente

**Métricas predefinidas:**
- Presión arterial (sistólica/diastólica)
- Frecuencia cardíaca
- Peso
- Glucosa
- Temperatura
- Oxígeno en sangre

**Métricas custom:**
- Nombre custom
- Unidad (mg/dL, kg, etc.)
- Rango normal (min/max)

### 4.6 Notificaciones

**Canales:**
- In-app (bell icon + dropdown)
- Email (transaccionales)

**Tipos:**
- Nueva reserva (profesional)
- Reserva confirmada/cancelada
- Recordatorio de cita (24h, 1h antes)
- Alerta de métrica fuera de rango
- Nuevo mensaje
- Verificación de documento aprobada/rechazada

### 4.7 Panel Admin

**Gestión de Usuarios:**
- Lista de usuarios con filtros
- Ver detalles, ban/unban
- Historial de reservas

**Verificación de Profesionales:**
- Cola de verificaciones pendientes
- Visualizador de documentos subidos
- Aprobar/rechazar con理由
- Notificar al profesional

**Transacciones:**
- Todas las transacciones del sistema
- Historial de wallet
- Exportar reportes

**Reportes:**
- Ingresos por período
- Top profesionales
- Servicios más reservados
- Usuarios activos

---

## 5. Component Inventory

### Atoms

| Component | States | Notes |
|-----------|--------|-------|
| Button | default, hover, active, disabled, loading | primary, secondary, outline, ghost, danger |
| Input | default, focus, error, disabled | Con label + helper text |
| Select | default, open, disabled | Custom dropdown |
| Checkbox | unchecked, checked, indeterminate, disabled | |
| Radio | unselected, selected, disabled | |
| Badge | variants: primary, secondary, success, warning, danger | |
| Avatar | image, initials, placeholder | Sizes: sm, md, lg |
| Icon | SVG component | Lucide icons |
| Tag | removable, clickable | Para filtros |
| Tooltip | top, bottom, left, right | |

### Molecules

| Component | States | Notes |
|-----------|--------|-------|
| InputGroup | with icon, with addon | |
| SearchInput | default, loading, with results | |
| SelectFilter | single, multi-select | |
| DatePicker | single, range | Calendar popup |
| TimePicker | with slots | Based on professional availability |
| Card | default, hover, selected | |
| Modal | default, danger, success | Sizes: sm, md, lg |
| Toast | success, error, warning, info | Auto-dismiss |
| Dropdown | default, with icons | |
| Tabs | underline, pill | |
| Skeleton | text, avatar, card | Pulse animation |
| StatCard | with icon, with trend | |

### Organisms

| Component | Notes |
|-----------|-------|
| Navbar | Logo, nav links, user menu, notifications |
| Sidebar | Collapsible, with active state |
| Footer | Links, social, copyright |
| ServiceCard | For search results |
| ProfessionalCard | Profile preview |
| AppointmentCard | With status badge, actions |
| WalletCard | Balance + quick actions |
| MetricChart | Line chart for health tracking |
| CalendarView | Month/week/day, with events |
| DocumentUploader | Drag & drop, preview |
| VerificationQueue | Admin table |

### Templates

- **AuthLayout:** Centrado, con branding
- **DashboardLayout:** Sidebar + header + content
- **PublicLayout:** Navbar + footer + content
- **AdminLayout:** Sidebar + header + content (extended)

---

## 6. Technical Approach

### Stack
```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS
Components:   shadcn/ui (customizado)
Icons:        Lucide React
Forms:        React Hook Form + Zod
State:        Zustand (client) + React Query (server)
Auth:         NextAuth.js v5 (Google + Credentials)
Database:     PostgreSQL (via Prisma)
Storage:      UploadThing (documentos)
Payments:     Stripe (demo mode)
Notifications: In-app + email (Resend/Nodemailer)
Charts:       Recharts
Calendar:     react-big-calendar
```

### Data Model

```
User
├── id, email, passwordHash?, name, phone, country, avatar
├── role: PATIENT | PROFESSIONAL | ADMIN
├── createdAt, updatedAt
└── relations: accounts, professional?, wallet, appointments, healthMetrics

Professional (extiende User cuando role = PROFESSIONAL)
├── id, userId, specialty, bio, languages[]
├── credentials: Credential[] (documentos)
├── verificationStatus: PENDING | VERIFIED | REJECTED
├── rating, reviewCount
└── relations: services, appointments

Service
├── id, professionalId, title, description
├── price (cents), currency: USD
├── duration (minutes), location
├── imageUrl
├── isActive
└── relations: professional, appointments

Wallet
├── id, userId, balance (cents)
└── relations: transactions

Transaction
├── id, walletId, type: DEPOSIT | HOLD | RELEASE | REFUND | WITHDRAW
├── amount (cents), status: PENDING | COMPLETED | FAILED
├── reference (stripe payment id, etc.)
├── description
└── createdAt

Appointment
├── id, userId, professionalId, serviceId
├── date, startTime, endTime
├── status: PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
├── totalAmount (cents)
├── holdId (wallet transaction)
├── notes?, rating?, review?
└── createdAt

HealthMetric
├── id, userId, professionalId? (quien lo prescribió)
├── name, unit, minValue?, maxValue?
├── isCustom
└── relations: metricReadings

MetricReading
├── id, healthMetricId, value, recordedAt
└── notes?

Notification
├── id, userId, type, title, message
├── isRead, data (JSON)
└── createdAt

Document (Credential)
├── id, professionalId, type: LICENSE | DEGREE | CERTIFICATE
├── fileUrl, status: PENDING | APPROVED | REJECTED
├── rejectionReason?
└── uploadedAt
```

### API Endpoints

```
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
GET    /api/auth/session

Users
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/:id

Professionals
GET    /api/professionals (search with filters)
GET    /api/professionals/:id
PATCH  /api/professionals/profile
POST   /api/professionals/documents

Services
GET    /api/services
GET    /api/services/:id
POST   /api/professionals/services (create)
PATCH  /api/services/:id
DELETE /api/services/:id

Appointments
GET    /api/appointments (my appointments)
GET    /api/appointments/:id
POST   /api/appointments (create - with wallet hold)
PATCH  /api/appointments/:id/status (confirm/cancel)
POST   /api/appointments/:id/review

Wallet
GET    /api/wallet
POST   /api/wallet/deposit
POST   /api/wallet/withdraw (professional)
GET    /api/wallet/transactions

Health
GET    /api/health/metrics
POST   /api/health/metrics
GET    /api/health/metrics/:id/readings
POST   /api/health/metrics/:id/readings
GET    /api/health/prescriptions (for professionals)

Notifications
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all

Admin
GET    /api/admin/users
PATCH  /api/admin/users/:id
GET    /api/admin/professionals/pending
PATCH  /api/admin/professionals/:id/verify
GET    /api/admin/transactions
GET    /api/admin/reports
```

### Security Considerations
- Todos los passwords hasheados con bcrypt
- JWT tokens para sesiones
- Rate limiting en APIs
- Input validation con Zod en todos los endpoints
- XSS prevention (React's built-in)
- CSRF protection
- Document uploads sanitizados

---

## 7. Implementation Phases

### Phase 1: Foundation
- [x] Setup Next.js + TypeScript + Tailwind
- [ ] Shadcn/ui installation + customization
- [ ] Database schema (Prisma)
- [ ] Auth setup (NextAuth)
- [ ] Layouts (auth, dashboard, public, admin)

### Phase 2: Core Auth + Users
- [ ] Registration flow (patient + professional)
- [ ] Login (email + Google)
- [ ] Profile management
- [ ] Document upload for professionals

### Phase 3: Marketplace
- [ ] Service CRUD
- [ ] Search + filters
- [ ] Service detail page
- [ ] Professional profile

### Phase 4: Wallet + Payments
- [ ] Wallet creation on user register
- [ ] Deposit flow (Stripe demo)
- [ ] Hold/Release logic
- [ ] Transaction history

### Phase 5: Appointments
- [ ] Calendar component
- [ ] Booking flow
- [ ] Status management
- [ ] Notifications

### Phase 6: Health Tracking
- [ ] Metrics CRUD
- [ ] Readings + charts
- [ ] Alerts system
- [ ] Professional prescriptions

### Phase 7: Admin
- [ ] User management
- [ ] Verification queue
- [ ] Reports dashboard

### Phase 8: Polish
- [ ] Animations + transitions
- [ ] Loading states
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Testing

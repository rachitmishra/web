<!-- Neo-Brutalist Streetwear Admin - PRD -->
# Neo-Brutalist Streetwear Admin

## Product Overview

**The Pitch:** A high-octane, uncompromising admin panel for a streetwear merchandise brand. It strips away standard SaaS fluff in favor of a raw, utility-driven interface that matches the brand's aesthetic.

**For:** Merch drop managers, operations leads, and brand owners who need fast, data-dense, and highly structured control over inventory, orders, and storefront configuration.

**Device:** desktop

**Design Direction:** Neo-Brutalist Streetwear. Stark black borders, stark white backgrounds, jarring neon accents, and aggressive monospaced typography. Every element feels like a physical sticker or printed manifest.

**Inspired by:** Gumroad (classic brutalism), MSCHF app, Off-White™ industrial design cues.

---

## Screens

- **Dashboard:** High-contrast analytics overview with monospaced metrics.
- **Inventory Management:** Grid-based product catalog and variant editor.
- **Order Control:** Shipping manifests, Razorpay refund toggles, and Shadowfax tracking.
- **Storefront Config:** Visual toggles for Cinematic Hero, promo banners, and maintenance mode.
- **Access & Logs:** Invitation system (phone auth/codes) and raw email delivery logs.

---

## Key Flows

**Executing a Merch Drop:** Brand manager prepares for a new release.
1. User is on Storefront Config -> sees **Maintenance Mode** toggle.
2. User clicks toggle -> toggle snaps to `#E0FF00`, site locks down.
3. User updates Cinematic Hero image and text.
4. User toggles Maintenance Mode off -> Site is live.

**Processing a Refund:** Ops manager handles a returned tote bag.
1. User is on Order Control -> sees list of recent orders.
2. User clicks Order `#ORD-8821` -> slides out order details panel.
3. User clicks **[Issue Razorpay Refund]** button -> confirmation modal appears with exact amount.
4. User confirms -> Status badge changes to `#FF00FF` "REFUNDED".

---

<details>
<summary>Design System</summary>

## Color Palette

- **Primary:** `#E0FF00` - Toxic yellow. Primary buttons, active states, high-priority highlights.
- **Background:** `#F4F4F0` - Off-white paper texture. Main page background.
- **Surface:** `#FFFFFF` - Pure white. Cards, modals, form fields.
- **Text:** `#000000` - Pitch black. All typography, borders, and shadows.
- **Muted:** `#999999` - Concrete grey. Placeholder text, disabled states.
- **Accent:** `#FF00FF` - Electric magenta. Warnings, destructive actions, Razorpay refunds.

## Typography

Distinctive, aggressive, and highly legible.

- **Headings:** `Syne`, 800 (Extra Bold), 32-48px, uppercase.
- **Data/Metrics:** `Space Mono`, 700, 24-40px.
- **Body:** `Space Mono`, 400, 14px.
- **Buttons:** `Syne`, 700, 16px, uppercase.

**Style notes:** 
- **Borders:** `3px solid #000000` on ALL interactive elements and containers.
- **Border Radius:** `0px`. Absolute sharp corners.
- **Shadows:** Hard block shadows. `box-shadow: 6px 6px 0px #000000`. No blur.
- **Hover effects:** Elements translate `-2px, -2px` and shadow increases to `8px 8px 0px #000000`.

## Design Tokens

```css
:root {
  --color-primary: #E0FF00;
  --color-background: #F4F4F0;
  --color-surface: #FFFFFF;
  --color-text: #000000;
  --color-accent: #FF00FF;
  --color-muted: #999999;
  
  --font-heading: 'Syne', sans-serif;
  --font-mono: 'Space Mono', monospace;
  
  --border-thick: 3px solid #000000;
  --border-thin: 1px solid #000000;
  
  --shadow-hard: 6px 6px 0px #000000;
  --shadow-hover: 8px 8px 0px #000000;
}
```

</details>

---

<details>
<summary>Screen Specifications</summary>

### Dashboard (Analytics)

**Purpose:** Raw pulse of the business. Revenue, traffic, and conversion at a glance.

**Layout:** 2-column grid. Left sidebar for navigation, right 85% for dashboard content. 4x2 top metric grid, massive chart taking bottom half.

**Key Elements:**
- **Sidebar Nav:** Black background, `#FFFFFF` text. Active item gets a `#E0FF00` block background and `#000000` text.
- **Metric Cards:** White surface, thick black borders, hard shadow. Labels in `Syne` 14px, numbers in `Space Mono` 40px.
- **Revenue Chart:** Step-line chart. `#000000` line, `#E0FF00` fill under the line. Sharp angles, no smooth curves.

**States:**
- **Empty:** "NO DATA. DROP MERCH FIRST." in dead-center of chart area.
- **Loading:** Entire screen flickers `#E0FF00` and `#FFFFFF` bars.

**Components:**
- **Metric Card:** `300x120px`, `bg-white`, `border-3 border-black`, `shadow-[6px_6px_0px_#000]`.
- **Time Filter:** Inline radio buttons. Active state inverted (black bg, white text).

**Interactions:**
- **Hover Metric:** Translates `-2px`, shadow grows.

**Responsive:**
- **Desktop:** Sidebar left, 4-col metric grid.

### Inventory Management

**Purpose:** Add, edit, and categorize t-shirts and tote bags.

**Layout:** Top action bar (Search, Add Product). Table layout below, strictly gridded.

**Key Elements:**
- **Product Table:** `Space Mono` text. Thick borders separating rows. No alternating row colors, just stark lines.
- **Media Thumbnails:** Square `48x48px`, grayscale until hovered, thick border.
- **Variant Tags:** `bg-primary`, `border-black`, `text-black`, `px-2 py-1`. E.g., `[S]`, `[M]`, `[L]`.

**States:**
- **Empty:** Graphic of an empty cardboard box, thick stroke. "INVENTORY ZERO."

**Components:**
- **Add Button:** `bg-primary`, `text-black`, `px-6 py-3`, uppercase `Syne`.
- **Status Badge:** "LIVE" (Yellow bg), "DRAFT" (White bg, black stripes).

**Interactions:**
- **Click Add:** Slide-in panel from right. `width: 600px`, thick black left border.

### Order Control

**Purpose:** Track shipments and issue refunds.

**Layout:** Split pane. Left side order list, right side order details/fulfillment actions.

**Key Elements:**
- **Order List:** Scrollable list. Each item shows ID (e.g., `#ORD-992`), Total (`₹2,400`), Status.
- **Shadowfax Tracking Block:** Container with timeline. `border-l-3 border-black`, nodes are `16x16px` black squares.
- **Refund Button:** `bg-accent text-white`. "ISSUE RAZORPAY REFUND".

**States:**
- **Loading Tracking:** Black square blinking.

**Components:**
- **Order Detail Card:** `bg-white`, `border-3`, `shadow-hard`, heavily padded `p-8`.

**Interactions:**
- **Click Refund:** Triggers intense modal. Screen dims, modal has diagonal black stripes in background.

### Storefront Config

**Purpose:** Control the live site's look and feel, manage drops.

**Layout:** Single column, stacked cards for each section (Hero, Promos, Maintenance).

**Key Elements:**
- **Maintenance Toggle:** Massive switch. `120x60px`. Off: White. On: `#E0FF00` with "LOCKDOWN ACTIVE" text next to it.
- **Hero Image Uploader:** Dotted thick border `border-[3px] border-dashed border-black`. 
- **Promo Code Input:** Huge text inputs. `text-3xl`, `p-4`, `uppercase`.

**States:**
- **Error:** If image too large, input border flashes `#FF00FF`.

**Components:**
- **Save Bar:** Sticky bottom bar. Black background, neon yellow "PUBLISH CHANGES" button.

### Access & Logs

**Purpose:** Manage team invites and view system logs.

**Layout:** Tabs for "Team Invites" and "Email Logs". Table-driven.

**Key Elements:**
- **Invite Form:** Phone number input for OTP auth. "GENERATE SINGLE-USE CODE" button.
- **Log Table:** Raw terminal feel. Black background, `#E0FF00` text for code logs. `Space Mono` only.
- **Role Selector:** Dropdown with options: `[OWNER]`, `[OPS]`, `[SUPPORT]`.

**States:**
- **Loading Logs:** Cursor block `_` blinking.

**Components:**
- **Terminal Block:** `bg-black`, `text-primary`, `p-6`, `overflow-y-scroll`, `h-96`.

</details>

---

<details>
<summary>Build Guide</summary>

**Stack:** HTML + Tailwind CSS v3

**Configuration Notes:**
- Extend Tailwind theme with custom colors: `primary: '#E0FF00'`, `accent: '#FF00FF'`.
- Add custom fonts: `font-syne`, `font-mono`.
- Add custom border widths: `border-3`.
- Add custom shadow: `boxShadow: { 'brutal': '6px 6px 0px #000000', 'brutal-hover': '8px 8px 0px #000000' }`.

**Build Order:**
1. **Design System & Layout:** Setup sidebar, base fonts, brutalist shadows, and inputs.
2. **Dashboard:** Implement chart area and metric cards (establishes the core visual weight).
3. **Inventory Management:** Build the heavy data tables and slide-over panels.
4. **Order Control:** Implement the split pane layout and timeline components.
5. **Storefront Config & Access:** Build the massive toggles and terminal log views.

</details>

<!-- Dashboard -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dashboard - Streetwear Admin</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#dcf906",
                        "background-light": "#F4F4F0",
                        "background-dark": "#20230f",
                    },
                    fontFamily: {
                        "display": ["Space Grotesk", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.125rem",
                        "sm": "0.125rem",
                        "md": "0.25rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    boxShadow: {
                        'brutal': '4px 4px 0px #000000',
                        'brutal-hover': '6px 6px 0px #000000',
                        'brutal-sm': '2px 2px 0px #000000',
                    }
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #F4F4F0;
        }
        
        .brutal-border {
            border: 3px solid #000000;
        }
        
        .brutal-card {
            background-color: #FFFFFF;
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            border-radius: 0.125rem;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        
        .brutal-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000000;
        }

        .brutal-btn {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
            text-transform: uppercase;
            font-weight: 700;
        }

        .brutal-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000000;
        }
        
        .brutal-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px #000000;
        }
        
        .step-chart-container {
            position: relative;
            width: 100%;
            height: 300px;
            overflow: hidden;
        }
        
        .step-chart-bg {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60%;
            background-color: #dcf906;
            clip-path: polygon(0 100%, 0 60%, 15% 60%, 15% 80%, 30% 80%, 30% 40%, 45% 40%, 45% 70%, 60% 70%, 60% 30%, 75% 30%, 75% 50%, 90% 50%, 90% 20%, 100% 20%, 100% 100%);
        }
        
        .step-chart-line {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .chart-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: 50px 50px;
            background-image: 
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
            z-index: 0;
        }

        /* SVG Step Line */
        svg.step-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
        }
        
        svg.step-line polyline {
            fill: none;
            stroke: #000000;
            stroke-width: 3;
            stroke-linejoin: miter;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #F4F4F0;
            border-left: 3px solid #000000;
        }
        ::-webkit-scrollbar-thumb {
            background: #000000;
            border: 2px solid #F4F4F0;
        }
        
        .nav-item.active {
            background-color: #dcf906;
            color: #000000;
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transform: translate(-2px, -2px);
        }
        
        .nav-item.active .material-symbols-outlined {
            color: #000000;
            font-variation-settings: 'FILL' 1;
        }
    </style>
</head>
<body class="bg-background-light font-display text-slate-900 antialiased overflow-x-hidden min-h-screen flex">
<!-- Sidebar Navigation -->
<aside class="w-72 bg-[#000000] min-h-screen flex flex-col brutal-border border-l-0 border-y-0 fixed z-50">
<div class="p-6 brutal-border border-x-0 border-t-0 border-b-[#333333] mb-6 flex items-center gap-4">
<div class="w-12 h-12 bg-primary brutal-border shadow-brutal-sm flex items-center justify-center">
<span class="material-symbols-outlined text-black" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
</div>
<div>
<h1 class="text-white text-xl font-bold uppercase tracking-tight leading-none">STREETWEAR</h1>
<p class="text-primary text-xs font-bold uppercase mt-1">ADMIN v1.0.0-neo</p>
</div>
</div>
<nav class="flex-1 px-4 flex flex-col gap-2">
<a class="nav-item active flex items-center gap-3 px-4 py-3 rounded-sm transition-all" href="#">
<span class="material-symbols-outlined text-[#ffffff]" data-icon="layout">mobile_layout</span>
<span class="text-sm font-bold uppercase tracking-wide">Dashboard</span>
</a>
<a class="nav-item flex items-center gap-3 px-4 py-3 text-white hover:bg-[#222222] rounded-sm transition-all border-3 border-transparent" href="#">
<span class="material-symbols-outlined" data-icon="archive_box">archive</span>
<span class="text-sm font-bold uppercase tracking-wide">Inventory</span>
</a>
<a class="nav-item flex items-center gap-3 px-4 py-3 text-white hover:bg-[#222222] rounded-sm transition-all border-3 border-transparent" href="#">
<span class="material-symbols-outlined" data-icon="package">package</span>
<span class="text-sm font-bold uppercase tracking-wide">Order Control</span>
</a>
<a class="nav-item flex items-center gap-3 px-4 py-3 text-white hover:bg-[#222222] rounded-sm transition-all border-3 border-transparent" href="#">
<span class="material-symbols-outlined" data-icon="storefront">storefront</span>
<span class="text-sm font-bold uppercase tracking-wide">Storefront Config</span>
</a>
<a class="nav-item flex items-center gap-3 px-4 py-3 text-white hover:bg-[#222222] rounded-sm transition-all border-3 border-transparent" href="#">
<span class="material-symbols-outlined" data-icon="key">key</span>
<span class="text-sm font-bold uppercase tracking-wide">Access &amp; Logs</span>
</a>
</nav>
<div class="p-4 mt-auto">
<div class="bg-[#111111] border-2 border-[#333333] p-4 rounded-sm">
<div class="flex items-center gap-3 mb-2">
<div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
<span class="text-white text-xs font-bold uppercase">System Status</span>
</div>
<p class="text-gray-400 text-xs font-mono">ALL SYSTEMS OPERATIONAL. NO ACTIVE LOCKDOWNS.</p>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 ml-72 p-8 lg:p-12 min-h-screen">
<!-- Header Section -->
<header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
<div>
<h2 class="text-5xl font-black uppercase tracking-tighter text-black mb-2">DASHBOARD</h2>
<p class="text-black/60 font-bold uppercase tracking-widest text-sm">Raw pulse of the business.</p>
</div>
<!-- Time Filter -->
<div class="flex items-center brutal-border bg-white rounded-sm overflow-hidden shadow-brutal-sm">
<button class="px-6 py-2 text-sm font-bold uppercase bg-black text-white hover:bg-black/90 transition-colors">24H</button>
<div class="w-[3px] bg-black h-full self-stretch"></div>
<button class="px-6 py-2 text-sm font-bold uppercase text-black hover:bg-primary transition-colors">7D</button>
<div class="w-[3px] bg-black h-full self-stretch"></div>
<button class="px-6 py-2 text-sm font-bold uppercase text-black hover:bg-primary transition-colors">30D</button>
<div class="w-[3px] bg-black h-full self-stretch"></div>
<button class="px-6 py-2 text-sm font-bold uppercase text-black hover:bg-primary transition-colors">ALL</button>
</div>
</header>
<!-- Metrics Grid (4x2) -->
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
<!-- Card 1 -->
<div class="brutal-card p-6 flex flex-col justify-between h-36 relative overflow-hidden group">
<div class="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
<h3 class="text-sm font-bold uppercase tracking-widest text-black/60 relative z-10">TOTAL REVENUE</h3>
<div class="flex items-end gap-2 relative z-10">
<span class="text-4xl font-black tracking-tighter">₹45,200</span>
<span class="text-sm font-bold text-green-600 mb-1 flex items-center">
<span class="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span> 12%
                    </span>
</div>
</div>
<!-- Card 2 -->
<div class="brutal-card p-6 flex flex-col justify-between h-36 relative overflow-hidden group">
<div class="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
<h3 class="text-sm font-bold uppercase tracking-widest text-black/60 relative z-10">ORDERS</h3>
<div class="flex items-end gap-2 relative z-10">
<span class="text-4xl font-black tracking-tighter">142</span>
<span class="text-sm font-bold text-green-600 mb-1 flex items-center">
<span class="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span> 4%
                    </span>
</div>
</div>
<!-- Card 3 -->
<div class="brutal-card p-6 flex flex-col justify-between h-36 relative overflow-hidden group">
<div class="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
<h3 class="text-sm font-bold uppercase tracking-widest text-black/60 relative z-10">CONVERSION</h3>
<div class="flex items-end gap-2 relative z-10">
<span class="text-4xl font-black tracking-tighter">3.2%</span>
<span class="text-sm font-bold text-red-600 mb-1 flex items-center">
<span class="material-symbols-outlined text-sm" data-icon="trending_down">trending_down</span> 1.1%
                    </span>
</div>
</div>
<!-- Card 4 -->
<div class="brutal-card p-6 flex flex-col justify-between h-36 relative overflow-hidden group">
<div class="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
<h3 class="text-sm font-bold uppercase tracking-widest text-black/60 relative z-10">TRAFFIC</h3>
<div class="flex items-end gap-2 relative z-10">
<span class="text-4xl font-black tracking-tighter">4,892</span>
<span class="text-sm font-bold text-green-600 mb-1 flex items-center">
<span class="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span> 22%
                    </span>
</div>
</div>
<!-- Card 5 (AOV) -->
<div class="brutal-card p-6 flex flex-col justify-between h-36">
<h3 class="text-sm font-bold uppercase tracking-widest text-black/60">AVG ORDER VALUE</h3>
<div class="flex items-end gap-2">
<span class="text-3xl font-black tracking-tighter">₹318</span>
</div>
</div>
<!-- Card 6 (Refunds) -->
<div class="brutal-card p-6 flex flex-col justify-between h-36 bg-[#fff0f0] border-[#ff0000]">
<h3 class="text-sm font-bold uppercase tracking-widest text-red-600">PENDING REFUNDS</h3>
<div class="flex items-end gap-2">
<span class="text-3xl font-black tracking-tighter text-red-600">4</span>
<a class="ml-auto text-xs font-bold uppercase underline hover:text-red-800" href="#">Review</a>
</div>
</div>
<!-- Card 7 (Top Product) -->
<div class="brutal-card p-6 flex flex-col justify-between h-36 lg:col-span-2 bg-primary">
<div class="flex justify-between items-start">
<h3 class="text-sm font-bold uppercase tracking-widest text-black/80">TOP PERFORMING DROP</h3>
<span class="px-2 py-1 bg-black text-primary text-xs font-bold uppercase rounded-sm">LIVE</span>
</div>
<div class="flex items-center gap-4">
<div class="w-16 h-16 brutal-border bg-white flex items-center justify-center overflow-hidden">
<img alt="White graphic t-shirt design" class="w-full h-full object-cover grayscale mix-blend-multiply" data-alt="White graphic t-shirt design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0zLYOW3p-C_4QVU7uCRswaUPCyEBLKLfliE-7EuU3AUt9mswapS35efvDF958Uu41WCaFdP_b-dRmdj2wPYiYYARgoIcoikkKxjtIQjsAg3wtrxRhM5LDcv7IFl2GOI3Tw23nWUkDe7lWBWNYrSn64w6l5vsCjj1vSzgzRHKGmIWqnbkvZrdJswA7CFaPadpQEbzsjkRJYsRLytUt8ovTk3oIQ4Rz2uonkE-PxSBrEhYo6n58rHuwNhExk6Zg37dm48E7DPDYLfQ"/>
</div>
<div>
<p class="text-xl font-black uppercase tracking-tight">"NEO-TOKYO" HEAVYWEIGHT TEE</p>
<p class="text-sm font-bold text-black/70">82 UNITS MOVED TODAY</p>
</div>
</div>
</div>
</section>
<!-- Revenue Chart Section -->
<section class="brutal-card p-0 flex flex-col h-[450px]">
<div class="p-6 border-b-3 border-black flex justify-between items-center bg-white z-20">
<div class="flex items-center gap-4">
<h3 class="text-xl font-black uppercase tracking-tight">REVENUE VELOCITY</h3>
<span class="px-2 py-1 bg-black text-white text-xs font-bold uppercase rounded-sm">LAST 24 HOURS</span>
</div>
<button class="brutal-btn bg-white px-4 py-2 text-xs flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="download">download</span>
                    EXPORT CSV
                </button>
</div>
<div class="relative flex-1 bg-white">
<div class="chart-grid"></div>
<!-- Axis Labels -->
<div class="absolute left-4 top-4 bottom-10 flex flex-col justify-between text-xs font-bold text-black/40 z-20">
<span>₹10K</span>
<span>₹7.5K</span>
<span>₹5K</span>
<span>₹2.5K</span>
</div>
<div class="absolute left-16 right-4 bottom-4 flex justify-between text-xs font-bold text-black/40 z-20">
<span>00:00</span>
<span>06:00</span>
<span>12:00</span>
<span>18:00</span>
<span>NOW</span>
</div>
<!-- Step Chart -->
<div class="absolute inset-0 left-12 bottom-10 top-4 right-4 z-10">
<div class="step-chart-container h-full w-full">
<div class="step-chart-bg h-full w-full"></div>
<svg class="step-line" preserveaspectratio="none" viewbox="0 0 100 100">
<polyline points="0,100 0,60 15,60 15,80 30,80 30,40 45,40 45,70 60,70 60,30 75,30 75,50 90,50 90,20 100,20 100,20"></polyline>
</svg>
<!-- Hover Tooltip Simulator (Static for design) -->
<div class="absolute left-[60%] top-[30%] -translate-x-1/2 -translate-y-[120%] z-30">
<div class="bg-black text-white p-3 brutal-border shadow-brutal text-center">
<p class="text-xs font-bold text-primary mb-1 uppercase">14:00 - 15:00</p>
<p class="text-xl font-black tracking-tighter">₹4,200</p>
</div>
<div class="w-3px h-[calc(100%+40px)] bg-black absolute top-full left-1/2 -translate-x-1/2"></div>
<div class="w-4 h-4 bg-primary border-3 border-black absolute top-[calc(100%+40px)] left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
</div>
</div>
</div>
</div>
</section>
</main>
</body></html>

<!-- Inventory Management -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Streetwear Admin - Inventory</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#dcf906",
                        "background-light": "#F4F4F0",
                        "background-dark": "#20230f",
                    },
                    fontFamily: {
                        "display": ["Space Grotesk", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.125rem",
                        "sm": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    boxShadow: {
                        'brutal': '4px 4px 0px #000000',
                        'brutal-hover': '6px 6px 0px #000000',
                        'brutal-lg': '8px 8px 0px #000000',
                    }
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Space Grotesk', sans-serif;
        }
        
        /* Brutalist Styles */
        .brutal-border {
            border: 3px solid #000000;
        }
        
        .brutal-border-b {
            border-bottom: 3px solid #000000;
        }
        
        .brutal-border-r {
            border-right: 3px solid #000000;
        }
        
        .brutal-shadow {
            box-shadow: 4px 4px 0px #000000;
            transition: all 0.1s ease;
        }
        
        .brutal-shadow:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000000;
        }

        .brutal-shadow:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px #000000;
        }
        
        .thumbnail {
            filter: grayscale(100%);
            transition: filter 0.2s ease;
        }
        
        tr:hover .thumbnail {
            filter: grayscale(0%);
        }

        /* Hide scrollbar for cleaner look */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #F4F4F0;
            border-left: 2px solid #000;
        }
        ::-webkit-scrollbar-thumb {
            background: #000;
            border: 2px solid #000;
        }
    </style>
</head>
<body class="bg-background-light text-black overflow-x-hidden font-display min-h-screen selection:bg-primary selection:text-black">
<div class="flex h-screen w-full overflow-hidden relative">
<!-- Sidebar (Included as per Shared Components, Inventory is a Destination screen) -->
<div class="w-64 h-full bg-white brutal-border-r flex flex-col shrink-0 z-20">
<div class="p-6 brutal-border-b bg-black text-white">
<h1 class="text-xl font-bold uppercase tracking-wider">STREETWEAR</h1>
<p class="text-primary text-xs font-medium mt-1">OPS ADMIN</p>
</div>
<div class="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
<a class="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-gray-100 transition-colors" href="#">
<span class="material-symbols-outlined text-black">gas_meter</span>
<span class="text-sm font-bold uppercase">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 rounded-sm bg-primary brutal-shadow brutal-border mt-2" href="#">
<span class="material-symbols-outlined text-black" style="font-variation-settings: 'FILL' 1;">package</span>
<span class="text-sm font-bold uppercase">Inventory</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-gray-100 transition-colors mt-2" href="#">
<span class="material-symbols-outlined text-black">shopping_cart</span>
<span class="text-sm font-bold uppercase">Orders</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-gray-100 transition-colors mt-2" href="#">
<span class="material-symbols-outlined text-black">tools_wrench</span>
<span class="text-sm font-bold uppercase">Config</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-gray-100 transition-colors mt-2" href="#">
<span class="material-symbols-outlined text-black">key</span>
<span class="text-sm font-bold uppercase">Access</span>
</a>
</div>
<div class="p-4 brutal-border-t">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-sm brutal-border bg-gray-200 bg-cover bg-center" data-alt="User avatar" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzPkDBwJGkrv_P95if5wIns-Hna0pB1tnCAnol8DJdiM9gGcbDsnW8TBSYSAytl5pMK7xoThI07oPEyw-zb77cFkJGqznVw9rt3oZ7M2Uh0JhkDI0tcQ8S3aSd13wIejAEjuA9fQtlv-mvyBk-qbVqMKAIe5WTa-lmpdezb0psmjNXht5uOnNSJ14lFL_RtrbcfO1aqzBwm4v4c5pmgjY7om7fMyKlxSfiKK1l6y4wEgzjGGLoFwoCyoyFdqYtVSmhCziBJ_YF0Kw');"></div>
<div>
<p class="text-sm font-bold">JD_OPS</p>
<p class="text-xs text-gray-500 font-medium">Log out</p>
</div>
</div>
</div>
</div>
<!-- Main Content -->
<div class="flex-1 flex flex-col h-full overflow-hidden bg-background-light relative z-10">
<!-- Header / Action Bar -->
<header class="p-8 brutal-border-b bg-background-light flex justify-between items-end shrink-0">
<div>
<h2 class="text-4xl font-bold uppercase tracking-tight">Inventory</h2>
<p class="text-sm font-medium text-gray-600 mt-2 uppercase">42 Items / 18 Live / 24 Draft</p>
</div>
<div class="flex items-center gap-4">
<div class="relative brutal-shadow group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black z-10">search</span>
<input class="pl-10 pr-4 py-3 w-72 brutal-border rounded-sm bg-white text-sm font-bold uppercase placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-primary/10 transition-colors" placeholder="SEARCH INVENTORY..." type="text"/>
</div>
<button class="bg-primary px-6 py-3 brutal-border rounded-sm brutal-shadow flex items-center gap-2" onclick="document.getElementById('slide-over').classList.toggle('translate-x-full')">
<span class="material-symbols-outlined">add</span>
<span class="text-sm font-bold uppercase tracking-wider">Add Product</span>
</button>
</div>
</header>
<!-- Main Content Area (Table) -->
<main class="flex-1 overflow-auto p-8">
<div class="bg-white brutal-border rounded-sm brutal-shadow flex flex-col min-w-[900px]">
<!-- Table Header -->
<div class="grid grid-cols-12 gap-4 p-4 brutal-border-b bg-gray-100 uppercase text-xs font-bold tracking-wider">
<div class="col-span-4">Item</div>
<div class="col-span-2">SKU</div>
<div class="col-span-3">Variants</div>
<div class="col-span-1 text-right">Stock</div>
<div class="col-span-2 text-center">Status</div>
</div>
<!-- Table Rows -->
<!-- Row 1 -->
<div class="grid grid-cols-12 gap-4 p-4 brutal-border-b items-center hover:bg-gray-50 transition-colors group cursor-pointer">
<div class="col-span-4 flex items-center gap-4">
<div class="w-12 h-12 brutal-border rounded-sm bg-gray-200 shrink-0 thumbnail bg-cover bg-center" data-alt="White t-shirt product" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlkW91rAHzHaAHVGnvlA6fXbBp4gTISlnrh7JuyaH-SpNZrST--Tuqi2nSJQoT6q3251rlnGPXXEs4bXehIaPTZ-4fYheljjeXd9w7Zm35amAz5iSUDBvfRh8_cHMHnzPPSqn_veA49WYgyr6uQXUutPNDgfRF39bxS25Z1mtX24KTY4B4k0T5dr4-9c24OxxNM6LEj9C0q1DxwGGT9Cy6cgw-YQaVpLxOduBl0YJZtMofeWzA6kcg9HeocTOebIb1g2jIhPs_XYU');"></div>
<div>
<p class="font-bold text-sm uppercase">Heavyweight Boxy Tee</p>
<p class="text-xs text-gray-500">Apparel / Tops</p>
</div>
</div>
<div class="col-span-2 font-mono text-sm">BX-TEE-01</div>
<div class="col-span-3 flex flex-wrap gap-1">
<span class="px-2 py-1 bg-primary brutal-border rounded-sm text-xs font-bold">[S]</span>
<span class="px-2 py-1 bg-primary brutal-border rounded-sm text-xs font-bold">[M]</span>
<span class="px-2 py-1 bg-primary brutal-border rounded-sm text-xs font-bold">[L]</span>
<span class="px-2 py-1 bg-white text-gray-400 brutal-border border-dashed rounded-sm text-xs font-bold">[XL]</span>
</div>
<div class="col-span-1 text-right font-mono text-sm font-bold">142</div>
<div class="col-span-2 flex justify-center">
<span class="px-3 py-1 bg-primary brutal-border rounded-sm text-xs font-bold uppercase brutal-shadow">Live</span>
</div>
</div>
<!-- Row 2 -->
<div class="grid grid-cols-12 gap-4 p-4 brutal-border-b items-center hover:bg-gray-50 transition-colors group cursor-pointer">
<div class="col-span-4 flex items-center gap-4">
<div class="w-12 h-12 brutal-border rounded-sm bg-gray-200 shrink-0 thumbnail bg-cover bg-center" data-alt="Canvas tote bag" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjBpY6X0iUXPkxLftduO6XCZy7l524FJfRlb4Y8EyL18sUpKt72INFusAdqdaJeAL_dDZU_KawU4WS4QPCQPlTY3FaFLEBMfTQkp6CV6icbyCbRUNzXJtgsBycq-mmZieY-JSW0BushuQtkyuBkxP-c0XH2qrGPu2haAIKM7p-WPDA6Y7qXlqsHFTV0IT3WKugb2vNAVeLoQEs1SvN2iw6UO8qjiFZD8xnH0it_uJv8hTuItdCN006N91K48QBmNXMKNbGD6XPkAA');"></div>
<div>
<p class="font-bold text-sm uppercase">Industrial Tote</p>
<p class="text-xs text-gray-500">Accessories / Bags</p>
</div>
</div>
<div class="col-span-2 font-mono text-sm">IND-TOT-99</div>
<div class="col-span-3 flex flex-wrap gap-1">
<span class="px-2 py-1 bg-primary brutal-border rounded-sm text-xs font-bold">[OS]</span>
</div>
<div class="col-span-1 text-right font-mono text-sm font-bold text-red-600">08</div>
<div class="col-span-2 flex justify-center">
<span class="px-3 py-1 bg-primary brutal-border rounded-sm text-xs font-bold uppercase brutal-shadow">Live</span>
</div>
</div>
<!-- Row 3 -->
<div class="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group cursor-pointer opacity-70">
<div class="col-span-4 flex items-center gap-4">
<div class="w-12 h-12 brutal-border rounded-sm bg-gray-200 shrink-0 thumbnail bg-cover bg-center" data-alt="Black hoodie product" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBg4jgJ-p_3gpMXXw4A39LJvfdy5ztj14OrzKVg8BhOH09cAG6EIk2G0f-WyNOWD8CqFJ_580LzlOJ7q4tBy45PedXPr9xYLTazqYt2r9zuLm8OmnJiRTHNDv-fsgMASOyWjiv3tm3lDDuiZN_5He14eLVj6A02xAUZi_7PZZoobcJOVn3yOOMUVJe69uHShUn_itk-A9AoP8qZ0g_WbKzgjlGSJykmujkS9FynYwXE4ONz4b2wF44_x1-kO6fVWOU5JRYTiCKjXiQ');"></div>
<div>
<p class="font-bold text-sm uppercase">Utility Hoodie V2</p>
<p class="text-xs text-gray-500">Apparel / Outerwear</p>
</div>
</div>
<div class="col-span-2 font-mono text-sm">UT-HD-V2</div>
<div class="col-span-3 flex flex-wrap gap-1">
<span class="px-2 py-1 bg-white brutal-border border-dashed rounded-sm text-xs font-bold">[M]</span>
<span class="px-2 py-1 bg-white brutal-border border-dashed rounded-sm text-xs font-bold">[L]</span>
</div>
<div class="col-span-1 text-right font-mono text-sm font-bold">00</div>
<div class="col-span-2 flex justify-center">
<span class="px-3 py-1 bg-white brutal-border border-dashed rounded-sm text-xs font-bold uppercase">Draft</span>
</div>
</div>
</div>
</main>
</div>
<!-- Slide-over Panel (Add Product) -->
<div class="fixed inset-y-0 right-0 w-[600px] bg-white brutal-border-l transform translate-x-full transition-transform duration-300 ease-in-out z-50 flex flex-col brutal-shadow" id="slide-over">
<div class="p-6 brutal-border-b flex justify-between items-center bg-black text-white">
<h3 class="text-2xl font-bold uppercase">New Product</h3>
<button class="hover:text-primary transition-colors" onclick="document.getElementById('slide-over').classList.add('translate-x-full')">
<span class="material-symbols-outlined text-3xl">close</span>
</button>
</div>
<div class="p-8 flex-1 overflow-y-auto bg-background-light">
<form class="flex flex-col gap-6">
<div class="flex flex-col gap-2">
<label class="text-sm font-bold uppercase">Product Name</label>
<input class="w-full p-3 brutal-border rounded-sm font-bold focus:outline-none focus:bg-primary/10" placeholder="E.G. ACID WASH TEE" type="text"/>
</div>
<div class="grid grid-cols-2 gap-6">
<div class="flex flex-col gap-2">
<label class="text-sm font-bold uppercase">SKU Base</label>
<input class="w-full p-3 brutal-border rounded-sm font-mono uppercase focus:outline-none focus:bg-primary/10" placeholder="ACD-TEE" type="text"/>
</div>
<div class="flex flex-col gap-2">
<label class="text-sm font-bold uppercase">Price (INR)</label>
<input class="w-full p-3 brutal-border rounded-sm font-mono focus:outline-none focus:bg-primary/10" placeholder="2499" type="number"/>
</div>
</div>
<div class="flex flex-col gap-2">
<label class="text-sm font-bold uppercase">Media</label>
<div class="w-full h-40 brutal-border border-dashed rounded-sm bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
<span class="material-symbols-outlined text-4xl mb-2">image</span>
<p class="text-sm font-bold uppercase">Drag images or click to upload</p>
</div>
</div>
<div class="flex flex-col gap-2">
<label class="text-sm font-bold uppercase">Variants</label>
<div class="flex gap-3">
<label class="flex items-center gap-2 cursor-pointer">
<input checked="" class="w-5 h-5 brutal-border text-primary focus:ring-0 rounded-sm" type="checkbox"/>
<span class="font-bold">[S]</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input checked="" class="w-5 h-5 brutal-border text-primary focus:ring-0 rounded-sm" type="checkbox"/>
<span class="font-bold">[M]</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input checked="" class="w-5 h-5 brutal-border text-primary focus:ring-0 rounded-sm" type="checkbox"/>
<span class="font-bold">[L]</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input class="w-5 h-5 brutal-border text-primary focus:ring-0 rounded-sm" type="checkbox"/>
<span class="font-bold">[XL]</span>
</label>
</div>
</div>
</form>
</div>
<div class="p-6 brutal-border-t bg-white flex justify-end gap-4">
<button class="px-6 py-3 brutal-border rounded-sm font-bold uppercase hover:bg-gray-100 transition-colors" onclick="document.getElementById('slide-over').classList.add('translate-x-full')">Cancel</button>
<button class="px-6 py-3 bg-primary brutal-border rounded-sm brutal-shadow font-bold uppercase">Save Product</button>
</div>
</div>
</div>
</body></html>

<!-- Order Control -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Neo-Brutalist Admin - Order Control</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#dcf906",
                        "background-light": "#f8f8f5",
                        "background-dark": "#20230f",
                        "accent": "#FF00FF",
                    },
                    fontFamily: {
                        "display": ["Space Grotesk", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
                    boxShadow: {
                        'brutal': '6px 6px 0px #000000',
                        'brutal-hover': '8px 8px 0px #000000'
                    },
                    borderWidth: {
                        '3': '3px'
                    }
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Space Grotesk', sans-serif;
        }
        .brutal-border {
            border: 3px solid #000000;
        }
        .brutal-shadow {
            box-shadow: 6px 6px 0px #000000;
            transition: all 0.2s ease;
        }
        .brutal-shadow:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0px #000000;
        }
        
        .brutal-shadow-active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000000;
        }

        .stripe-bg {
            background-image: repeating-linear-gradient(
                45deg,
                rgba(0,0,0,0.1),
                rgba(0,0,0,0.1) 10px,
                transparent 10px,
                transparent 20px
            );
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 h-screen overflow-hidden flex font-display">
<!-- Sidebar Navigation -->
<div class="relative flex h-full w-64 flex-col bg-[#fbfcf8] border-r-3 border-black shrink-0 z-10">
<div class="flex h-full flex-col justify-between p-4">
<div class="flex flex-col gap-6">
<div class="flex gap-3 items-center border-b-3 border-black pb-4">
<div class="bg-primary brutal-border size-12 flex items-center justify-center font-bold text-xl uppercase">NB</div>
<div class="flex flex-col">
<h1 class="text-black text-lg font-bold leading-tight uppercase tracking-wider">NEO-BRUTAL</h1>
<p class="text-slate-600 text-xs font-bold leading-tight uppercase">ADMIN SYSTEM</p>
</div>
</div>
<nav class="flex flex-col gap-2">
<a class="flex items-center gap-3 px-3 py-3 brutal-border bg-white brutal-shadow group" href="#">
<span class="material-symbols-outlined text-black group-hover:text-primary transition-colors">bar_chart</span>
<span class="text-black font-bold uppercase tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 brutal-border bg-white brutal-shadow group" href="#">
<span class="material-symbols-outlined text-black group-hover:text-primary transition-colors">square</span>
<span class="text-black font-bold uppercase tracking-wide">Inventory</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 brutal-border bg-primary brutal-shadow" href="#">
<span class="material-symbols-outlined text-black" style="font-variation-settings: 'FILL' 1;">list</span>
<span class="text-black font-bold uppercase tracking-wide">Orders</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 brutal-border bg-white brutal-shadow group" href="#">
<span class="material-symbols-outlined text-black group-hover:text-primary transition-colors">storefront</span>
<span class="text-black font-bold uppercase tracking-wide">Storefront</span>
</a>
<a class="flex items-center gap-3 px-3 py-3 brutal-border bg-white brutal-shadow group" href="#">
<span class="material-symbols-outlined text-black group-hover:text-primary transition-colors">search_gear</span>
<span class="text-black font-bold uppercase tracking-wide">Settings</span>
</a>
</nav>
</div>
</div>
</div>
<!-- Main Content Area: Split Pane -->
<div class="flex flex-1 h-full overflow-hidden">
<!-- Left Pane: Order List -->
<div class="w-1/3 border-r-3 border-black flex flex-col bg-white h-full relative z-0">
<!-- List Header -->
<div class="p-6 border-b-3 border-black bg-white sticky top-0 z-10 flex justify-between items-center">
<h2 class="text-2xl font-bold uppercase tracking-widest text-black">Order Log</h2>
<div class="bg-black text-primary px-3 py-1 font-bold text-sm">45 ACTIVE</div>
</div>
<!-- List Items -->
<div class="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 bg-background-light">
<!-- Active Item -->
<div class="brutal-border bg-primary brutal-shadow p-4 cursor-pointer relative overflow-hidden">
<!-- Diagonal stripes pattern over primary color to make it pop -->
<div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px);"></div>
<div class="relative z-10 flex justify-between items-start mb-2">
<h3 class="text-xl font-bold text-black uppercase tracking-wide">#ORD-8821</h3>
<span class="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">LIVE</span>
</div>
<div class="relative z-10 flex justify-between items-end">
<div class="text-black">
<p class="font-bold text-lg leading-none">Jane Doe</p>
<p class="text-sm font-medium mt-1">2 Items</p>
</div>
<p class="text-2xl font-bold text-black tracking-tighter">₹2,400</p>
</div>
</div>
<!-- Regular Item -->
<div class="brutal-border bg-white brutal-shadow p-4 cursor-pointer hover:bg-gray-50 transition-colors">
<div class="flex justify-between items-start mb-2">
<h3 class="text-xl font-bold text-black uppercase tracking-wide">#ORD-8820</h3>
<span class="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">SHIPPED</span>
</div>
<div class="flex justify-between items-end">
<div class="text-black">
<p class="font-bold text-lg leading-none">John Smith</p>
<p class="text-slate-500 text-sm font-medium mt-1">1 Item</p>
</div>
<p class="text-2xl font-bold text-black tracking-tighter">₹1,200</p>
</div>
</div>
<!-- Refunded Item -->
<div class="brutal-border bg-white brutal-shadow p-4 cursor-pointer opacity-75">
<div class="flex justify-between items-start mb-2">
<h3 class="text-xl font-bold text-slate-500 uppercase tracking-wide line-through decoration-2">#ORD-8819</h3>
<span class="bg-accent text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">REFUNDED</span>
</div>
<div class="flex justify-between items-end">
<div class="text-slate-600">
<p class="font-bold text-lg leading-none">Alice Cooper</p>
<p class="text-slate-400 text-sm font-medium mt-1">3 Items</p>
</div>
<p class="text-2xl font-bold text-slate-500 tracking-tighter line-through decoration-2">₹4,500</p>
</div>
</div>
<!-- Regular Item -->
<div class="brutal-border bg-white brutal-shadow p-4 cursor-pointer hover:bg-gray-50 transition-colors">
<div class="flex justify-between items-start mb-2">
<h3 class="text-xl font-bold text-black uppercase tracking-wide">#ORD-8818</h3>
<span class="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">PROCESSING</span>
</div>
<div class="flex justify-between items-end">
<div class="text-black">
<p class="font-bold text-lg leading-none">Bob Vance</p>
<p class="text-slate-500 text-sm font-medium mt-1">1 Item</p>
</div>
<p class="text-2xl font-bold text-black tracking-tighter">₹800</p>
</div>
</div>
<!-- Regular Item -->
<div class="brutal-border bg-white brutal-shadow p-4 cursor-pointer hover:bg-gray-50 transition-colors">
<div class="flex justify-between items-start mb-2">
<h3 class="text-xl font-bold text-black uppercase tracking-wide">#ORD-8817</h3>
<span class="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">DELIVERED</span>
</div>
<div class="flex justify-between items-end">
<div class="text-black">
<p class="font-bold text-lg leading-none">Chris P. Bacon</p>
<p class="text-slate-500 text-sm font-medium mt-1">4 Items</p>
</div>
<p class="text-2xl font-bold text-black tracking-tighter">₹5,200</p>
</div>
</div>
</div>
</div>
<!-- Right Pane: Order Details -->
<div class="flex-1 bg-background-light overflow-y-auto no-scrollbar relative">
<!-- Detail Header -->
<div class="p-8 border-b-3 border-black bg-white sticky top-0 z-20 flex justify-between items-end">
<div>
<div class="flex items-center gap-4 mb-2">
<h2 class="text-5xl font-bold text-black tracking-tighter uppercase">#ORD-8821</h2>
<span class="bg-primary brutal-border px-3 py-1 text-sm font-bold uppercase text-black">LIVE - ACTION REQ</span>
</div>
<p class="text-slate-500 font-bold uppercase tracking-wider text-sm">Placed: Oct 24, 2023 - 14:32 IST</p>
</div>
<div class="text-right">
<p class="text-slate-500 font-bold uppercase text-sm mb-1">Total Value</p>
<p class="text-4xl font-bold text-black tracking-tighter">₹2,400</p>
</div>
</div>
<div class="p-8 grid grid-cols-2 gap-8">
<!-- Left Column: Customer & Items -->
<div class="space-y-8">
<!-- Customer Info Card -->
<div class="bg-white brutal-border p-6 brutal-shadow">
<h3 class="text-xl font-bold text-black uppercase border-b-3 border-black pb-2 mb-4">Customer Details</h3>
<div class="space-y-4">
<div>
<p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Name &amp; Email</p>
<p class="text-lg font-bold text-black">Jane Doe</p>
<p class="text-sm font-medium text-black">jane.doe@example.com</p>
</div>
<div>
<p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Shipping Address</p>
<p class="text-base font-medium text-black uppercase">
                                    123 Neo Street, Apt 4B<br/>
                                    Cyber City, MH 400001<br/>
                                    India
                                </p>
</div>
<div>
<p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Contact</p>
<p class="text-base font-bold text-black">+91 98765 43210</p>
</div>
</div>
</div>
<!-- Line Items -->
<div class="bg-white brutal-border p-6 brutal-shadow">
<h3 class="text-xl font-bold text-black uppercase border-b-3 border-black pb-2 mb-4">Line Items</h3>
<div class="space-y-4">
<div class="flex gap-4 items-center p-2 border-2 border-slate-200">
<div class="w-16 h-16 bg-slate-200 brutal-border flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-slate-400">checkroom</span>
</div>
<div class="flex-1">
<h4 class="font-bold text-black uppercase text-sm">Heavyweight Hoodie</h4>
<p class="text-xs text-slate-500 font-bold uppercase">Variant: L / Onyx Black</p>
</div>
<div class="text-right">
<p class="font-bold text-black">₹1,800</p>
<p class="text-xs text-slate-500 font-bold">Qty: 1</p>
</div>
</div>
<div class="flex gap-4 items-center p-2 border-2 border-slate-200">
<div class="w-16 h-16 bg-slate-200 brutal-border flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-slate-400">shopping_bag</span>
</div>
<div class="flex-1">
<h4 class="font-bold text-black uppercase text-sm">Utility Tote</h4>
<p class="text-xs text-slate-500 font-bold uppercase">Variant: OS / Acid Yellow</p>
</div>
<div class="text-right">
<p class="font-bold text-black">₹600</p>
<p class="text-xs text-slate-500 font-bold">Qty: 1</p>
</div>
</div>
</div>
<div class="mt-6 pt-4 border-t-3 border-black space-y-2">
<div class="flex justify-between text-sm font-bold uppercase text-slate-600">
<span>Subtotal</span>
<span>₹2,400</span>
</div>
<div class="flex justify-between text-sm font-bold uppercase text-slate-600">
<span>Shipping</span>
<span>₹0</span>
</div>
<div class="flex justify-between text-lg font-bold uppercase text-black pt-2">
<span>Total Paid</span>
<span>₹2,400</span>
</div>
</div>
</div>
</div>
<!-- Right Column: Fulfillment & Actions -->
<div class="space-y-8">
<!-- Tracking Timeline -->
<div class="bg-white brutal-border p-6 brutal-shadow">
<div class="flex justify-between items-end border-b-3 border-black pb-2 mb-6">
<h3 class="text-xl font-bold text-black uppercase">Shadowfax Log</h3>
<span class="text-xs font-bold text-slate-500 uppercase">AWB: SFX889211</span>
</div>
<div class="ml-4 border-l-3 border-black pl-8 space-y-8 relative">
<!-- Current Node -->
<div class="relative">
<div class="absolute -left-[39px] top-1 w-4 h-4 bg-primary brutal-border shadow-[2px_2px_0px_#000]"></div>
<p class="text-sm font-bold text-black uppercase">Delayed at Hub - Action Req</p>
<p class="text-xs font-bold text-slate-500 uppercase mt-1">Oct 26, 09:15 IST • Mumbai Sorting Center</p>
<div class="mt-2 inline-block bg-black text-white px-2 py-1 text-xs font-bold uppercase">Customer Requested Address Change</div>
</div>
<!-- Past Node -->
<div class="relative opacity-60">
<div class="absolute -left-[39px] top-1 w-4 h-4 bg-black"></div>
<p class="text-sm font-bold text-black uppercase">Dispatched from Warehouse</p>
<p class="text-xs font-bold text-slate-500 uppercase mt-1">Oct 25, 18:30 IST • Bhiwandi Facility</p>
</div>
<!-- Past Node -->
<div class="relative opacity-60">
<div class="absolute -left-[39px] top-1 w-4 h-4 bg-black"></div>
<p class="text-sm font-bold text-black uppercase">Order Packed</p>
<p class="text-xs font-bold text-slate-500 uppercase mt-1">Oct 25, 10:00 IST • Warehouse A</p>
</div>
<!-- Origin Node -->
<div class="relative opacity-60">
<div class="absolute -left-[39px] top-1 w-4 h-4 bg-black"></div>
<p class="text-sm font-bold text-black uppercase">Order Received</p>
<p class="text-xs font-bold text-slate-500 uppercase mt-1">Oct 24, 14:32 IST • Online Storefront</p>
</div>
</div>
<button class="w-full mt-8 bg-white text-black border-3 border-black py-3 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors brutal-shadow">
                            Update Tracking Manually
                        </button>
</div>
<!-- Financial Actions (Destructive) -->
<div class="bg-white brutal-border p-6 brutal-shadow border-t-8 border-t-accent">
<h3 class="text-xl font-bold text-black uppercase border-b-3 border-black pb-2 mb-4">Resolution</h3>
<p class="text-sm font-bold text-slate-600 mb-6 uppercase">Customer requested cancellation due to delay. Issue refund via gateway.</p>
<!-- The Refund Button -->
<button class="w-full bg-accent text-white border-3 border-black py-4 text-lg font-bold uppercase tracking-widest brutal-shadow hover:bg-white hover:text-accent transition-all group relative overflow-hidden">
<span class="relative z-10 flex items-center justify-center gap-2">
<span class="material-symbols-outlined">payments</span>
                                Issue Razorpay Refund
                            </span>
</button>
</div>
</div>
</div>
</div>
</div>
</body></html>

<!-- Storefront Config -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Neo-Brutalist Storefront Config</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#dcf906",
                        "background-light": "#f8f8f5",
                        "background-dark": "#20230f",
                        "accent": "#FF00FF",
                        "surface": "#FFFFFF",
                        "text-main": "#000000",
                        "muted": "#999999"
                    },
                    fontFamily: {
                        "display": ["Space Grotesk", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem", "sm": "0.125rem" },
                    boxShadow: {
                        'brutal': '6px 6px 0px #000000',
                        'brutal-hover': '8px 8px 0px #000000',
                        'brutal-sm': '4px 4px 0px #000000',
                    },
                    borderWidth: {
                        '3': '3px',
                    }
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #f8f8f5;
            color: #000000;
        }

        /* Brutalist Base Styles */
        .brutal-card {
            background-color: #FFFFFF;
            border: 3px solid #000000;
            box-shadow: 6px 6px 0px #000000;
            border-radius: 0.125rem;
            transition: all 0.2s ease;
        }

        .brutal-button {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            border-radius: 0.125rem;
            text-transform: uppercase;
            font-weight: 800;
            transition: all 0.15s ease;
        }

        .brutal-button:hover:not(:disabled) {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000000;
        }
        
        .brutal-button:active:not(:disabled) {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px #000000;
        }

        .brutal-input {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            border-radius: 0.125rem;
            transition: all 0.2s ease;
        }

        .brutal-input:focus {
            outline: none;
            box-shadow: 6px 6px 0px #000000;
            transform: translate(-2px, -2px);
        }

        .brutal-input.error {
            border-color: #FF00FF;
            animation: flash-error 0.5s ease;
        }

        @keyframes flash-error {
            0%, 100% { border-color: #000000; }
            50% { border-color: #FF00FF; }
        }

        /* Custom Toggle Switch */
        .toggle-checkbox:checked {
            right: 0;
            border-color: #000000;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #dcf906;
        }
        
        .toggle-label {
            transition: all 0.2s ease-in-out;
        }
        
        .toggle-dot {
            transition: all 0.2s ease-in-out;
        }
        
        .toggle-checkbox:checked ~ .toggle-label .toggle-dot {
            transform: translateX(100%);
            background-color: #000000;
        }

        /* Dashed Uploader */
        .dashed-uploader {
            border: 3px dashed #000000;
            background-color: #f8f8f5;
            transition: all 0.2s ease;
        }
        .dashed-uploader:hover {
            background-color: #dcf906;
            cursor: pointer;
        }

    </style>
</head>
<body class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
<!-- Sidebar Layout Container -->
<div class="layout-container flex h-full grow flex-row w-full">
<!-- SIDEBAR (Shared Component logic applied: Destination screen, show nav) -->
<div class="hidden md:flex flex-col w-[280px] min-h-screen bg-background-light dark:bg-background-dark border-r-3 border-black p-4 shrink-0 fixed h-full z-10">
<div class="flex flex-col gap-8 h-full">
<!-- Brand/User -->
<div class="flex gap-3 items-center brutal-card p-3 bg-surface">
<div class="bg-primary aspect-square rounded-sm size-12 border-3 border-black flex items-center justify-center font-black text-xl">
                        NB
                    </div>
<div class="flex flex-col">
<h1 class="text-text-main text-lg font-black leading-none uppercase tracking-tighter">NEO-BRUTAL</h1>
<p class="text-text-main/70 text-sm font-bold uppercase tracking-widest mt-1">Admin Panel</p>
</div>
</div>
<!-- Nav Links -->
<nav class="flex flex-col gap-3 flex-1">
<a class="flex items-center gap-4 px-4 py-3 brutal-card bg-surface hover:-translate-y-1 hover:shadow-brutal-hover" href="#">
<span class="material-symbols-outlined text-text-main" style="font-variation-settings: 'FILL' 0;">mobile_layout</span>
<span class="text-text-main text-base font-bold uppercase tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 brutal-card bg-surface hover:-translate-y-1 hover:shadow-brutal-hover" href="#">
<span class="material-symbols-outlined text-text-main" style="font-variation-settings: 'FILL' 0;">package</span>
<span class="text-text-main text-base font-bold uppercase tracking-wide">Inventory</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 brutal-card bg-surface hover:-translate-y-1 hover:shadow-brutal-hover" href="#">
<span class="material-symbols-outlined text-text-main" style="font-variation-settings: 'FILL' 0;">shopping_cart</span>
<span class="text-text-main text-base font-bold uppercase tracking-wide">Orders</span>
</a>
<!-- ACTIVE STATE -->
<a class="flex items-center gap-4 px-4 py-3 brutal-card bg-primary translate-y-[-2px] shadow-brutal-hover border-black" href="#">
<span class="material-symbols-outlined text-text-main" style="font-variation-settings: 'FILL' 1;">storefront</span>
<span class="text-text-main text-base font-black uppercase tracking-wide">Storefront Config</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 brutal-card bg-surface hover:-translate-y-1 hover:shadow-brutal-hover" href="#">
<span class="material-symbols-outlined text-text-main" style="font-variation-settings: 'FILL' 0;">terminal</span>
<span class="text-text-main text-base font-bold uppercase tracking-wide">Access &amp; Logs</span>
</a>
</nav>
<!-- Bottom Info -->
<div class="mt-auto p-4 border-t-3 border-black text-xs font-bold uppercase tracking-widest flex justify-between items-center">
<span>SYS_STAT: ON</span>
<span class="w-3 h-3 bg-primary border border-black rounded-full animate-pulse"></span>
</div>
</div>
</div>
<!-- MAIN CONTENT AREA -->
<main class="flex-1 ml-0 md:ml-[280px] flex flex-col relative pb-32">
<!-- Page Header -->
<header class="p-8 border-b-3 border-black bg-surface sticky top-0 z-20 shadow-brutal-sm">
<div class="max-w-4xl mx-auto flex flex-col gap-2">
<h2 class="text-text-main text-5xl font-black leading-tight tracking-tighter uppercase">STOREFRONT CONFIG</h2>
<p class="text-text-main/70 text-lg font-bold uppercase tracking-widest max-w-2xl">Manage public presence, drops, and system status.</p>
</div>
</header>
<!-- Config Content Scrollable -->
<div class="p-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
<!-- 1. SYSTEM STATUS CARD (Maintenance Toggle) -->
<section class="brutal-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-surface">
<div class="flex flex-col gap-3 max-w-md">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">lock</span>
<h3 class="text-3xl font-black uppercase tracking-tighter">System Status</h3>
</div>
<p class="text-base font-bold text-text-main/80 uppercase">Engage lockdown mode to hide storefront from public view during drop preparations. Only admins can bypass.</p>
<!-- Dynamic Status Text -->
<div class="mt-4 inline-flex items-center gap-2 px-4 py-2 border-3 border-black bg-background-light font-bold text-sm uppercase self-start">
<span class="w-3 h-3 bg-muted border border-black rounded-full block" id="status-indicator"></span>
<span id="status-text">STOREFRONT LIVE</span>
</div>
</div>
<!-- Massive Toggle Switch -->
<div class="relative w-[120px] h-[60px] flex-shrink-0">
<input class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 top-0 left-0 opacity-0" id="maintenance-toggle" style="width: 100%; height: 100%;" type="checkbox"/>
<label class="toggle-label block overflow-hidden h-full rounded-sm bg-surface border-3 border-black cursor-pointer shadow-brutal-sm relative" for="maintenance-toggle">
<!-- Toggle Dot -->
<span class="toggle-dot absolute top-[3px] left-[3px] bg-white border-3 border-black w-[48px] h-[48px] rounded-sm flex items-center justify-center transition-transform">
<span class="material-symbols-outlined text-black font-bold" style="font-size: 24px;">power_settings_new</span>
</span>
</label>
</div>
</section>
<!-- 2. CINEMATIC HERO CARD -->
<section class="brutal-card p-8 flex flex-col gap-8 bg-surface">
<div class="flex items-center gap-3 border-b-3 border-black pb-4">
<span class="material-symbols-outlined text-4xl text-text-main" style="font-variation-settings: 'FILL' 1;">image</span>
<h3 class="text-3xl font-black uppercase tracking-tighter">Cinematic Hero</h3>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<!-- Text Inputs -->
<div class="flex flex-col gap-6">
<div class="flex flex-col gap-2">
<label class="text-sm font-black uppercase tracking-widest text-text-main">Hero Heading</label>
<input class="brutal-input w-full p-4 text-xl font-bold uppercase bg-background-light text-text-main" placeholder="ENTER HEADING" type="text" value="DROP 04: TOXIC WASTE"/>
</div>
<div class="flex flex-col gap-2">
<label class="text-sm font-black uppercase tracking-widest text-text-main">Subtext</label>
<textarea class="brutal-input w-full p-4 text-base font-bold uppercase bg-background-light text-text-main resize-none" placeholder="ENTER SUBTEXT" rows="3">LIMITED RUN. NO RESTOCKS. SECURE YOUR PIECE BEFORE THE GRID GOES DARK.</textarea>
</div>
<div class="flex flex-col gap-2">
<label class="text-sm font-black uppercase tracking-widest text-text-main">CTA Button Text</label>
<input class="brutal-input w-full p-4 text-lg font-bold uppercase bg-background-light text-text-main" placeholder="BUTTON TEXT" type="text" value="ENTER THE VAULT"/>
</div>
</div>
<!-- Image Uploader -->
<div class="flex flex-col gap-2 h-full min-h-[300px]">
<label class="text-sm font-black uppercase tracking-widest text-text-main flex justify-between">
<span>Background Asset</span>
<span class="text-accent">MAX 5MB</span>
</label>
<!-- Error State Example Class available here: add 'error' to dashed-uploader -->
<div class="dashed-uploader flex-1 rounded-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
<!-- Existing Image Preview (Simulated) -->
<img class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply group-hover:opacity-10" data-alt="Abstract neon toxic green and black geometric background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK29jasVOK3Vek1cGk5Bslg3AspO3lvtqQhfrk3JKIRd2R2aOp-Lhmi2fmTYtwhAgKk3mG9zLg0dt9hcL8oV0GatYtHigae7rNjKW5zq7gerX5OZsdSO9EVQnpLU5CWe6cE3Jai4tVWb6UzO3MACYcYzmHdK7953D2tCsK_y8PWT2mQ-qn8pQRSv2lAv7gg-I0W0U6H45KgkrthVBfqH_yhkSlh1qcmCxsPYlp0TD246nQ4T0ywEuKpXA-zpRAHAlYHhSxyhSWZGE"/>
<span class="material-symbols-outlined text-5xl mb-4 relative z-10" style="font-variation-settings: 'FILL' 0;">cloud_upload</span>
<p class="text-xl font-black uppercase relative z-10">DRAG &amp; DROP ASSET</p>
<p class="text-sm font-bold uppercase text-text-main/70 mt-2 relative z-10">JPG, PNG, WEBP (1920x1080)</p>
<button class="brutal-button bg-surface text-text-main px-6 py-2 text-sm mt-6 relative z-10">BROWSE FILES</button>
</div>
</div>
</div>
</section>
<!-- 3. PROMOTIONS CARD -->
<section class="brutal-card p-8 flex flex-col gap-6 bg-surface">
<div class="flex items-center gap-3 border-b-3 border-black pb-4">
<span class="material-symbols-outlined text-4xl text-text-main" style="font-variation-settings: 'FILL' 1;">sell</span>
<h3 class="text-3xl font-black uppercase tracking-tighter">Active Promotions</h3>
</div>
<div class="flex flex-col gap-4">
<!-- Promo Item 1 -->
<div class="flex flex-col md:flex-row gap-4 items-end bg-background-light p-6 border-3 border-black rounded-sm relative">
<button class="absolute -top-4 -right-4 bg-accent text-white border-3 border-black rounded-full size-10 flex items-center justify-center hover:scale-110 transition-transform shadow-brutal-sm" title="Remove Promo">
<span class="material-symbols-outlined font-bold">close</span>
</button>
<div class="flex flex-col gap-2 w-full md:w-2/3">
<label class="text-sm font-black uppercase tracking-widest">Promo Code</label>
<input class="brutal-input w-full p-6 text-3xl font-black uppercase bg-surface text-text-main tracking-widest text-center" placeholder="CODE" type="text" value="NEOBRUTAL20"/>
</div>
<div class="flex flex-col gap-2 w-full md:w-1/3">
<label class="text-sm font-black uppercase tracking-widest">Discount %</label>
<div class="relative">
<input class="brutal-input w-full p-6 text-3xl font-black uppercase bg-surface text-text-main text-right pr-16" placeholder="00" type="number" value="20"/>
<span class="absolute right-6 top-1/2 -translate-y-1/2 text-3xl font-black">%</span>
</div>
</div>
</div>
<!-- Add Promo Button -->
<button class="brutal-button bg-surface w-full py-6 flex items-center justify-center gap-3 border-dashed text-xl text-text-main/60 hover:text-text-main hover:bg-primary/20">
<span class="material-symbols-outlined text-3xl font-bold">add</span>
<span>ADD PROMO CODE</span>
</button>
</div>
</section>
</div>
<!-- 4. STICKY SAVE BAR -->
<div class="fixed bottom-0 left-0 md:left-[280px] right-0 bg-text-main border-t-3 border-black p-4 z-50 shadow-[0_-8px_0_rgba(0,0,0,1)]">
<div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<div class="flex items-center gap-3 text-surface">
<span class="material-symbols-outlined text-accent animate-pulse" style="font-variation-settings: 'FILL' 1;">warning</span>
<span class="font-bold uppercase tracking-widest">Unsaved Changes Detected</span>
</div>
<div class="flex gap-4 w-full md:w-auto">
<button class="brutal-button bg-surface text-text-main px-6 py-4 text-sm w-full md:w-auto">DISCARD</button>
<button class="brutal-button bg-primary text-text-main px-8 py-4 text-xl w-full md:w-auto flex items-center justify-center gap-2 group">
<span>PUBLISH CHANGES</span>
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform font-bold">arrow_forward</span>
</button>
</div>
</div>
</div>
</main>
</div>
<!-- Minimal JS for UI Interaction demonstration (Optional, but adds to the prototype feel without breaking rules) -->
<script>
        document.addEventListener('DOMContentLoaded', () => {
            const toggle = document.getElementById('maintenance-toggle');
            const statusIndicator = document.getElementById('status-indicator');
            const statusText = document.getElementById('status-text');

            if(toggle) {
                toggle.addEventListener('change', (e) => {
                    if(e.target.checked) {
                        statusIndicator.classList.remove('bg-muted');
                        statusIndicator.classList.add('bg-accent', 'animate-pulse');
                        statusText.innerText = "LOCKDOWN ACTIVE";
                        statusText.classList.add('text-accent');
                    } else {
                        statusIndicator.classList.add('bg-muted');
                        statusIndicator.classList.remove('bg-accent', 'animate-pulse');
                        statusText.innerText = "STOREFRONT LIVE";
                        statusText.classList.remove('text-accent');
                    }
                });
            }
        });
    </script>
</body></html>

<!-- Access & Logs -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Neo-Merch Admin - Access &amp; Logs</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#E0FF00",
              "accent": "#FF00FF",
              "background-light": "#F4F4F0",
              "background-dark": "#1a1a1a",
              "surface": "#FFFFFF",
              "muted": "#999999",
            },
            fontFamily: {
              "display": ["Space Grotesk", "sans-serif"],
              "heading": ["Syne", "sans-serif"],
              "mono": ["Space Mono", "monospace"],
            },
            borderWidth: {
              '3': '3px',
            },
            boxShadow: {
              'brutal': '6px 6px 0px #000000',
              'brutal-hover': '8px 8px 0px #000000',
            },
            borderRadius: {
              "DEFAULT": "0px",
              "lg": "0px",
              "xl": "0px",
              "full": "0px",
            },
            keyframes: {
              blink: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0 },
              }
            },
            animation: {
              blink: 'blink 1s step-end infinite',
            }
          },
        },
      }
    </script>
<style>
        body {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #F4F4F0;
            color: #000000;
        }
        
        .brutal-border {
            border: 3px solid #000000;
        }
        
        .brutal-shadow {
            box-shadow: 6px 6px 0px #000000;
            transition: all 0.2s ease;
        }
        
        .brutal-shadow:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0px #000000;
        }

        .brutal-shadow:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000000;
        }

        .terminal-scroll::-webkit-scrollbar {
            width: 12px;
        }
        .terminal-scroll::-webkit-scrollbar-track {
            background: #000000;
            border-left: 3px solid #333;
        }
        .terminal-scroll::-webkit-scrollbar-thumb {
            background: #E0FF00;
            border: 3px solid #000000;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #E0FF00;
            background-color: #FFFFFF;
        }
        
        /* Custom radio/checkbox styles */
        input[type="radio"]:checked {
            background-color: #000000;
            border-color: #000000;
        }
    </style>
</head>
<body class="flex h-screen overflow-hidden bg-background-light selection:bg-primary selection:text-black">
<!-- Shared SideNavBar -->
<div class="relative flex h-auto min-h-screen w-[280px] flex-col bg-surface brutal-border border-r-3 border-y-0 border-l-0 shrink-0 z-10 overflow-y-auto">
<div class="flex h-full flex-col justify-between p-6">
<div class="flex flex-col gap-8">
<div class="flex flex-col border-b-3 border-black pb-6">
<h1 class="text-black text-2xl font-heading font-extrabold uppercase leading-none tracking-tight">NEO-MERCH</h1>
<p class="text-black font-mono font-bold text-sm uppercase mt-1 bg-primary inline-block px-1 w-fit">ADMIN SYSTEM</p>
</div>
<nav class="flex flex-col gap-2">
<a class="flex items-center gap-3 px-4 py-3 hover:bg-black hover:text-white transition-colors group" href="#">
<div class="material-symbols-outlined text-black group-hover:text-white" data-icon="layout">layout</div>
<span class="font-heading font-bold uppercase text-sm group-hover:text-white">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 hover:bg-black hover:text-white transition-colors group" href="#">
<div class="material-symbols-outlined text-black group-hover:text-white" data-icon="package">package</div>
<span class="font-heading font-bold uppercase text-sm group-hover:text-white">Inventory</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 hover:bg-black hover:text-white transition-colors group" href="#">
<div class="material-symbols-outlined text-black group-hover:text-white" data-icon="shopping_cart">shopping_cart</div>
<span class="font-heading font-bold uppercase text-sm group-hover:text-white">Orders</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 hover:bg-black hover:text-white transition-colors group" href="#">
<div class="material-symbols-outlined text-black group-hover:text-white" data-icon="storefront">storefront</div>
<span class="font-heading font-bold uppercase text-sm group-hover:text-white">Storefront</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 bg-primary brutal-border brutal-shadow" href="#">
<div class="material-symbols-outlined text-black" data-icon="shield" style="font-variation-settings: 'FILL' 1;">shield</div>
<span class="font-heading font-bold uppercase text-sm text-black">Access &amp; Logs</span>
</a>
</nav>
</div>
<div class="mt-auto pt-6 border-t-3 border-black">
<div class="flex items-center gap-3 px-4 py-3 bg-black text-white brutal-shadow">
<div class="w-8 h-8 bg-primary rounded-none border-2 border-white flex items-center justify-center">
<span class="font-mono font-bold text-black text-xs">AD</span>
</div>
<div class="flex flex-col">
<span class="font-mono text-xs text-primary">Logged in as</span>
<span class="font-heading text-sm uppercase">ADMIN_01</span>
</div>
</div>
</div>
</div>
</div>
<!-- Main Content Area -->
<main class="flex-1 flex flex-col h-full overflow-hidden bg-background-light">
<!-- Header -->
<header class="flex items-center justify-between border-b-3 border-black bg-surface px-8 py-6 shrink-0 z-0">
<div class="flex items-center gap-4">
<h2 class="text-black text-3xl font-heading font-extrabold uppercase tracking-tight">ACCESS &amp; LOGS</h2>
<span class="bg-black text-white font-mono text-xs px-2 py-1 uppercase border-2 border-black">SYSTEM CONTROL</span>
</div>
<div class="flex gap-4">
<div class="flex items-center gap-2 bg-background-light border-3 border-black px-4 py-2">
<div class="w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-black"></div>
<span class="font-mono text-sm font-bold uppercase">System Online</span>
</div>
</div>
</header>
<!-- Scrollable Content -->
<div class="flex-1 overflow-y-auto p-8">
<div class="max-w-6xl mx-auto flex flex-col gap-8">
<!-- Brutalist Tabs -->
<div class="flex gap-4 border-b-3 border-black pb-0">
<button class="bg-primary text-black font-heading font-bold text-lg uppercase px-8 py-4 border-3 border-black border-b-0 translate-y-[3px] z-10">
                        Team Invites
                    </button>
<button class="bg-surface text-muted hover:text-black font-heading font-bold text-lg uppercase px-8 py-4 border-3 border-black border-b-0 opacity-70 hover:opacity-100 transition-opacity">
                        Email Logs
                    </button>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Left Column: Generate Access -->
<div class="lg:col-span-5 flex flex-col gap-6">
<div class="bg-surface brutal-border brutal-shadow p-8 flex flex-col gap-6">
<div class="flex flex-col gap-1 border-b-3 border-black pb-4">
<h3 class="font-heading font-extrabold text-2xl uppercase">GENERATE ACCESS MANIFEST</h3>
<p class="font-mono text-sm text-muted">Issue single-use OTP for team onboarding.</p>
</div>
<form class="flex flex-col gap-6">
<div class="flex flex-col gap-2">
<label class="font-mono font-bold text-sm uppercase flex justify-between">
<span>Phone Number</span>
<span class="text-muted">REQ</span>
</label>
<div class="flex items-center border-3 border-black bg-background-light focus-within:bg-white focus-within:border-primary transition-colors">
<span class="font-mono font-bold px-4 py-3 border-r-3 border-black bg-black text-white">+91</span>
<input class="w-full bg-transparent border-none font-mono text-lg p-3 placeholder:text-muted focus:ring-0" placeholder="98765 43210" type="tel"/>
</div>
</div>
<div class="flex flex-col gap-2">
<label class="font-mono font-bold text-sm uppercase">Assign Role</label>
<div class="relative">
<select class="w-full appearance-none border-3 border-black bg-surface font-mono font-bold text-lg p-3 pr-10 focus:ring-0 focus:border-primary cursor-pointer">
<option>[OWNER]</option>
<option selected="">[OPS]</option>
<option>[SUPPORT]</option>
<option>[GUEST]</option>
</select>
<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none border-l-3 border-black bg-black text-white">
<span class="material-symbols-outlined" data-icon="expand_more">expand_more</span>
</div>
</div>
</div>
<button class="mt-4 bg-primary text-black font-heading font-extrabold text-lg uppercase py-4 border-3 border-black brutal-shadow flex items-center justify-center gap-2" type="button">
<span class="material-symbols-outlined" data-icon="key">key</span>
                                    GENERATE SINGLE-USE CODE
                                </button>
</form>
</div>
<!-- Active Invites List -->
<div class="bg-surface brutal-border p-6 flex flex-col gap-4">
<h4 class="font-heading font-bold text-lg uppercase border-b-3 border-black pb-2">PENDING MANIFESTS</h4>
<div class="flex flex-col gap-3">
<div class="flex items-center justify-between border-3 border-black p-3 bg-background-light">
<div class="flex flex-col">
<span class="font-mono font-bold text-sm">+91 98*** **210</span>
<span class="font-mono text-xs text-muted">Role: [OPS]</span>
</div>
<div class="flex items-center gap-2">
<span class="font-mono text-xs font-bold bg-black text-primary px-2 py-1">OTP SENT</span>
<button class="text-black hover:text-accent p-1 border-2 border-transparent hover:border-accent transition-colors">
<span class="material-symbols-outlined text-[20px]" data-icon="close">close</span>
</button>
</div>
</div>
<div class="flex items-center justify-between border-3 border-black p-3 bg-background-light opacity-60 grayscale">
<div class="flex flex-col">
<span class="font-mono font-bold text-sm">+91 99*** **881</span>
<span class="font-mono text-xs text-muted">Role: [SUPPORT]</span>
</div>
<div class="flex items-center gap-2">
<span class="font-mono text-xs font-bold bg-muted text-white px-2 py-1">EXPIRED</span>
</div>
</div>
</div>
</div>
</div>
<!-- Right Column: Terminal Logs -->
<div class="lg:col-span-7 flex flex-col h-[700px]">
<div class="bg-black brutal-border brutal-shadow flex-1 flex flex-col overflow-hidden relative group">
<!-- Terminal Header -->
<div class="flex items-center justify-between border-b-3 border-[#333] bg-[#111] px-4 py-3 shrink-0">
<div class="flex items-center gap-3">
<div class="flex gap-1.5">
<div class="w-3 h-3 bg-accent rounded-full border-2 border-black"></div>
<div class="w-3 h-3 bg-primary rounded-full border-2 border-black"></div>
<div class="w-3 h-3 bg-white rounded-full border-2 border-black"></div>
</div>
<span class="font-mono text-white text-xs uppercase font-bold tracking-widest">SYSTEM_TRANSMISSIONS.LOG</span>
</div>
<div class="flex items-center gap-2">
<button class="text-muted hover:text-white font-mono text-xs uppercase border border-[#333] px-2 py-1 hover:border-white transition-colors">
                                        CLEAR
                                    </button>
<button class="text-muted hover:text-primary font-mono text-xs uppercase border border-[#333] px-2 py-1 hover:border-primary transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]" data-icon="download">download</span>
                                        DUMP
                                    </button>
</div>
</div>
<!-- Terminal Content -->
<div class="flex-1 p-6 font-mono text-sm overflow-y-auto terminal-scroll break-all leading-relaxed flex flex-col gap-1 text-muted">
<div><span class="text-[#555]">[2023-10-24 14:30:00]</span> <span class="text-white">SYS_INIT:</span> Booting Access Control Module... OK</div>
<div><span class="text-[#555]">[2023-10-24 14:30:05]</span> <span class="text-white">AUTH_GATE:</span> Connection established to secure.neo-merch.dev</div>
<div><span class="text-[#555]">[2023-10-24 14:31:12]</span> <span class="text-primary">USER_ACTION:</span> ADMIN_01 accessed /logs</div>
<div><span class="text-[#555]">[2023-10-24 14:31:45]</span> <span class="text-primary">USER_ACTION:</span> ADMIN_01 initiated manifest generation</div>
<div><span class="text-[#555]">[2023-10-24 14:31:45]</span> <span class="text-white">REQ_PAYLOAD:</span> { role: "OPS", target: "+9198******210" }</div>
<div><span class="text-[#555]">[2023-10-24 14:31:46]</span> <span class="text-white">OTP_GEN:</span> Hash generated: a7f8b9...</div>
<div><span class="text-[#555]">[2023-10-24 14:31:47]</span> <span class="text-[#00FF00]">SMS_DISPATCH:</span> SUCCESS -&gt; INVITE_CODE_SENT via Twilio_Gateway</div>
<div><span class="text-[#555]">[2023-10-24 14:32:01]</span> <span class="text-white">EMAIL_DISPATCH:</span> SUCCESS -&gt; Admin notification sent to ops@neo-merch.com</div>
<div class="mt-4"><span class="text-[#555]">[2023-10-24 14:35:10]</span> <span class="text-accent">WARN_LOGIN_ATTEMPT:</span> Invalid OTP entered for +9199******881</div>
<div><span class="text-[#555]">[2023-10-24 14:35:10]</span> <span class="text-accent">AUTH_REJECT:</span> Session terminated. IP logged.</div>
<!-- Active line with cursor -->
<div class="mt-4 flex items-center text-primary font-bold">
<span class="mr-2">&gt;</span> WAITING FOR INPUT <span class="w-3 h-5 bg-primary inline-block ml-1 animate-blink align-middle"></span>
</div>
</div>
<!-- Terminal Overlay Scanline Effect (subtle) -->
<div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
</div>
</div>
</div>
</div>
</div>
</main>
</body></html>

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Neo-Brutalist Streetwear Admin | Inventory</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&amp;family=Syne:wght@700;800&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#E0FF00",
                        "accent": "#FF00FF",
                        "background-light": "#F4F4F0",
                        "background-dark": "#1a1a1a",
                        "surface": "#FFFFFF",
                        "muted": "#999999",
                    },
                    fontFamily: {
                        "display": ["Syne", "sans-serif"],
                        "mono": ["Space Mono", "monospace"]
                    },
                    borderWidth: {
                        "3": "3px"
                    },
                    boxShadow: {
                        "brutal": "6px 6px 0px #000000",
                        "brutal-hover": "8px 8px 0px #000000"
                    },
                    borderRadius: {
                        "DEFAULT": "0px",
                        "lg": "0px",
                        "xl": "0px",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .brutal-border { border: 3px solid #000000; }
        .brutal-border-b { border-bottom: 3px solid #000000; }
        .brutal-border-r { border-right: 3px solid #000000; }
        .brutal-shadow { box-shadow: 6px 6px 0px #000000; }
        .hover-brutal:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0px #000000;
        }
        input:focus {
            outline: none !important;
            ring: 0 !important;
            border-color: #000000 !important;
        }
        .grayscale-hover img {
            filter: grayscale(100%);
            transition: filter 0.2s ease;
        }
        .grayscale-hover:hover img {
            filter: grayscale(0%);
        }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark font-mono text-black selection:bg-primary">
<div class="flex min-h-screen">
<!-- Sidebar Component -->
<aside class="w-64 bg-black text-white brutal-border-r flex flex-col sticky top-0 h-screen">
<div class="p-6 brutal-border-b bg-black">
<h1 class="font-display font-extra-bold text-2xl tracking-tighter text-white">NEO-BRUT</h1>
<p class="text-primary text-[10px] tracking-widest font-mono">ADMIN_V1.0_PROD</p>
</div>
<nav class="flex-1 p-4 flex flex-col gap-2">
<a class="flex items-center gap-3 p-3 font-display uppercase tracking-wider text-muted hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">dashboard</span>
                    Dashboard
                </a>
<a class="flex items-center gap-3 p-3 font-display uppercase tracking-wider bg-primary text-black brutal-border brutal-shadow" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">package</span>
                    Inventory
                </a>
<a class="flex items-center gap-3 p-3 font-display uppercase tracking-wider text-muted hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">shopping_cart</span>
                    Orders
                </a>
<a class="flex items-center gap-3 p-3 font-display uppercase tracking-wider text-muted hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">monitor</span>
                    Storefront
                </a>
<a class="flex items-center gap-3 p-3 font-display uppercase tracking-wider text-muted hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">terminal</span>
                    Access
                </a>
</nav>
<div class="p-4 brutal-border-t border-white/20">
<button class="w-full bg-white text-black p-3 font-display uppercase text-sm brutal-border hover:bg-primary hover:text-black transition-all">
                    Log Out
                </button>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 flex flex-col">
<!-- Header/Action Bar -->
<header class="p-8 flex flex-col gap-6">
<div class="flex justify-between items-end">
<div>
<h2 class="font-display font-extrabold text-5xl uppercase tracking-tighter">Inventory Management</h2>
<p class="text-muted mt-2 font-mono uppercase tracking-widest text-sm">STRICT_GRID_CATALOG // 124_ITEMS_LIVE</p>
</div>
<button class="bg-primary text-black px-8 py-4 font-display font-bold uppercase text-xl brutal-border brutal-shadow hover-brutal flex items-center gap-3">
<span class="material-symbols-outlined">plus_one</span>
                        Add Product
                    </button>
</div>
<!-- Search & Filters -->
<div class="flex gap-4">
<div class="flex-1 relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-black">magnification_large</span>
<input class="w-full pl-12 pr-4 py-4 bg-white brutal-border font-mono uppercase text-sm placeholder:text-muted focus:ring-0" placeholder="SEARCH_PRODUCT_ID_OR_NAME..." type="text"/>
</div>
<div class="flex brutal-border">
<button class="px-6 py-4 bg-black text-white font-display uppercase text-sm">All Items</button>
<button class="px-6 py-4 bg-white text-black font-display uppercase text-sm border-l-3 border-black hover:bg-primary transition-colors">Tees</button>
<button class="px-6 py-4 bg-white text-black font-display uppercase text-sm border-l-3 border-black hover:bg-primary transition-colors">Outerwear</button>
<button class="px-6 py-4 bg-white text-black font-display uppercase text-sm border-l-3 border-black hover:bg-primary transition-colors">Accessories</button>
</div>
</div>
</header>
<!-- Product Table -->
<section class="px-8 pb-12">
<div class="brutal-border bg-white overflow-hidden overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="brutal-border-b bg-black text-white uppercase text-xs tracking-widest">
<th class="p-4 brutal-border-r border-white/20">Thumb</th>
<th class="p-4 brutal-border-r border-white/20">Product Info</th>
<th class="p-4 brutal-border-r border-white/20">SKU</th>
<th class="p-4 brutal-border-r border-white/20">Variants</th>
<th class="p-4 brutal-border-r border-white/20">Price</th>
<th class="p-4 brutal-border-r border-white/20">Stock</th>
<th class="p-4">Status</th>
</tr>
</thead>
<tbody class="divide-y-3 divide-black">
<tr class="hover:bg-primary/5 transition-colors">
<td class="p-4 brutal-border-r">
<div class="w-16 h-16 brutal-border grayscale-hover">
<img alt="Streetwear t-shirt product photo" class="w-full h-full object-cover" data-alt="Heavyweight oversized graphic t-shirt in white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjmmMx1gzF7enB6tgBuNQbzokRca4u-AxUnAAvqOnGaZDiHQbHU5fK-dSrQC1kwue_1mAIRBA0ID93nuhtp3b1nKpa38ScglNz-tFVsZKJpoaYvCaLsnMPZUbQv-QuYwN2_vlMnZWo7wVAnFP0-QcjizO-00PCGdqNVwZYHBuAufwhGnUnMeNQsMZaL045JiHOAGYvaHz3VXalu_YajETeQ8KgyE88yE8P5fU-QQRnTj5Ik6n4dw5451lz4o_ViJavN9BGEWlT5bI"/>
</div>
</td>
<td class="p-4 brutal-border-r">
<div class="font-bold uppercase">"VOID" Heavyweight Tee</div>
<div class="text-xs text-muted mt-1">Cotton Jersey / 280 GSM</div>
</td>
<td class="p-4 brutal-border-r text-sm">TSH-VOID-001</td>
<td class="p-4 brutal-border-r">
<div class="flex gap-1">
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[S]</span>
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[M]</span>
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[L]</span>
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[XL]</span>
</div>
</td>
<td class="p-4 brutal-border-r font-bold">₹2,499</td>
<td class="p-4 brutal-border-r">
<div class="flex items-center gap-2">
<div class="w-full bg-background-light h-2 brutal-border">
<div class="bg-black h-full" style="width: 65%;"></div>
</div>
<span class="text-xs font-bold">142</span>
</div>
</td>
<td class="p-4">
<span class="bg-primary text-black px-3 py-1 font-bold text-xs brutal-border uppercase tracking-tighter">Live</span>
</td>
</tr>
<tr class="hover:bg-primary/5 transition-colors">
<td class="p-4 brutal-border-r">
<div class="w-16 h-16 brutal-border grayscale-hover">
<img alt="Streetwear hoodie product photo" class="w-full h-full object-cover" data-alt="Industrial techwear hoodie with buckle details" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsET9gK39Me0HnsxSS6JAtnSLDdNDPEViLWei0MRA8uOCV_wwFVbVQTRokqscyiOyqQjrUdCGs44Z-drajljpE4_lcZILk6sndK3hPGDcU4-FO1H4dtEw00ZP0BQrT1fEdJCX45-YPmUF1-YvLdII4JVAZkSdVEaVQ0KvqLlnrCfv0h1wPm850J_PGsKANX8sAXQ9kGan_iCT-8E9RCRPQbLRNX_Jsej3rYrVkifGYww-QF7D7RKFuH0bi2KpLIFf9bhYLvtw24IQ"/>
</div>
</td>
<td class="p-4 brutal-border-r">
<div class="font-bold uppercase">"CARGO" Tech Hoodie</div>
<div class="text-xs text-muted mt-1">Fleece-lined / Ripstop Accents</div>
</td>
<td class="p-4 brutal-border-r text-sm">HOD-CRG-009</td>
<td class="p-4 brutal-border-r">
<div class="flex gap-1">
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[M]</span>
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[L]</span>
</div>
</td>
<td class="p-4 brutal-border-r font-bold">₹4,999</td>
<td class="p-4 brutal-border-r">
<div class="flex items-center gap-2">
<div class="w-full bg-background-light h-2 brutal-border">
<div class="bg-accent h-full" style="width: 12%;"></div>
</div>
<span class="text-xs font-bold text-accent">14</span>
</div>
</td>
<td class="p-4">
<span class="bg-white text-black px-3 py-1 font-bold text-xs brutal-border border-dashed uppercase tracking-tighter">Draft</span>
</td>
</tr>
<tr class="hover:bg-primary/5 transition-colors">
<td class="p-4 brutal-border-r">
<div class="w-16 h-16 brutal-border grayscale-hover">
<img alt="Streetwear tote bag product photo" class="w-full h-full object-cover" data-alt="Canvas tote bag with bold black typography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWgyOuYZbm4Je9TuMcQn4KJdTMnCQfVvKKyzCxb_U3qDAEQIfKvtJMm10DxXpM5NkT_c6jqha0SqbTvLZQ8tvl5ht8XKIrFEAqyA_hG9OlzfVnUnLNHBzAyTuLhKuQ_cxlawCf1n71tqD__RnvCye_bfr_MYeZo8ERt8iU0TmtchE_KArSUE1Ru0lAIwzuioL-kJDN-yZX4wa5H5sP5MidUhj_rxrmzQRL4WABtUeAkCqpoOi_4lFFwnQeRWjXQ3K3Zru_4ZC1VqY"/>
</div>
</td>
<td class="p-4 brutal-border-r">
<div class="font-bold uppercase">"MANIFESTO" Tote</div>
<div class="text-xs text-muted mt-1">Heavy Canvas / 15L Capacity</div>
</td>
<td class="p-4 brutal-border-r text-sm">ACC-TOT-022</td>
<td class="p-4 brutal-border-r">
<div class="flex gap-1">
<span class="px-2 py-0.5 bg-primary text-[10px] font-bold brutal-border">[OS]</span>
</div>
</td>
<td class="p-4 brutal-border-r font-bold">₹1,299</td>
<td class="p-4 brutal-border-r">
<div class="flex items-center gap-2">
<div class="w-full bg-background-light h-2 brutal-border">
<div class="bg-black h-full" style="width: 88%;"></div>
</div>
<span class="text-xs font-bold">290</span>
</div>
</td>
<td class="p-4">
<span class="bg-primary text-black px-3 py-1 font-bold text-xs brutal-border uppercase tracking-tighter">Live</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</main>
<!-- Slide-over Add Product Panel (Triggered state) -->
<div class="fixed inset-0 z-50 pointer-events-none">
<!-- Overlay background -->
<div class="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"></div>
<!-- Panel Content -->
<div class="absolute right-0 top-0 h-full w-[600px] bg-white brutal-border-l border-black pointer-events-auto flex flex-col shadow-[-10px_0px_0px_#000]">
<div class="p-8 brutal-border-b flex justify-between items-center bg-primary">
<h3 class="font-display font-extrabold text-3xl uppercase tracking-tight">Add New Product</h3>
<button class="p-2 hover:bg-black hover:text-white transition-colors brutal-border bg-white">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Product Title*</label>
<input class="w-full p-4 brutal-border font-mono uppercase focus:bg-primary/5" placeholder="E.G. 'RAW' DENIM JACKET" type="text"/>
</div>
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Category</label>
<select class="w-full p-4 brutal-border font-mono uppercase focus:bg-primary/5 appearance-none">
<option>Tees</option>
<option>Outerwear</option>
<option>Bottoms</option>
<option>Accessories</option>
</select>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Base Price (INR)</label>
<input class="w-full p-4 brutal-border font-mono" placeholder="2999" type="text"/>
</div>
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Retail Price (INR)</label>
<input class="w-full p-4 brutal-border font-mono" placeholder="4499" type="text"/>
</div>
</div>
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Product Description</label>
<textarea class="w-full p-4 brutal-border font-mono uppercase" placeholder="DESCRIBE THE PRODUCT IN RAW TERMS..." rows="4"></textarea>
</div>
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Media Upload</label>
<div class="brutal-border border-dashed p-12 flex flex-col items-center gap-4 bg-background-light hover:bg-white transition-colors cursor-pointer group">
<span class="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">cloud_upload</span>
<p class="font-display font-bold text-xs uppercase text-center">Drag and drop high-res shots<br/>or click to browse</p>
</div>
</div>
<div class="flex flex-col gap-2">
<label class="font-display font-bold uppercase text-sm tracking-widest">Variant Selection</label>
<div class="flex flex-wrap gap-2">
<button class="px-4 py-2 brutal-border font-bold text-xs bg-primary">S</button>
<button class="px-4 py-2 brutal-border font-bold text-xs bg-primary">M</button>
<button class="px-4 py-2 brutal-border font-bold text-xs bg-primary">L</button>
<button class="px-4 py-2 brutal-border font-bold text-xs bg-primary">XL</button>
<button class="px-4 py-2 brutal-border font-bold text-xs bg-white text-muted">XXL</button>
</div>
</div>
</div>
<div class="p-8 brutal-border-t bg-black flex gap-4">
<button class="flex-1 bg-primary text-black py-4 font-display font-bold uppercase brutal-border brutal-shadow hover-brutal">
                        Publish Product
                    </button>
<button class="flex-1 bg-white text-black py-4 font-display font-bold uppercase brutal-border hover:bg-accent hover:text-white transition-all">
                        Save as Draft
                    </button>
</div>
</div>
</div>
</div>
</body></html>
import type { Product } from '@/types'

export const products: Product[] = [
  // Power Tools
  { id: 'p-drl-20v', sku: 'PWR-DRL-20V', name: '20V Cordless Drill/Driver Kit', brand: 'Voltek', category: 'Power Tools', vendorId: 'v-voltek', unitCost: 62, unitPrice: 119, leadTimeDays: 7, packLabel: 'each' },
  { id: 'p-imp-20v', sku: 'PWR-IMP-20V', name: '20V Cordless Impact Driver', brand: 'Voltek', category: 'Power Tools', vendorId: 'v-voltek', unitCost: 54, unitPrice: 99, leadTimeDays: 7, packLabel: 'each' },
  { id: 'p-csw-725', sku: 'PWR-CSW-725', name: '7-1/4" Circular Saw', brand: 'TradeForce', category: 'Power Tools', vendorId: 'v-voltek', unitCost: 48, unitPrice: 89, leadTimeDays: 7, packLabel: 'each' },
  { id: 'p-bat-50a', sku: 'PWR-BAT-50A', name: '20V Battery Pack 5.0Ah', brand: 'Voltek', category: 'Power Tools', vendorId: 'v-voltek', unitCost: 29, unitPrice: 59, leadTimeDays: 7, packLabel: 'each' },
  { id: 'p-rcp-100', sku: 'PWR-RCP-100', name: 'Cordless Reciprocating Saw', brand: 'TradeForce', category: 'Power Tools', vendorId: 'v-voltek', unitCost: 51, unitPrice: 95, leadTimeDays: 7, packLabel: 'each' },
  { id: 'p-grn-20v', sku: 'PWR-GRN-20V', name: '20V Cordless Angle Grinder', brand: 'Voltek', category: 'Power Tools', vendorId: 'v-voltek', unitCost: 46, unitPrice: 84, leadTimeDays: 7, packLabel: 'each' },

  // Hand Tools
  { id: 'h-hmr-16', sku: 'HND-HMR-16', name: '16oz Steel Claw Hammer', brand: 'IronClad', category: 'Hand Tools', vendorId: 'v-ironclad', unitCost: 9, unitPrice: 19, leadTimeDays: 5, packLabel: 'each' },
  { id: 'h-wrn-08', sku: 'HND-WRN-08', name: '8" Adjustable Wrench', brand: 'IronClad', category: 'Hand Tools', vendorId: 'v-ironclad', unitCost: 7, unitPrice: 15, leadTimeDays: 5, packLabel: 'each' },
  { id: 'h-sck-40', sku: 'HND-SCK-40', name: '3/8" Drive Socket Set, 40pc', brand: 'ProGrade', category: 'Hand Tools', vendorId: 'v-ironclad', unitCost: 34, unitPrice: 69, leadTimeDays: 5, packLabel: 'set' },
  { id: 'h-tpm-25', sku: 'HND-TPM-25', name: '25ft Tape Measure', brand: 'IronClad', category: 'Hand Tools', vendorId: 'v-ironclad', unitCost: 6, unitPrice: 14, leadTimeDays: 5, packLabel: 'each' },
  { id: 'h-plr-nn', sku: 'HND-PLR-NN', name: 'Needle Nose Pliers 8"', brand: 'ProGrade', category: 'Hand Tools', vendorId: 'v-ironclad', unitCost: 8, unitPrice: 17, leadTimeDays: 5, packLabel: 'each' },

  // Electrical
  { id: 'e-wir-122', sku: 'ELE-WIR-122', name: '12/2 Romex Wire, 250ft', brand: 'Sturdy', category: 'Electrical', vendorId: 'v-sturdy', unitCost: 89, unitPrice: 159, leadTimeDays: 9, packLabel: 'roll' },
  { id: 'e-ext-50', sku: 'ELE-EXT-50', name: 'Outdoor Extension Cord, 50ft', brand: 'Sturdy', category: 'Electrical', vendorId: 'v-sturdy', unitCost: 18, unitPrice: 36, leadTimeDays: 9, packLabel: 'each' },
  { id: 'e-gfc-20', sku: 'ELE-GFC-20', name: 'GFCI Outlet 20A', brand: 'Sturdy', category: 'Electrical', vendorId: 'v-sturdy', unitCost: 11, unitPrice: 24, leadTimeDays: 9, packLabel: 'each' },
  { id: 'e-wnt-100', sku: 'ELE-WNT-100', name: 'Wire Nuts, 100pk', brand: 'Sturdy', category: 'Electrical', vendorId: 'v-sturdy', unitCost: 7, unitPrice: 15, leadTimeDays: 9, packLabel: 'pack' },
  { id: 'e-led-4ft', sku: 'ELE-LED-4FT', name: 'LED Shop Light 4ft', brand: 'BrightMax', category: 'Electrical', vendorId: 'v-sturdy', unitCost: 22, unitPrice: 44, leadTimeDays: 9, packLabel: 'each' },

  // Plumbing
  { id: 'l-pvc-asst', sku: 'PLM-PVC-ASST', name: '1/2" PVC Fitting Assortment', brand: 'FlowMaster', category: 'Plumbing', vendorId: 'v-flowmaster', unitCost: 14, unitPrice: 29, leadTimeDays: 12, packLabel: 'kit' },
  { id: 'l-pex-100', sku: 'PLM-PEX-100', name: 'PEX Pipe 1/2", 100ft', brand: 'FlowMaster', category: 'Plumbing', vendorId: 'v-flowmaster', unitCost: 38, unitPrice: 74, leadTimeDays: 12, packLabel: 'roll' },
  { id: 'l-blv-34', sku: 'PLM-BLV-34', name: 'Ball Valve 3/4"', brand: 'FlowMaster', category: 'Plumbing', vendorId: 'v-flowmaster', unitCost: 9, unitPrice: 19, leadTimeDays: 12, packLabel: 'each' },
  { id: 'l-trk-01', sku: 'PLM-TRK-01', name: 'Toilet Repair Kit', brand: 'FlowMaster', category: 'Plumbing', vendorId: 'v-flowmaster', unitCost: 12, unitPrice: 25, leadTimeDays: 12, packLabel: 'kit' },
  { id: 'l-drs-25', sku: 'PLM-DRS-25', name: 'Drain Snake 25ft', brand: 'FlowMaster', category: 'Plumbing', vendorId: 'v-flowmaster', unitCost: 16, unitPrice: 32, leadTimeDays: 12, packLabel: 'each' },

  // Lawn & Garden
  { id: 'g-bld-42', sku: 'LWN-BLD-42', name: '42" Riding Mower Blade', brand: 'GreenScape', category: 'Lawn & Garden', vendorId: 'v-greenscape', unitCost: 19, unitPrice: 39, leadTimeDays: 10, packLabel: 'each' },
  { id: 'g-frt-5k', sku: 'LWN-FRT-5K', name: 'Lawn Fertilizer, 5,000 sq ft', brand: 'GreenScape', category: 'Lawn & Garden', vendorId: 'v-greenscape', unitCost: 21, unitPrice: 42, leadTimeDays: 10, packLabel: 'bag' },
  { id: 'g-hse-75', sku: 'LWN-HSE-75', name: 'Garden Hose 75ft', brand: 'GreenScape', category: 'Lawn & Garden', vendorId: 'v-greenscape', unitCost: 24, unitPrice: 46, leadTimeDays: 10, packLabel: 'each' },
  { id: 'g-sed-10', sku: 'LWN-SED-10', name: 'Grass Seed, 10lb', brand: 'GreenScape', category: 'Lawn & Garden', vendorId: 'v-greenscape', unitCost: 27, unitPrice: 52, leadTimeDays: 10, packLabel: 'bag' },
  { id: 'g-blw-20v', sku: 'LWN-BLW-20V', name: '20V Cordless Leaf Blower', brand: 'GreenScape', category: 'Lawn & Garden', vendorId: 'v-greenscape', unitCost: 44, unitPrice: 89, leadTimeDays: 10, packLabel: 'each' },

  // Paint
  { id: 'a-ltx-wht', sku: 'PNT-LTX-WHT', name: 'Interior Latex Paint 1gal, White', brand: 'ColorCraft', category: 'Paint', vendorId: 'v-colorcraft', unitCost: 17, unitPrice: 34, leadTimeDays: 6, packLabel: 'gal' },
  { id: 'a-ext-gry', sku: 'PNT-EXT-GRY', name: 'Exterior Paint 1gal, Gray', brand: 'ColorCraft', category: 'Paint', vendorId: 'v-colorcraft', unitCost: 22, unitPrice: 44, leadTimeDays: 6, packLabel: 'gal' },
  { id: 'a-brs-3', sku: 'PNT-BRS-3', name: '3" Angled Brush', brand: 'ColorCraft', category: 'Paint', vendorId: 'v-colorcraft', unitCost: 4, unitPrice: 9, leadTimeDays: 6, packLabel: 'each' },
  { id: 'a-tap-15', sku: 'PNT-TAP-15', name: "Painter's Tape 1.5\"", brand: 'ColorCraft', category: 'Paint', vendorId: 'v-colorcraft', unitCost: 3, unitPrice: 7, leadTimeDays: 6, packLabel: 'roll' },
  { id: 'a-rlr-9', sku: 'PNT-RLR-9', name: 'Roller Kit 9"', brand: 'ColorCraft', category: 'Paint', vendorId: 'v-colorcraft', unitCost: 6, unitPrice: 13, leadTimeDays: 6, packLabel: 'kit' },

  // Fasteners
  { id: 'f-dck-3', sku: 'FST-DCK-3', name: 'Deck Screws 3", 5lb box', brand: 'BuildRight', category: 'Fasteners', vendorId: 'v-buildright', unitCost: 16, unitPrice: 31, leadTimeDays: 8, packLabel: 'box' },
  { id: 'f-dry-158', sku: 'FST-DRY-158', name: 'Drywall Screws 1-5/8", 5lb', brand: 'BuildRight', category: 'Fasteners', vendorId: 'v-buildright', unitCost: 13, unitPrice: 26, leadTimeDays: 8, packLabel: 'box' },
  { id: 'f-cnc-14', sku: 'FST-CNC-14', name: 'Concrete Anchors 1/4", 50pk', brand: 'BuildRight', category: 'Fasteners', vendorId: 'v-buildright', unitCost: 11, unitPrice: 23, leadTimeDays: 8, packLabel: 'pack' },
  { id: 'f-wsc-asst', sku: 'FST-WSC-ASST', name: 'Wood Screw Assortment Kit', brand: 'BuildRight', category: 'Fasteners', vendorId: 'v-buildright', unitCost: 9, unitPrice: 19, leadTimeDays: 8, packLabel: 'kit' },

  // Seasonal
  { id: 's-shv-stl', sku: 'SEA-SHV-STL', name: 'Steel Snow Shovel', brand: 'WinterGuard', category: 'Seasonal', vendorId: 'v-winterguard', unitCost: 14, unitPrice: 29, leadTimeDays: 14, packLabel: 'each' },
  { id: 's-ice-20', sku: 'SEA-ICE-20', name: 'Ice Melt, 20lb', brand: 'WinterGuard', category: 'Seasonal', vendorId: 'v-winterguard', unitCost: 8, unitPrice: 17, leadTimeDays: 14, packLabel: 'bag' },
  { id: 's-rrk-01', sku: 'SEA-RRK-01', name: 'Roof Rake', brand: 'WinterGuard', category: 'Seasonal', vendorId: 'v-winterguard', unitCost: 21, unitPrice: 42, leadTimeDays: 14, packLabel: 'each' },

  // Building Materials
  { id: 'b-std-248', sku: 'BLD-STD-248', name: '2x4x8 Stud', brand: 'BuildRight', category: 'Building Materials', vendorId: 'v-buildright', unitCost: 4, unitPrice: 7, leadTimeDays: 8, packLabel: 'each' },
  { id: 'b-ply-12', sku: 'BLD-PLY-12', name: '1/2" Plywood 4x8', brand: 'BuildRight', category: 'Building Materials', vendorId: 'v-buildright', unitCost: 32, unitPrice: 54, leadTimeDays: 8, packLabel: 'sheet' },
  { id: 'b-cnc-60', sku: 'BLD-CNC-60', name: 'Concrete Mix, 60lb', brand: 'BuildRight', category: 'Building Materials', vendorId: 'v-buildright', unitCost: 5, unitPrice: 10, leadTimeDays: 8, packLabel: 'bag' },
  { id: 'b-rbr-12', sku: 'BLD-RBR-12', name: 'Rebar 1/2", 10ft', brand: 'BuildRight', category: 'Building Materials', vendorId: 'v-buildright', unitCost: 7, unitPrice: 13, leadTimeDays: 8, packLabel: 'each' },
]

export const productById = (id: string) => products.find((p) => p.id === id)

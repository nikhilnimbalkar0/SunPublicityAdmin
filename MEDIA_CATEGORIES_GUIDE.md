# 📸 Media Library with Categories - Complete Guide

## Overview
Your Media page now includes **6 specialized hoarding categories** with filtering, search, and organized display!

---

## 🎯 Categories

### 1. **Downtown Billboard** 🏢
- **Icon:** Building2
- **Color:** Blue
- **Use For:** Urban center advertising, downtown locations
- **Category ID:** `downtown`

### 2. **Highway Display** 🛣️
- **Icon:** Highway
- **Color:** Green
- **Use For:** Highway billboards, roadside advertising
- **Category ID:** `highway`

### 3. **Shopping Mall Board** 🛍️
- **Icon:** ShoppingBag
- **Color:** Purple
- **Use For:** Mall advertising, retail locations
- **Category ID:** `shopping`

### 4. **Event Promotion** 📅
- **Icon:** Calendar
- **Color:** Yellow
- **Use For:** Event-specific advertising, temporary campaigns
- **Category ID:** `event`

### 5. **City Center LED** ⚡
- **Icon:** Zap
- **Color:** Red
- **Use For:** Digital LED displays, city center screens
- **Category ID:** `citycenter`

### 6. **Corporate Ad Space** 💼
- **Icon:** Briefcase
- **Color:** Indigo
- **Use For:** Corporate buildings, business districts
- **Category ID:** `corporate`

---

## ✨ Features

### **Category Tabs**
- Horizontal scrollable tabs
- Icon + Name + Count badge
- Active tab highlighting
- Color-coded by category
- Responsive design

### **Filtering**
- Filter by category (click tabs)
- Search within category
- Combined search + filter
- Real-time results

### **Stats Dashboard**
- Category Images count
- Total categories (6)
- Storage usage
- Active category name

### **Image Cards**
- Category badge on each image
- Hover effects
- Download/view options
- Upload date display

---

## 🎮 How to Use

### **View All Media**
1. Go to `/admin/media`
2. Click **"All Media"** tab (default)
3. See all images from all categories

### **Filter by Category**
1. Click any category tab:
   - Downtown Billboard
   - Highway Display
   - Shopping Mall Board
   - Event Promotion
   - City Center LED
   - Corporate Ad Space
2. View only images from that category
3. Count badge shows number of images

### **Search Within Category**
1. Select a category tab
2. Type in search box
3. Results filtered by both category AND search term

### **Upload Images**
1. Click **"Upload Image"** button
2. Select image file (max 5MB)
3. Image uploaded to Firebase Storage
4. Appears in media library

---

## 💾 Data Structure

### Firestore Collection: `hoardings`
```javascript
{
  id: "hoarding-123",
  title: "Downtown Main Street",
  imageUrl: "https://...",
  category: "downtown", // Category ID
  location: "Main Street",
  size: "40x20 ft",
  price: 50000,
  available: true,
  createdAt: Timestamp
}
```

### Category Values:
- `downtown` - Downtown Billboard
- `highway` - Highway Display
- `shopping` - Shopping Mall Board
- `event` - Event Promotion
- `citycenter` - City Center LED
- `corporate` - Corporate Ad Space
- `all` - All categories (default)

---

## 🎨 UI Components

### Category Tab (Active):
```
[Icon] Category Name [Count]
- Blue border bottom
- Colored background
- Colored text
- Colored badge
```

### Category Tab (Inactive):
```
[Icon] Category Name [Count]
- No border
- Gray background on hover
- Gray text
- Gray badge
```

### Image Card:
```
┌─────────────────┐
│   [Image]       │
│   Hover: View   │
├─────────────────┤
│ Title  [Badge]  │
│ Date            │
└─────────────────┘
```

---

## 📊 Stats Explained

### **Category Images**
- Shows count of images in active category
- Changes when you switch tabs
- "Total Images" when "All Media" selected

### **All Categories**
- Always shows 6 (total categories)
- Fixed number

### **Storage Used**
- Estimated storage (0.5MB per image)
- Based on total images

### **Active Category**
- Shows currently selected category name
- Updates when you switch tabs

---

## 🔧 How to Assign Categories

### When Adding Hoarding (ManageHoardings page):
1. Go to `/admin/hoardings`
2. Click "Add Hoarding"
3. Fill in details
4. **Select Category** from dropdown:
   - Downtown Billboard
   - Highway Display
   - Shopping Mall Board
   - Event Promotion
   - City Center LED
   - Corporate Ad Space
5. Upload image
6. Save

### Category Auto-Assignment:
- Images inherit category from hoarding
- If no category set, defaults to "all"
- Can be updated by editing hoarding

---

## 🎯 Use Cases

### Example 1: View All Highway Billboards
```
1. Go to /admin/media
2. Click "Highway Display" tab
3. See all highway billboard images
4. Count badge shows total (e.g., "12")
```

### Example 2: Search Downtown Locations
```
1. Click "Downtown Billboard" tab
2. Type "Main Street" in search
3. See only downtown images matching "Main Street"
```

### Example 3: Check Event Promotions
```
1. Click "Event Promotion" tab
2. View all event-specific advertising
3. Stats show event promotion count
```

### Example 4: Browse All Categories
```
1. Click each category tab
2. See image count in badge
3. Compare inventory across categories
```

---

## 🎨 Color Scheme

| Category | Color | Hex | Usage |
|----------|-------|-----|-------|
| All Media | Gray | #6B7280 | Default/neutral |
| Downtown | Blue | #2563EB | Urban/professional |
| Highway | Green | #16A34A | Outdoor/travel |
| Shopping | Purple | #9333EA | Retail/lifestyle |
| Event | Yellow | #EAB308 | Attention/temporary |
| City Center | Red | #DC2626 | High-impact/digital |
| Corporate | Indigo | #4F46E5 | Business/formal |

---

## 📱 Responsive Design

### Desktop (lg+):
- All tabs visible
- 4 columns image grid
- Full category names

### Tablet (md):
- Scrollable tabs
- 3 columns image grid
- Full category names

### Mobile (sm):
- Scrollable tabs
- 2 columns image grid
- Abbreviated badges

---

## 🔍 Search & Filter Logic

### Search Only:
```javascript
// Searches across all categories
searchTerm: "Main Street"
Result: All images with "Main Street" in title
```

### Category Only:
```javascript
// Shows all images in category
activeCategory: "downtown"
Result: All downtown billboard images
```

### Search + Category:
```javascript
// Combined filtering
searchTerm: "LED"
activeCategory: "citycenter"
Result: City Center LED images with "LED" in title
```

---

## 💡 Tips & Best Practices

### Organizing Media:
1. **Assign categories when adding hoardings**
2. **Use consistent naming** (e.g., "Downtown - Main St")
3. **Upload high-quality images** (recommended 1920x1080)
4. **Keep categories balanced** (distribute inventory)

### Category Selection:
- **Downtown:** City center, business districts
- **Highway:** Major roads, expressways
- **Shopping:** Malls, retail complexes
- **Event:** Concerts, festivals, temporary
- **City Center:** LED screens, digital displays
- **Corporate:** Office buildings, business parks

### Search Tips:
- Use location names
- Use size specifications
- Use client names
- Use campaign names

---

## 🚀 Quick Actions

### View Category Count:
```
Look at badge next to category name
Example: "Downtown Billboard [12]"
```

### Switch Categories:
```
Click any tab → Instant filter
```

### Clear Filter:
```
Click "All Media" tab
```

### Search All:
```
1. Select "All Media"
2. Type search term
3. Searches across all categories
```

---

## 📊 Example Data

### Sample Hoarding with Category:
```javascript
{
  title: "Highway Billboard - Exit 5",
  location: "Highway 101, Exit 5",
  category: "highway",
  imageUrl: "https://...",
  size: "48x14 ft",
  price: 75000
}
```

### How It Appears:
- **In Media Library:** Shows under "Highway Display" tab
- **Image Card:** Badge shows "Highway"
- **Search:** Searchable by title
- **Filter:** Appears when "Highway Display" selected

---

## ✅ Summary

| Feature | Status |
|---------|--------|
| 6 Categories | ✅ |
| Category Tabs | ✅ |
| Filtering | ✅ |
| Search | ✅ |
| Combined Filter + Search | ✅ |
| Count Badges | ✅ |
| Color Coding | ✅ |
| Responsive Design | ✅ |
| Category Icons | ✅ |
| Stats Dashboard | ✅ |

---

## 🎉 You're Ready!

Your Media Library now has:
- ✅ 6 specialized categories
- ✅ Easy filtering with tabs
- ✅ Search within categories
- ✅ Visual category badges
- ✅ Real-time count updates
- ✅ Responsive design

**Start organizing:** Go to `/admin/media` and explore your categories! 🚀

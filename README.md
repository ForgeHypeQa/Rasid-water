# Rasid — water delivery app

Prepaid 5-gallon water delivery platform: one sign-in, three apps, one shared data set.

- **Customer app** — Qatar blue-plate address (building, street, zone), coupon balance, next delivery with live "on the way" status, reschedule and hold, top-up (card / Apple Pay / cash to driver), history (calendar, weekly, monthly), support tickets with replies, English and Arabic (RTL).
- **Driver app** — today's route on a live map (real Doha tiles, road-following route, numbered stops, moving driver marker with distance and ETA), reorder and optimise, stop screen with call / WhatsApp / navigate, photo proof, confirm or "no response", 30-minute undo, day summary.
- **Admin panel** — overview, customers, drivers, routes (generate per day, reassign), support, reports with CSV export, settings for white-labelling (company name, accent colour, coupon packs, zones, thresholds), audit log, and a live preview of the driver and customer apps.

## Get the app

- **Android:** download `Rasid-Water.apk` from the [latest release](https://github.com/ForgeHypeQa/Rasid-water/releases/latest) and open it on the phone (allow "Install unknown apps" when asked).
- **iPhone:** open [forgehypeqa.github.io/Rasid-water](https://forgehypeqa.github.io/Rasid-water/) in Safari → Share → Add to Home Screen.
- **Android, no APK:** open the same link in Chrome → menu → Install app.

The APK is built automatically by GitHub Actions (`.github/workflows/android.yml`, Capacitor 6) on every change to the app. It is a debug-signed build for demos; for the Play Store, add a release keystore and build `assembleRelease` / `bundleRelease`.

## Run the demo

Open `index.html` in a browser, or host it on any static host (Netlify, Vercel, GitHub Pages). No build step, no server.

**Demo accounts — password `0000` for all**

| Role | Email |
| --- | --- |
| Admin | admin@forgehype.qa |
| Support | support@forgehype.qa |
| Driver, Van 1 | driver1@forgehype.qa |
| Driver, Van 2 | driver2@forgehype.qa |
| Customers | khalid@demo.qa, noora@demo.qa, hamad@demo.qa, maryam@demo.qa, ahmed@demo.qa |

Sample data (42 customers across 7 Doha zones, 16 weeks of history, routes for every weekday) is generated for the day the demo is opened and kept in the browser's local storage. Use **Reset data** on the sign-in screen or in Settings to start fresh.

## Live map

The map uses Leaflet with Esri light/dark gray basemap tiles (OpenStreetMap fallback) and road geometry from the public OSRM server. The driver app asks for the phone's location when the route opens and shows the real position with an accuracy circle; the locate button on the map retries or recenters. If location is blocked, the marker is simulated (it travels toward the next stop). Live location can be switched off in the Me tab. Customers see the same driver marker on their "Arriving today" card, and the admin overview shows every driver and stop on one map.

## Structure

```
index.html      the whole app, built from src/
src/
  01-head.html  styles (iOS-style light/dark theme, components)
  02-core.js    utilities, icons, state, seeded demo data, business actions (ACT), auth, shell
  02b-map.js    Leaflet maps, road routing, driver position simulation / GPS
  03-customer.js
  04-driver.js
  05-admin.js
  06-tail.html  boot
vendor/         Leaflet 1.9.4 (inlined by the build)
build.sh        concatenates src/ and vendor/ into index.html
```

All data changes go through the `ACT` object in `02-core.js` (confirm, miss, undo, order, topup, adjust, generate, ticket, reply). Replacing those functions with Supabase calls connects the same screens to the live database.

Built by ForgeHype.

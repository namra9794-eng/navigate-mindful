# SafeRoute Navigator

Build a modern, responsive web application called SafeRoute with the tagline “Navigate smarter. Travel safer.”

The project is for an 8-hour hackathon under the theme “Tech for a Better Tomorrow.”

CORE IDEA

SafeRoute is a safety-focused route planning web application. It should help users understand safety-related information around their journey instead of focusing only on distance or travel time.

IMPORTANT:
Do not claim that the application can guarantee that a route is objectively safe. Safety information should be presented as an indicator based on available reports and safety-related factors.

DESIGN

Create a polished, modern, professional UI suitable for a hackathon demo.

Use:

clean typography

modern cards

rounded corners

subtle shadows

responsive layout

accessible contrast

smooth hover effects

simple animations

mobile-first responsive design

The application should look like a real startup product rather than a basic student project.

PAGES / SECTIONS

1. LANDING PAGE

Hero section:

SafeRoute

“Navigate smarter. Travel safer.”

Description:
“Plan your journey with safety insights, community reports and emergency assistance.”

Buttons:

Plan a Route

Explore Safety Map

Include a visual map-style illustration/card.

Add feature cards:

Safety-aware routing

Community reports

Emergency assistance

Real-time safety insights

Add a short section:
“Why SafeRoute?”

Explain that conventional navigation focuses mainly on distance and travel time, while SafeRoute adds safety-related context.

2. ROUTE PLANNER

Create a route planning interface with:

Start Location input
Destination input
“Find Safe Route” button

After route calculation, show:

Estimated travel time

Distance

Safety Score

Safety level

Safety factors

Display route alternatives:

Route A

Shortest

Estimated time

Safety score

Route B

Balanced

Estimated time

Safety score

Route C

Safety-focused

Estimated time

Safety score

Do not make unsupported real-world safety claims.

3. INTERACTIVE MAP

Use a map component.

Prefer Leaflet with OpenStreetMap if possible.

Show:

Current/start location

Destination

Route

Safety report markers

Marker categories:

Poor lighting

Accident

Road issue

Unsafe/isolated area

Other

Create a clean map legend.

4. SAFETY REPORT

Create a “Report an Area” modal/form.

Fields:

Location
Category
Description
Severity
Optional image upload

Categories:

Poor lighting

Road hazard

Accident

Isolated area

Suspicious activity

Other

Buttons:
Submit Report
Cancel

After submission show a success message.

5. EMERGENCY MODE

Create a highly visible emergency button.

When clicked, open an emergency panel.

Include:

Emergency Help

Share My Location

Emergency Contacts

Call Emergency Services

Do not automatically contact anyone without user confirmation.

Create mock/demo emergency contacts for the prototype.

6. SAFETY DASHBOARD

Create a dashboard showing:

Total Reports
Active Alerts
Areas Needing Attention
Community Reports

Add simple charts/cards.

Show recent reports with:

location

category

time

severity

7. NAVIGATION

Desktop navigation:

SafeRoute logo
Home
Plan Route
Safety Map
Report
Dashboard
Emergency

Mobile navigation should be responsive.

DATA

For the hackathon prototype, create realistic demo data.

Example report locations can be fictional/demo locations.

Clearly distinguish demo data from real verified safety information.

FUNCTIONALITY

The prototype should actually work.

Implement:

page navigation

route search interaction

map interaction

report submission

safety score display

emergency modal

dashboard updates when a report is submitted

responsive mobile layout

If a real routing API is not available, create a realistic demo routing flow rather than leaving buttons non-functional.

SAFETY SCORE

Create a transparent demo scoring model based on factors such as:

Lighting
Recent reports
Road conditions
Reported incidents
Community activity

Show the factors behind the score instead of presenting the score as an absolute truth.

IMPORTANT HACKATHON REQUIREMENTS

The application must demonstrate:

Clear real-world problem

Innovative technology-driven solution

Functional prototype

Clean modern UI

Responsive design

Meaningful user flow

Proper use of technology

Real-world impact

Prioritize a polished working MVP over unnecessary features.

Generate all required frontend code and project structure.

Make the application ready for deployment.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://navigate-mindful.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c986f753-2cd2-4298-b6c0-d7d224daf243).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

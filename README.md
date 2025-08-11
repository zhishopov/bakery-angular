Restaurant Booking App

The Restaurant Booking App is a single-page Angular application for a restaurant.
It provides a public area where visitors can view the menu and product details, and a private area where registered users can book tables.
Admins can manage products and all bookings. The app communicates with a RESTful server provided by Software University.

Features
	•	Home Page: Welcome message and quick navigation to menu or booking.
	•	Menu Page (Catalog): Displays all products with a “Details” button to view full product descriptions.
	•	Product Details: Standalone page showing name, image, price, description, and likes count.
	•	Authentication: Users can register and log in.
	•	Book a Table: Authenticated users can create, update, and delete their table bookings (CRUD).
	•	My Bookings: View and manage all bookings made by the logged-in user.
	•	Admin Dashboard: Admins can view all bookings, create new products, and edit/delete existing products.
	•	Likes: Authenticated users can like products (one like per user).
	•	Responsive Design: UI adapts to desktop and mobile screens.
	•	Error Handling: Client-side validation, API error messages, and automatic logout on expired sessions.

Installation
Clone the repository:
git clone https://github.com/zhishopov/bakery-angular.git

Server Setup:
The server runs on http://localhost:3030

Navigate to the server folder: 
cd server

Start the server: 
node server.js

Install dependencies:
cd client 
npm install

Start the app:
cd client
ng serve

Admin Credentials Email: admin@abv.bg
Password: admin

How the App Works
	•	Navigation: Use the header links to move between Home, Menu, Login, Register, Book a Table, My Bookings, and Dashboard (for admins).
	•	Register/Login: Create an account or log in to unlock booking and liking features.
	•	Menu: Browse all products and click “Details” for more information.
	•	Book a Table: Fill out the booking form; edit or cancel from “My Bookings.”
	•	Admin Dashboard: Admins can manage products and see all customer bookings.

Technologies Used
	•	Angular
	•	TypeScript
	•	RxJS
	•	Angular Router
	•	Reactive Forms
	•	REST API (SoftUni practice server)
	•	CSS for responsive styling

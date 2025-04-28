# ☁️ Closet Cloud

**Closet Cloud** takes the guesswork out of getting dressed.  
Our app suggests daily outfit ideas based on your saved wardrobe and the weather forecast. 🌦️👕  

We built Closet Cloud because choosing outfits can feel overwhelming, especially when you have to factor in the weather. Our goal was to create a simple, helpful tool that makes mornings easier and outfits smarter.

---

## Logo

![Closet Cloud Logo](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/dev/PROPOSAL/cloudloset%20logo.png)  


---

## 🚀 Getting Started

Here's everything you need to check out **Closet Cloud**:

- **Deployed App:** [Closet Cloud Live Site](https://cloud-closet-front-end-production.up.railway.app/)
- **Planning Docs:** [Planning Documents](https://github.com/Matt-Gallery/cloud-closet-front-end/tree/dev/PROPOSAL)
- **Back-End Repository:** [Closet Cloud Back-End GitHub](https://github.com/btpintens/CC-back-end)
- **Front-End Repository:** [Front-End](https://github.com/Matt-Gallery/cloud-closet-front-end)

---

## 📖 Features (User Stories)

- Create, log into, and manage an account
- Build a personalized wardrobe with weather preferences
- View outfit recommendations based on live weather data
- Save, edit, or delete wardrobe items
- Cycle through outfit suggestions if you don't like the first option
- Save and edit rated outfits
- Delete account if desired

---

## 🛠️ Technologies Used

- React (Frontend)
- JavaScript 
- Vite
- Node.js (Backend)
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenWeatherMap API (for weather data)
- CSS (Custom styling)

---

## 🙌 Attributions

- [OpenWeatherMap API](https://openweathermap.org/api) — Real-time weather information
- [React Icons](https://react-icons.github.io/react-icons/) — Icon library
- [jwt-decode](https://www.npmjs.com/package/jwt-decode) — JWT decoding on the frontend



---

## 🧠 Future Enhancements (Stretch Goals)

- 📱 Full mobile responsiveness
- ⭐ Allow users to rate outfits and refine recommendations
- 🧥 Seasonal wardrobe categorization (winter, summer, etc.)
- 🛒 Wish/shopping list integration
- ✈️ Trip packing list generator
- 🧠 AI-based outfit suggestions
- 🎯 Specific occasion outfit filters (e.g., formal, casual, athletic)
- 🛍️ Cost-per-wear tracking for smarter shopping

---

## 🛤️ Development Planning

**Component Hierarchy Diagram:**  
![Component Diagram](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/dev/PROPOSAL/Component%20Hierarchy%20Diagram.png)

**Entity Relationship Diagram (ERD):**  
![ERD](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/dev/PROPOSAL/ERD.png)

**Routing Table:**  
![Routing Table](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/dev/PROPOSAL/Routing%20Table%202.png)

**Wireframes:**  
![WireFrame](https://github.com/Matt-Gallery/cloud-closet-front-end/blob/dev/PROPOSAL/Wireframes.png)

**Pseudocode Overview:**
- Frontend built with React Router
- Backend with Express and Mongoose for DB interactions
- Secure authentication using bcrypt and express-session
- RESTful API structure for wardrobe items, recommendations, and user management

---

# 🖥️ Closet Cloud Back-End

This is the server-side repository that powers Closet Cloud’s functionality and data management.

The backend is built using Node.js, Express, and MongoDB. It handles authentication, stores user wardrobes, fetches weather data, and delivers smart outfit recommendations.

---

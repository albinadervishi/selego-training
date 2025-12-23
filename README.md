# EventHub - Event Management Platform

A complete event management platform for creating, managing, and attending events.

## 🚀 Quick Start

1. **Fork this repository** to your GitHub account

2. **Clone your fork** locally

3. Follow the installation instructions below for API, App, and Admin

4. Configure your environment variables

5. Create a branch for each feature you build

6. Submit Pull Requests from your fork (see Git Workflow section below)

---

## 📦 Structure

The project is composed of 3 applications:

- **api/** - Node.js/Express backend with MongoDB
- **app/** - React frontend (user application for browsing and registering for events)
- **admin/** - React frontend (admin panel for managing events and users)

## 🎯 Features

### Core Features
- **Event Management**: Create, update, and delete events
- **User Authentication**: JWT-based auth with login/register/password reset
- **Event Discovery**: Search and filter events by category, city, and date
- **Event Registration**: Users can register for events (attendee management)
- **Admin Dashboard**: Manage all events and users

### Upcoming Features (Week 2-3)
- **Email Notifications**: Ticket confirmations via Brevo
- **Payment Integration**: Stripe for paid events
- **QR Code Check-in**: Event check-in system
- **Waitlist Management**: For sold-out events
- **Analytics Dashboard**: Event statistics and insights

---

## API Installation

1. Install the dependencies

   ```bash
   cd api
   npm install
   ```

2. Create your database on Clever Cloud

   - Create a MongoDB add-on
   - Retrieve the MongoDB connection URI from the add-on information

3. Create `.env` file in `/api`:

   ```env
   MONGO_URI=your-mongodb-uri
   SECRET=your-jwt-secret
   BREVO_KEY=your-brevo-api-key
   APP_URL=http://localhost:5173
   ADMIN_URL=http://localhost:3001
   ENVIRONMENT=development
   ```

4. Configure Sentry (optional)

   In `api/src/config.js`, add your Sentry DSN.

5. Seed the database with sample data (optional)

   ```bash
   npm run seed
   ```

   This creates test users, admin, and sample events:
   - **Users**: john@example.com, jane@example.com, bob@example.com (password: password123)
   - **Admin**: admin@example.com (password: admin123)

6. Start the server

   ```bash
   npm run dev
   ```

---

## APP Installation

1. Install the dependencies

   ```bash
   cd app
   npm install
   ```

2. Configure Sentry (optional)

   In `app/src/config.js`, add your Sentry DSN:

   ```javascript
   const SENTRY_URL = "YOUR_SENTRY_URL";
   ```

3. Start the server

   ```bash
   npm run dev
   ```

---

## Admin Installation

1. Install the dependencies

   ```bash
   cd admin
   npm install
   ```

2. Configure Sentry (optional)

   In `admin/src/config.js`, add your Sentry DSN.

3. Start the server

   ```bash
   npm run dev
   ```

---

## 🗂️ Data Models

### Event
- Core event information (title, description, dates, venue, location)
- Capacity management and available spots tracking
- Pricing and currency
- Status (draft, published, cancelled)
- Category (conference, workshop, seminar, networking, social, other)
- Organizer information (linked to User)
- Registration settings (deadline, requires approval)

### Attendee
- Event registration tracking
- User information (name, email)
- Registration status (pending, confirmed, cancelled, checked_in)
- Ticket information (unique ticket number, QR code)
- Payment tracking (free, pending, paid, refunded)
- Check-in timestamp

### User
- Authentication (email, password with bcrypt hashing)
- Profile (name, avatar)
- Role (user, client)
- Password reset tokens

### Admin
- Separate admin authentication
- Full management capabilities

---

## 📡 API Routes

### Events
- `POST /event/search` - Search published events (public)
- `GET /event/:id` - Get event details (public)
- `POST /event` - Create event (authenticated)
- `GET /event/my/events` - Get user's created events (authenticated)
- `PUT /event/:id` - Update event (organizer only)
- `DELETE /event/:id` - Delete event (organizer only)
- `POST /event/admin/search` - Search all events (admin)
- `PUT /event/admin/:id` - Update any event (admin)
- `DELETE /event/admin/:id` - Delete any event (admin)

### Attendees
- `POST /attendee/register` - Register for event (authenticated)
- `GET /attendee/my-registrations` - Get user's registrations (authenticated)
- `DELETE /attendee/:id` - Cancel registration (user)
- `POST /attendee/event/:event_id` - Get event attendees (organizer)
- `PUT /attendee/:id/status` - Update attendee status (organizer)
- `POST /attendee/admin/search` - Search all attendees (admin)

### Users
- `POST /user/signin` - User login
- `POST /user/signup` - User registration
- `POST /user/logout` - User logout
- `GET /user/signin_token` - Refresh token
- `POST /user/forgot_password` - Request password reset
- `POST /user/forgot_password_reset` - Reset password
- `POST /user/reset_password` - Change password
- `PUT /user` - Update user profile
- `POST /user/search` - Search users (admin)
- `GET /user/:id` - Get user (admin)
- `PUT /user/:id` - Update user (admin)
- `DELETE /user/:id` - Delete user (admin)

### Admins
- `POST /admin/signin` - Admin login
- `POST /admin/signup` - Create admin account
- `POST /admin/logout` - Admin logout
- Similar routes to users for admin management

### Files
- `POST /file/upload` - Upload file (authenticated)

---

## 📧 Brevo Configuration (Emails)

For email features to work (forgot password, invitations, etc.), you need to configure Brevo:

### 1. Create a Brevo account

Go to [Brevo](https://www.brevo.com/) and create an account.

### 2. Get the API key

- Go to **Settings** > **API Keys**
- Create a new API key
- Add it to your `.env` file: `BREVO_KEY=your-api-key`

### 3. Configure the sender

In `api/src/services/brevo.js`, update the constants:

```javascript
const SENDER_NAME = "Your App Name";
const SENDER_EMAIL = "noreply@yourdomain.com";
```

### 4. Create email templates

Create templates in Brevo (**Marketing** > **Templates** > **Create Template**):

| Template           | Usage            | Required variables      |
| ------------------ | ---------------- | ----------------------- |
| `FORGOT_PASSWORD`  | Password reset   | `cta` (reset link)      |
| `ADMIN_INVITATION` | Admin invitation | `cta` (invitation link) |

### 5. Configure template IDs

In `api/src/utils/constants.js`, add the created template IDs:

```javascript
const BREVO_TEMPLATES = {
  FORGOT_PASSWORD: 1, // Replace with your template ID
  ADMIN_INVITATION: 2, // Replace with your template ID
};

module.exports = { BREVO_TEMPLATES };
```

### Brevo template example

For the `FORGOT_PASSWORD` template, create an email with:

- A button or link using the variable `{{ params.cta }}`
- Example: `<a href="{{ params.cta }}">Reset my password</a>`

---

## 🔀 Git Workflow & Pull Requests

### Getting Started

1. **Fork this repository** to your own GitHub account
2. Clone your fork locally: `git clone <your-fork-url>`
3. Add the upstream remote: `git remote add upstream <original-repo-url>`

### Working on Features

Each Week 1 feature should be developed in its own branch and submitted as a **separate Pull Request**:

```bash
# Example: Building the Venue module
git checkout -b feature/venue-module
# ... make your changes ...
git add .
git commit -m "feat: add venue model, controller and frontend pages"
git push origin feature/venue-module
# Then create a PR from your fork
```

### PR Best Practices

**✅ DO:**
- **One PR per feature** - Each feature (Venue module, Google Calendar service, Cleanup script, etc.) should be a separate PR
- **Full-stack & working** - Your PR should include both backend (model + controller) and frontend (pages + API integration), fully functional
- **Small but complete** - Each PR should be focused on ONE feature, but that feature should work end-to-end
- **Self-contained** - Features are independent of each other, so you can work on them in any order
- **Clear commit messages** - Use conventional commits: `feat:`, `fix:`, `refactor:`, etc.
- **Test before submitting** - Make sure your feature works locally before creating the PR

**❌ DON'T:**
- Don't submit giant PRs with multiple features
- Don't submit incomplete features (backend without frontend)
- Don't submit PRs with broken code or linter errors
- Don't mix unrelated changes in one PR

### Example PRs for Week 1

Each of these should be a **separate PR**:

1. **PR #1**: `feat: add venue model and CRUD controller`
   - Backend: Venue model, controller with CRUD operations
   - Frontend: Venue list, create, and edit pages
   - Working end-to-end

2. **PR #2**: `feat: add google calendar service integration`
   - Backend: Google Calendar service file
   - Integration with Event creation
   - Working calendar export

3. **PR #3**: `feat: add cleanup bad events script`
   - Script to remove events with "not-good" in title
   - Package.json script entry
   - Tested and working

4. **PR #4**: `feat: add calendar webhook for sync`
   - Backend: Webhook endpoint
   - Proper webhook signature verification
   - Updates event status based on calendar changes

5. **PR #5**: `feat: add event reminders cron job`
   - Cron job to send reminders 24h before event
   - Email integration
   - Tested with sample events

### PR Title Format

Use clear, descriptive titles:
- ✅ `feat: add venue module with full CRUD and frontend`
- ✅ `feat: integrate google calendar export service`
- ✅ `feat: add stripe webhook for payment updates`
- ❌ `update code`
- ❌ `fixes`
- ❌ `week 1 stuff`

### Review Process

1. Submit your PR from your fork to the original repository
2. Trainer will review and provide feedback
3. Address feedback by pushing new commits to the same branch
4. Once approved, your PR will be merged

---

## 🎓 Training Structure

This project is designed for a 3-week training program on full-stack development.

### Week 1: Building the Events Module
**Branch**: `week1-starter` (coming soon)

Trainees will build the core Events functionality from scratch:
- Event model (schema definition)
- Event controller (CRUD operations)
- Event routes (REST API)
- Search and filtering logic
- Authentication and authorization
- Frontend pages for event listing and creation

**Skills Learned**: 
- MongoDB models and schemas
- Express routing and controllers
- Authentication with Passport.js
- REST API design
- React components and state management

### Week 2: Event Registration & Attendees
**Branch**: `week2-starter` (coming soon)

Trainees will implement the registration system:
- Attendee model and relationships
- Registration logic (capacity management, validation)
- Email notifications (Brevo integration)
- Ticket generation
- Organizer dashboard for attendee management

**Skills Learned**:
- Database relationships (refs and populate)
- Email services integration
- Complex business logic
- Error handling
- Admin/organizer permissions

### Week 3: Advanced Features
**Branch**: `week3-starter` (coming soon)

Trainees will add advanced features:
- Payment integration (Stripe)
- QR code generation and check-in system
- Waitlist management
- Event analytics dashboard
- Calendar export (iCal)
- Advanced filtering and search

**Skills Learned**:
- Third-party API integration (Stripe)
- File generation (QR codes, PDFs)
- Data visualization
- Complex queries and aggregations
- Performance optimization

### Main Branch
Contains the complete, production-ready codebase with all features implemented. This serves as:
- Reference implementation
- Solution for trainees
- Starting point for customization

---

Made while Debourax (who knows knows)

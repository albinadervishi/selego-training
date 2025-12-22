# Boilerplate

## 🚀 Quick Start

1. Create a new project on GitHub

2. Copy and paste the files from the Boilerplate into your project

3. Replace all `[boilerplate_name]` with your project's name

4. Replace index.html information with your project's information

---

## 📦 Structure

The project is composed of 3 applications:

- **api/** - Node.js/Express backend with MongoDB
- **app/** - React frontend (user application)
- **admin/** - React frontend (admin panel)

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

5. Start the server

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

Written with ❤️ by Léopold

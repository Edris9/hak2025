# Authentication - User Documentation

## Overview

This document describes the authentication features from a user's perspective.

---

## Registration

### How to Register

1. Navigate to the registration page (`/register`)
2. Fill in the required fields:
   - **Email**: Your email address
   - **Password**: Create a secure password
   - **First Name**: Your first name
   - **Last Name**: Your last name
3. Click the "Register" button
4. Upon success, you'll be redirected to the dashboard

### Password Requirements

Your password must:
- Be at least 8 characters long
- Contain at least one uppercase letter (A-Z)
- Contain at least one lowercase letter (a-z)
- Contain at least one number (0-9)

### Possible Errors

| Error Message               | Cause                          | Solution                      |
|-----------------------------|--------------------------------|-------------------------------|
| "Email already exists"      | Account with email exists      | Use a different email or login|
| "Invalid email format"      | Email format incorrect         | Check email spelling          |
| "Password too weak"         | Doesn't meet requirements      | Use a stronger password       |

---

## Login

### How to Login

1. Navigate to the login page (`/login`)
2. Enter your credentials:
   - **Email**: Your registered email
   - **Password**: Your password
3. Click the "Login" button
4. Upon success, you'll be redirected to the dashboard

### Possible Errors

| Error Message               | Cause                          | Solution                      |
|-----------------------------|--------------------------------|-------------------------------|
| "Invalid credentials"       | Wrong email or password        | Check your credentials        |
| "Account not found"         | Email not registered           | Register a new account        |
| "Too many attempts"         | Login rate limit exceeded      | Wait a few minutes            |

---

## Session Management

### Staying Logged In

- Your session remains active for 7 days
- The app automatically refreshes your session
- You don't need to log in again unless:
  - You manually log out
  - You clear your browser cookies
  - 7 days pass without activity

### Automatic Logout

You will be automatically logged out if:
- Your session expires (7 days of inactivity)
- There's a security issue detected
- You log in from another device (if single-session mode is enabled)

---

## Logout

### How to Logout

1. Click on your profile icon/menu
2. Select "Logout"
3. You'll be redirected to the login page

### What Happens on Logout

- Your session is immediately terminated
- You'll need to log in again to access protected features
- Any unsaved work may be lost

---

## Security Tips

1. **Use a strong password**: Combine letters, numbers, and symbols
2. **Don't share credentials**: Never share your password with anyone
3. **Log out on shared devices**: Always log out when using public computers
4. **Check the URL**: Ensure you're on the correct website before entering credentials

---

## Troubleshooting

### "Can't log in even with correct password"

1. Clear your browser cookies
2. Try a different browser
3. Reset your password if the issue persists

### "Session keeps expiring"

1. Check if cookies are enabled in your browser
2. Disable any ad blockers that might interfere
3. Try disabling browser extensions

### "Registration not working"

1. Ensure all fields are filled correctly
2. Try a different email if current one is taken
3. Check your internet connection

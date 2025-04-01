# 📒 VaultNote 🔐

A secure note-taking web application designed with a cloud-native, scalable architecture, offering robust security, real-time logging, and a clean user experience.

## 🚀 Live Demo
🔗 𝗧𝗿𝘆 𝗩𝗮𝘂𝗹𝘁𝗡𝗼𝘁𝗲 𝗵𝗲𝗿𝗲: http://vault-note.s3-website.ca-central-1.amazonaws.com/

## 🧠 Features:
### 👤 User Functionality:
• Sign up/Login via Email/Password or OAuth2.0 (Google, GitHub)
• Secure password reset via email
• Create, view, edit, delete, pin, and favorite notes
• Search and filter notes
• Update profile info (username, password, profile picture)
• Enable/Disable 2FA (Two-Factor Authentication)
• Contact form to submit queries or issues (emails sent to app owner)

### 🛡️ Admin Functionality:
• Manage all user accounts
• Update user status, password, and credential expiration
• Monitor user/app activity via real-time audit logs

## 🔐 Security & Architecture:
• JWT Authentication & Authorization
• Role-Based Access Control (User, Admin)
• OAuth 2.0 login integration
• 2FA using verification codes (email)
• Spring Security for endpoint protection
• Redis Cloud for caching verification codes and updates
• Kafka Cloud for audit log streaming
• JavaMailSender for account-related emails

## ☁️ Tech Stack & Deployment

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Backend     | Spring Boot (REST APIs)                   |
| Frontend    | React.js                                  |
| Database    | MySQL (AWS RDS)                           |
| Caching     | Redis Cloud                               |
| Messaging   | Kafka Cloud (Audit Logs)                  |
| Security    | Spring Security, JWT, OAuth2.0, 2FA       |
| Email       | JavaMailSender                            |
| Deployment  | AWS Elastic Beanstalk, S3, RDS            |


## 🔭 Future Scope
• 🔐 Add note-locking with passwords or secure codes
• 📎 Support for uploading documents and media files with notes

## 🤝 Feedback & Contributions
Please try out the application and feel free to open issues or suggestions!
I’d love to connect, collaborate, and hear your thoughts.

![ZILA CLI Cover](https://i.ibb.co/9mhWtLxN/image.png)

# 🚀 ZILA CLI: Zigex Dynamic Intelligent Learning Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)](https://nodejs.org/)

ZILA is a powerful, interactive Terminal Agent designed for the **Zigex** ecosystem. It empowers students, interns, and supervisors with AI-driven career guidance, real-time environment monitoring, and seamless profile management directly from the command line.

---

## ✨ Key Features

*   **🤖 Interactive AI Agent**: A stateful REPL environment (`zila start`) that monitors your development and provides contextual advice.
*   **🔍 Deep System Scan**: Advanced diagnostics that verify your development environment (Node.js, Python, Git) with smooth, professional animations.
*   **🔐 Secure Handshake**: OTP-based authentication system ensuring top-tier security for your Zigex account.
*   **📊 Profile & Roles**: Instantly view your internships, programs, events, and supervised students.
*   **🌑 Pro UI**: Built with `chalk`, `ora`, and `boxen` for a premium, dark-mode-optimized terminal experience.

---

## 🛠️ Installation

### Prerequisites
*   **Node.js** (v18+)
*   **Git**

### Step-by-Step Setup
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/iws3/zila-cli.git
    cd zila-cli
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Build the project**:
    ```bash
    npm run build
    ```

4.  **Link globally** (Optional - allows running `zila` anywhere):
    ```bash
    npm link
    ```

---

## 🚀 Usage Guide

### 1. Authentication
Request an OTP to your registered Zigex email:
```bash
zila auth
```

### 2. Launch the Agent
Start the interactive ZILA session:
```bash
zila start
```

### 3. Interactive Commands
Once inside the ZILA agent, try these:
*   `profile` - View your short profile.
*   `about-me` - Fetch your full detailed profile and skills.
*   `internship --info` - View your active internships.
*   `logout` - Securely clear your session and exit.

---

## 🤝 Contributing

ZILA is an open-source project! We welcome contributions that help improve the learning experience for students worldwide.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Built with ❤️ by the Zigex Team.**

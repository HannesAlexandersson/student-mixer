#  Student Mixer

A lightweight, fast single-page web app for splitting classes or teams into balanced groups—complete with a 3D blender animation powered by React Three Fiber.

Built to eliminate the friction of manual group assignments during workshops and study sessions: upload a roster, click off anyone who is absent, pick a group size, and blend.

Try it out for yourself [here](https://www.student-mixer.vercel.app), but remember that you'll need a list of names.

---

## Features

- **CSV & JSON Roster Upload:** Drag and drop (or browse for) `.csv`, `.json`, or `.txt` files containing student names.
- **Manual Roster Additions:** Add missing names after uploading a list; additions are saved locally alongside the uploaded roster.
- **Balanced Group Generation:** Uses a Fisher-Yates shuffle and distributes any remainder students evenly across groups (e.g., 10 students in groups of 3 becomes `4, 3, 3` instead of `3, 3, 3, 1`) so nobody is ever left solo.
- **Flexible Group Sizes:** Choose group sizes between **2 and 5** members.
- **Session Absence Tracking (`localStorage`):** Click any student to mark them absent for the session, and restore accidentally removed names with a single click—no need to re-upload the file.
- **3D Blender Animation:** Watch student name cards drop into a 3D blender and swirl together before the randomized groups are revealed.
- **Multi-Language Support (i18n):** Built-in language switcher with automatic browser locale detection and a type-safe dictionary system.

---

##  Tech Stack

- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/HannesAlexandersson/student-mixer.git](https://github.com/HannesAlexandersson/student-mixer.git)
   cd student-mixer
   ```
2.   **Install dependencies:**
     ```bash
    npm install
    ```
3. **Start the development server:**
    ```bash
  npm run dev
   ```


### 📄 Supported File Formats

**JSON** 
An array of strings or objects containing a name / namn property:
```json
[
  "Alice Lindqvist",
  "Liam Bergström",
  "Maja Sjöberg",
  "Noah Ekström"
]
```

**CSV**
A single-column list (an optional name or namn header row is automatically ignored) or comma/semicolon-separated values:
```json
Kodavsnitt

name
Alice Lindqvist
Liam Bergström
Maja Sjöberg
Noah Ekström
```

### 🌍 Contributing & Adding Languages

Contributions are welcome! If you would like to add support for another language, follow the **[step-by-step translation guide](https://github.com/HannesAlexandersson/student-mixer/blob/main/src/i18n/readme.md)**
and open a Pull Request.

For bug reports or feature ideas, feel free to open an issue.

## ✨ Contributors

Thanks to all the people who have contributed to this project! See [CONTRIBUTORS.md](CONTRIBUTORS.md) for details.

<a href="https://github.com/HannesAlexandersson/student-mixer/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HannesAlexandersson/student-mixer" alt="Contributors" />
</a>

### 📝 License
This project is open source and available under the MIT License.

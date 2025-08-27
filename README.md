# Nailit Sprint Board - Frontend Intern Assignment

This is a solution for the Nailit frontend intern assignment. The goal was to build a "Sprint Board Lite" application with specific features and a user-specific variant within a 4-hour time box.

**Live Demo URL:** [Link to your Vercel deployment will go here]

---

## Time Spent

* **Actual Time:** [e.g., 3 hours 30 minutes] - *Calculate this by looking at the time of your first and last commits on GitHub.*

---

## Tech Stack & Decisions

I built this project using the required stack:
* **Next.js 15 (App Router)**
* **TypeScript**
* **Tailwind CSS**

For specific features, I made the following decisions:

* **Drag and Drop:** I chose **`dnd-kit`**. It's a modern, accessible, and powerful library for React that works seamlessly with the Next.js App Router, unlike older libraries which can have compatibility issues.
* **Modals:** I used **`@radix-ui/react-dialog`**. Radix is a headless UI library that provides excellent accessibility (focus management, ARIA attributes) out of the box, which is crucial for building professional-grade components.
* **Notifications:** I used **`react-hot-toast`** for its simplicity and ease of use in providing immediate user feedback for API actions.
* **State Management:** I relied on React's built-in `useState` and `useMemo` hooks. For an application of this scale, this is sufficient and avoids the overhead of a larger state management library like Redux or Zustand.

---

## Variant Implemented

* My assigned variant was **Keyboard Moves**.
* **Functionality:** Once a task card is focused (by clicking on it or using the Tab key), the user can press the `[` key to move it to the column on the left and the `]` key to move it to the column on the right. This was implemented in the `TaskCard.tsx` component.

---

## Setup and Running Locally

1.  Clone the repository:
    ```bash
    git clone [Your GitHub Repo URL]
    ```
2.  Navigate to the project directory:
    ```bash
    cd nailit-sprint-board
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  In one terminal, run the mock API server:
    ```bash
    npm run server
    ```
5.  In a second terminal, run the development server:
    ```bash
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in your browser.
# ⏱️ Interval Timer – Focus & Work Cycle Manager

This project began as a tool to help me structure my **working time** — not as a fitness tracker.  
While it supports HIIT, Tabata, and other workout formats, its real purpose is to serve as a **customizable interval timer for deep work**, task batching, focus sessions, and structured breaks.

Think of it as a **flexible Pomodoro-style timer**, built with offline support, visual feedback, and interval control — but without the rigid 25/5 rules.
t with Django (backend) and vanilla JavaScript (frontend), it allows users to create, manage, and execute personalized workout sessions with visual progress, audio cues, and full offline support.

🔗 **Live Demo**: [mhbb.me](https://mhbb.me/forfun/interval-timer/))

---

## ✨ Features

- 🛠️ **Custom Workout Builder**

  - Create & name routines
  - Add intervals (timed or reps-based)
  - Drag & drop reordering
  - Save, edit, delete, or duplicate routines

- ⏱️ **Smart Timer**

  - Run workouts with real-time interval tracking
  - Visual progress bars for intervals and total session
  - Audio cues and voice announcements
  - Manual skip/pause/resume support
  - Works even in background or locked screen (PWA)

- 📅 **Training Plans**

  - Chain multiple workouts into a weekly or daily plan
  - One-click execution of full plans

- 🔈 **Audio / TTS Cues**

  - Start/end sounds
  - Countdown beeps
  - Optional spoken interval names

- 📱 **PWA-Enabled**
  - Works offline
  - Installable on mobile & desktop
  - Service Worker keeps timer accurate even when backgrounded

---

## 🧰 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (ES6+)
- **Backend**: Django, Django REST Framework

## 📄 License

This project is licensed under the [GNU GPL v3.0](./LICENSE).

You are free to use, modify, and distribute it —
but **any modifications must also be open-sourced under the same license**.

---

## 🙌 Contributing

Pull requests are welcome!
If you improve a feature or fix a bug, please submit a PR — but remember your version must remain open-source under GPL-3.0.

---

## 👤 Author

Built with ❤️ by \[mojtaba habibi]
→ [https://mhbb.me](https://mhbb.me)

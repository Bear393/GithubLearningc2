# GithubLearningc2
My personal project for building a simple to-do list web app while learning Git, HTML, CSS, and JavaScript fundamentals at my own pace.

Updated 24 Sep 2025 16:30

## Project Overview
This repository chronicles the minimalist task manager I am crafting to run entirely in the browser. It is tailored specifically for how I like to organize tasks and experiment with GitHub workflows.

I use the project as a sandbox to understand how HTML structures the page, how CSS adds visual polish, and how JavaScript brings interactivity to the to-do list.

## Features
- Browser-based task list you can view by opening [`index.html`][4] directly.
- Simple styling with `style.css` so you can experiment with layout, colors, and typography.
- Interactive task management powered by `app.js`, where you can add, toggle, and organize items.
- Lightweight setup that helps me focus on learning Git commits, branches, and pull requests.

## Quick Start
1. Clone this repository: `git clone https://github.com/<your-username>/GithubLearningc2.git`
2. Open the project folder and double-click `index.html`, or serve it with a simple HTTP server.
3. Start adding, checking off, and organizing tasks to see the live updates in your browser.

## Project Structure
```
.
├── index.html   # Main page that renders the to-do list interface
├── style.css    # Styling for layout, colors, and typography
├── app.js       # JavaScript logic for task interactions
└── README.md    # Project guide and learning roadmap
```

## Customize Your Experience
Follow the checklist below to plan your next enhancements and keep track of what you have already accomplished. Pair it with the Tips and Resources sections to explore new ideas.

## Run the site locally on port 3000
Follow the steps below to preview the static site at `http://localhost:3000`.

1. **Clone the repository (first time only).**
   ```bash
   git clone https://github.com/<your-account>/GithubLearningc2.git
   cd GithubLearningc2
   ```

2. **Start a local static server on port 3000.**
   Using `npx` (recommended because it needs no global installs):
   ```bash
   npx --yes serve@latest -l 3000 .
   ```
   > The first invocation downloads the CLI; subsequent runs are cached for the current session.

   Alternatively, if you prefer Python’s built-in server:
   ```bash
   python3 -m http.server 3000
   ```

3. **Open the site in your browser.**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the URL printed by the server) on desktop or on a mobile device/emulator pointed at your development machine.

4. **Stop the server when you are done.**
   Return to the terminal and press `Ctrl+C` to terminate the process.

## To Do
- [x] Create your first index.html file
- [x] Create style.css

## Tips
1. Always use simple name
  1. Helps others to remember
  2. :joy:

## Resources
1. [Git Tutorial][1]
2. [HTML Tutorial][2]
3. [Markdown Cheat Sheet][3]

<footer>
  <p>&copy; 2025 Bear393. All rights reserved.</p>
</footer>

[1]: https://www.w3schools.com/git/
[2]: https://www.w3schools.com/html/
[3]: https://www.markdownguide.org/cheat-sheet/
[4]: https://bear393.github.io/GithubLearningc2

# GithubLearningc2
Updated 20 Sep 2025 11:16

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
- [ ] Create style.css

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

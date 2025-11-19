# My HD Penny Guide Playbook
**Your Personal Cheat Sheet (Plain English, No Jargon)**

**Last Updated:** 2025-11-19 (Added AI Session Modes)

> 💡 **This is YOUR guide** - bookmark it! Everything you need to know about working with this project.

---

## 🚀 Getting Started After Restart

**When you restart Claude Desktop:**

1. **Start a new conversation**
2. **First message:** "Read AI-QUICKSTART.md and help me build the HD Penny Guide"
3. **I'm ready!** - No re-explaining needed

**That's it.** The documentation does the heavy lifting.

---

## 🎭 AI Session Modes (How to Get the Best Results)

Use these prompts to switch the AI into different working styles:

### 🧠 Strategic Mode: Explore Options Before Building

**When to use:** Starting a new feature, making decisions, stuck on approach

**Say this:**
```
Strategic mode: I need to explore options before we build anything.

Read PLAYBOOK.md for context.

[Describe your idea or problem]

Help me think through:
1. What are 2-3 different ways to approach this?
2. What's cool/innovative that I might not have thought of?
3. For each approach: What's great? What could go wrong?
4. Which approach gives me the most flexibility later?
5. What should I try first to validate this idea?

Be creative. Suggest things I haven't considered. I want to explore possibilities.
```

**The AI will:** Act as strategic advisor, explore options, suggest creative solutions, explain tradeoffs in plain English.

---

### 📋 Planning Mode: Design Before Implementation

**When to use:** After choosing an approach, before writing code

**Say this:**
```
Planning mode: Let's design this feature step-by-step.

Read PLAYBOOK.md and AI-QUICKSTART.md.

We've decided to: [your decision from strategic mode]

Create a detailed plan:
1. Break this into 3-5 phases I can test independently
2. What's the simplest version that proves the concept?
3. What can I verify after each phase (without reading code)?
4. Where might we get stuck? What's the backup plan?
5. What should we build AFTER this to build on it?

Think ahead. What opportunities does this create?
```

**The AI will:** Create step-by-step plan, identify risks, suggest testing approach, think about future possibilities.

---

### ⚙️ Execution Mode: Build Specific Tasks

**When to use:** After strategic + planning, ready to implement

**Say this:**
```
Execution mode: Build this specific task.

Read AI-QUICKSTART.md.

Task: [Clear, specific request]

Success looks like:
- [Outcome 1]
- [Outcome 2]

After building, tell me:
1. What you built and where to test it
2. What could break and how I'd know
3. What we should enhance next
4. Any creative ideas you had while building
```

**The AI will:** Implement the feature, provide testing steps, proactively suggest improvements.

---

### 🔍 Review Mode: Check What We've Built

**When to use:** Every 3-5 features, or when things feel messy

**Say this:**
```
Review mode: Let's step back and assess our progress.

We've recently built:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Strategic review:
1. What patterns are emerging? What's working well?
2. What's getting messy or fragile?
3. What foundation work should we do now to make future features easier?
4. What am I NOT asking about that I should be?
5. What creative opportunities are we missing?
6. What will bite me in 3 months if we don't address it?

Be honest and proactive. Suggest improvements I haven't thought of.
```

**The AI will:** Identify technical debt, suggest refactoring, propose creative enhancements, think long-term.

---

## 💡 Key Principles for Working Together

**1. AI Should Be Proactive**
- Suggest better approaches even if I didn't ask
- Point out opportunities I'm missing
- Think ahead about what comes next
- Be creative and exploratory

**2. Optimize for My Strengths**
- I'm great at: judging UX, making strategic decisions, describing outcomes
- Help me leverage these strengths
- Compensate for technical gaps without limiting creativity

**3. Think in Outcomes, Not Code**
- I can visualize user experiences
- I can describe what success looks like
- Help me translate vision into implementation

**4. Explore Before Executing**
- More options = better decisions
- Creative suggestions welcome
- Think "what's possible?" not "what's minimal?"

---

## 💻 Running the Website Locally

### Starting the Development Server

**What it means:** Launches a local version of your website that auto-updates as you make changes.

**How to do it:**
```bash
cd /c/Users/cadeg/Projects/hd-penny-nextjs
npm run dev
```

**What happens:**
- Terminal says "Ready in [X]ms"
- Website available at **http://localhost:3001**
- Leave terminal window open while working
- Press **Ctrl+C** to stop the server

**Troubleshooting:**
- "Port in use" → Something's already running on that port, kill it or restart computer
- "Command not found" → You're in the wrong directory, use the `cd` command above
- Blank page → Check terminal for errors

---

## 📝 Common Tasks (What You'll Actually Do)

### I Want to Add a New Page

**Tell AI:** "Add a new page called [name] about [topic]"

**What AI will do:**
1. Create `app/[name]/page.tsx`
2. Add basic structure
3. Tell you to visit `localhost:3001/[name]` to see it

**Example:**
- "Add a new page called 'tips' about penny hunting tips"
- Creates `app/tips/page.tsx`
- Visit `localhost:3001/tips`

---

### I Want to Change Text on a Page

**Tell AI:** "Change the text on [page] that says [old text] to [new text]"

**Or just:** "Update the homepage to say [something]"

**AI will:**
1. Find the file
2. Make the change
3. Confirm it's done

**No need to know which file** - just describe what you want changed.

---

### I Want to Change How Something Looks

**Tell AI:** "Make [thing] look [description]"

**Examples:**
- "Make the buttons rounder"
- "Change the orange color to a darker shade"
- "Make the text bigger on mobile"
- "Add more spacing between sections"

**AI knows how to edit the styles** - you just describe the result you want.

---

### I Want to Add a Feature

**Tell AI:** "I want to add [feature]"

**Examples:**
- "I want to add a search bar"
- "I want to add a quiz"
- "I want to add a calculator for ROI"

**AI will:**
1. Ask clarifying questions if needed
2. Build the feature
3. Show you where to test it

---

### Something Broke

**Tell AI:** "Something's broken, here's what I see: [describe or paste error]"

**Common issues:**
- **Server won't start:** Try `npm install` then `npm run dev` again
- **Page is blank:** Check browser console (F12) for errors
- **Changes not showing:** Hard refresh browser (Ctrl+Shift+R)

**AI can usually fix it** - just describe the problem.

---

## 🌐 Viewing Your Website

**Local (development):**
- URL: http://localhost:3001
- Only you can see it
- Updates as you make changes
- Requires dev server running

**Live (not set up yet):**
- Will deploy to Vercel when ready
- Everyone can see it
- Updates when you push to GitHub

---

## 📂 Where Things Live (Simple Version)

**Think of your website like a house:**

- **app/** = The rooms (each page is a room)
- **components/** = Furniture you reuse (navbar, buttons, cards)
- **public/** = Pictures and decorations
- **_backup-content/** = Old house blueprints (don't touch, just reference)

**You don't need to know the details** - AI handles the structure.

---

## 🎨 Customizing the Look

### Changing Colors

**Tell AI:** "Change the orange color to [color]" or "Make it more blue"

**Technical note (if you're curious):**
Colors are controlled in `app/globals.css` with a "hue" number (0-360):
- 10 = Home Depot Orange (current)
- 220 = Blue
- 160 = Green
- 0 = Red

### Changing Fonts

**Tell AI:** "Make the font [description]"

Examples:
- "Make the font more modern"
- "Use a serif font for headings"
- "Make everything slightly bigger"

---

## 📱 Testing on Different Devices

**Desktop:**
Just open http://localhost:3001 in your browser

**Mobile simulation:**
1. Open browser dev tools (F12)
2. Click device icon (looks like phone/tablet)
3. Choose device from dropdown

**Real mobile device:**
1. Both devices on same WiFi
2. Use network URL from terminal (e.g., `http://192.168.1.3:3001`)

---

## 💾 Saving Your Work (Git)

**Don't worry too much about this** - AI handles Git commands. But here's what's happening:

**When AI "commits":**
- Saves a snapshot of your changes
- Adds a description of what changed
- Like hitting "Save" on a document

**When AI "pushes":**
- Uploads changes to GitHub
- Makes a backup in the cloud
- Lets you access from anywhere

**If you're curious:**
- Check GitHub.com to see your project
- Every change is tracked
- You can always go back if needed

---

## 🚨 Emergency Procedures

### The Site Won't Load

1. Check terminal - is dev server running?
2. Try stopping (Ctrl+C) and restarting (`npm run dev`)
3. Still broken? Tell AI: "Dev server won't start, here's the error: [paste]"

### I Messed Something Up

**Don't panic!** Git saves everything.

**Tell AI:** "I think I broke something, can you revert the last change?"

Or: "Can you show me what changed in the last hour?"

### I Want to Start Fresh

**Nuclear option** (rare):
1. Close everything
2. Delete local folder
3. Re-clone from GitHub
4. Run `npm install` and `npm run dev`

(AI can guide you through this)

---

## 🎓 Learning Resources

### Understanding Next.js

You don't need to learn Next.js to use this project, but if you're curious:
- Next.js docs: https://nextjs.org/docs
- Focus on "App Router" sections
- Concepts to know: Pages, Components, Layouts

### Understanding Tailwind CSS

Tailwind is the styling system. Key concept:
- Instead of writing CSS, you use class names
- `className="text-blue-500 font-bold"` = blue, bold text
- AI handles this - you just describe what you want

---

## 📞 Working with AI Assistants

### Starting a Session

**Best first message:**
"Read AI-QUICKSTART.md and help me with [task]"

### Giving Good Instructions

**Good:**
- "Add a page about store etiquette"
- "Make the FAQ section collapsible"
- "Change the orange to match HD's actual brand color"

**Not as good:**
- "Fix it" (fix what?)
- "Make it better" (better how?)
- "Add stuff" (what stuff?)

**Be specific about the result you want, AI figures out the "how"**

### If AI Gets Confused

**Try:**
- "Let me clarify: I want [clearer description]"
- "Show me what you're proposing before making changes"
- "Let's start over with this task"

---

## 🎯 Current Goals

**Immediate (Next 1-2 sessions):**
- [ ] Convert core penny guide pages from old site
- [ ] Get 5-10 pages working and looking good
- [ ] Make sure search works properly
- [ ] Test dark mode

**Soon:**
- [ ] Add quiz/calculator features
- [ ] Improve mobile experience
- [ ] SEO optimization
- [ ] Deploy to Vercel

**Later:**
- [ ] Advanced features (progress tracking, etc.)
- [ ] Community features (if desired)
- [ ] Analytics (privacy-friendly)

---

## 🔑 Key Files to Know About

You mostly won't edit these directly (AI does), but good to know they exist:

- **AI-QUICKSTART.md** - Teaches AI about your project (read this if you restart)
- **CONTEXT.json** - Structured project info for AI
- **README.md** - Project overview (for humans)
- **package.json** - Lists all the code libraries used
- **app/page.tsx** - The homepage code
- **app/layout.tsx** - Template that wraps every page (navbar, footer, etc.)

---

## 💡 Pro Tips

1. **Keep dev server running** while working - sees changes instantly
2. **Test in multiple browsers** - Chrome, Firefox, Safari behave differently
3. **Check mobile view** - more people browse on phones
4. **Ask AI to explain** if you're curious how something works
5. **Save often** - ask AI to commit after each working feature
6. **Don't be afraid to experiment** - Git saves everything, you can undo

---

## 📊 Project Status at a Glance

**What's Done:**
- ✅ Next.js setup
- ✅ Professional foundation
- ✅ Old content backed up
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Git repository organized

**What's Next:**
- ⏳ Content conversion (11 core pages)
- ⏳ Search functionality
- ⏳ Quiz system
- ⏳ Deploy to web

**What's Future:**
- 💭 Advanced features
- 💭 Community tools
- 💭 Mobile app (maybe?)

---

## 🎬 Quick Reference Commands

**Copy these when you need them:**

```bash
# Start working
cd /c/Users/cadeg/Projects/hd-penny-nextjs
npm run dev

# Stop server
Ctrl+C

# Install something new
npm install [package-name]

# Check for problems
npm run lint

# Build for production
npm run build
```

---

## 📝 Notes Section

**Use this space for your own notes:**

---

**Made for you by AI** - Update this file whenever your goals or workflow changes!

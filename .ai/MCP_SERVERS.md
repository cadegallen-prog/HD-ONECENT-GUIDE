# MCP Servers - Complete Reference

**Purpose:** Document all Model Context Protocol servers available to AI agents, their capabilities, best practices, and anti-patterns.

**Status:** 6 MCP servers active (filesystem, github, git, chrome-devtools, pylance, sequential-thinking)

---

## Configuration Location

**File:** `~/.codex/config.toml` (user home directory)

```toml
mcp_enabled = [
  "filesystem",
  "github",
  "git",
  "chrome-devtools",
  "pylance",
  "sequential-thinking"
]
```

All servers use `npx` with `-y` flag for zero-install execution.

---

## 1. Filesystem MCP

**Command:** `npx -y @modelcontextprotocol/server-filesystem`  
**Scope:** `C:\Users\cadeg\Projects\HD-ONECENT-GUIDE`  
**Purpose:** Read and write files in the project directory

### Capabilities

- Read file contents (any file in project)
- Write/edit files
- List directory contents
- Create/delete files and directories

### Best Practices

✅ **Use for:**

- Targeted file reads (specific paths)
- Batch file operations
- Creating multiple related files
- Reading configuration files

❌ **Avoid:**

- Recursive directory scans (use `file_search` instead)
- Reading same file multiple times in one session
- Exploratory browsing (inefficient token usage)

### Example Use Cases

```typescript
// Good: Targeted read
read_file("components/penny-list-table.tsx", lines: 1-50)

// Bad: Exploratory scan
list_dir("/")
list_dir("/components")
list_dir("/components/ui")
// ... just use file_search with pattern instead
```

---

## 2. GitHub MCP

**Command:** `npx -y @modelcontextprotocol/server-github`  
**Purpose:** Interact with GitHub API for PRs, issues, repos

### Capabilities

**Repository Management:**

- `github_create_repository` - Create new repos
- `github_fork_repository` - Fork repos
- `github_create_branch` - Create branches
- `github_get_file_contents` - Read files from any GitHub repo
- `github_create_or_update_file` - Push file changes
- `github_delete_file` - Remove files
- `github_push_files` - Batch file commits

**Pull Request Management:**

- `github_create_pull_request` - Open new PRs
- `github_update_pull_request` - Edit PR details, add reviewers
- `github_list_pull_requests` - List PRs with filters
- `github_pull_request_read` - Get PR details, diff, status, files, comments
- `github_merge_pull_request` - Merge PRs
- `github_update_pull_request_branch` - Update PR branch with base

**Pull Request Reviews:**

- `github_pull_request_review_write` - Create/submit/delete reviews
- `github_add_comment_to_pending_review` - Add line comments
- `github_request_copilot_review` - Request AI code review

**Issue Management:**

- `github_issue_write` - Create/update issues
- `github_add_issue_comment` - Comment on issues

**Teams:**

- `github_get_teams` - List user's team memberships

### Best Practices

✅ **Use for:**

- Creating PRs for significant changes
- Requesting code reviews
- Managing issues
- Checking PR status/CI results
- Reading files from other repos

❌ **Avoid:**

- Polling GitHub API repeatedly (rate limits)
- Creating PRs for trivial changes (just push)
- Using for local file operations (use filesystem instead)

### Example Workflow: Creating a PR

```typescript
// 1. Create branch
github_create_branch({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  branch: "feature/new-feature",
  from_branch: "main",
})

// 2. Make file changes
github_create_or_update_file({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  path: "components/new-component.tsx",
  content: "...",
  message: "Add new component",
  branch: "feature/new-feature",
})

// 3. Create PR
github_create_pull_request({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  title: "Add New Feature",
  body: "Description...",
  head: "feature/new-feature",
  base: "main",
})

// 4. Request review
github_request_copilot_review({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  pullNumber: 123,
})
```

---

## 3. Git MCP

**Command:** `npx -y @modelcontextprotocol/server-git`  
**Repository:** `C:\Users\cadeg\Projects\HD-ONECENT-GUIDE`  
**Purpose:** Local git operations

### Capabilities

- Check repository status
- View diffs
- Get branch information
- Read commit history
- Inspect working directory changes

### Best Practices

✅ **Use for:**

- Checking current branch before operations
- Viewing uncommitted changes
- Understanding what was changed recently
- Verifying changes before committing

❌ **Avoid:**

- Making commits (use run_in_terminal instead)
- Complex git operations (rebase, merge conflicts)
- Repeated status checks (cache the info)

### Example Use Cases

```typescript
// Check what branch we're on and status
get_changed_files({
  repositoryPath: "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE",
  sourceControlState: ["unstaged", "staged"],
})

// See what changed in a specific file
// (Use git diff via run_in_terminal)
```

---

## 4. Chrome DevTools MCP

**Command:** `npx -y @modelcontextprotocol/server-chrome-devtools`  
**Purpose:** Browser automation and testing

### Capabilities

**Page Management:**

- `chr_new_page` - Open new browser tab
- `chr_list_pages` - List all open tabs
- `chr_select_page` - Switch active tab
- `chr_close_page` - Close tab
- `chr_navigate_page` - Navigate to URL, back, forward, reload
- `chr_resize_page` - Set viewport dimensions
- `chr_wait_for` - Wait for text to appear

**Interaction:**

- `chr_click` - Click elements
- `chr_fill` - Fill form inputs
- `chr_fill_form` - Fill multiple fields at once
- `chr_upload_file` - Upload files
- `chr_handle_dialog` - Accept/dismiss alerts/confirms

**Network & Performance:**

- `chr_list_network_requests` - See all requests
- `chr_get_network_request` - Get request details
- `chr_emulate` - Set network/CPU throttling, geolocation

**Evaluation:**

- `chr_evaluate_script` - Run JavaScript in page

### Best Practices

✅ **Use for:**

- Visual regression testing (before/after screenshots)
- Testing responsive layouts at different viewports
- Verifying forms work correctly
- Testing network performance under throttling
- Checking real browser behavior (not just build)

❌ **Avoid:**

- Replacing unit tests (use for integration/E2E only)
- Scraping production sites repeatedly
- Complex multi-step flows (use Playwright instead)

### Example: Testing Penny List at 75% Zoom

```typescript
// 1. Open page
chr_new_page({ url: "http://localhost:3001/penny-list" })

// 2. Set viewport to simulate 75% zoom
// 1920×1080 at 75% = 2560×1440 effective pixels
chr_resize_page({ width: 2560, height: 1440 })

// 3. Wait for content to load
chr_wait_for({ text: "Crowd Reports" })

// 4. Take screenshot (via evaluate_script)
chr_evaluate_script({
  function: `() => {
    return document.querySelector('table') !== null
  }`,
})

// 5. Check network requests for errors
chr_list_network_requests({
  resourceTypes: ["fetch", "xhr"],
})
```

---

## 5. Pylance MCP

**Command:** `npx -y @modelcontextprotocol/server-pylance`  
**Purpose:** Python code analysis, validation, and execution

### Capabilities

**Code Validation:**

- `pylanceFileSyntaxErrors` - Check Python file for syntax errors
- `pylanceSyntaxErrors` - Validate code snippet for syntax

**Code Execution:**

- `pylanceRunCodeSnippet` - Run Python code directly in workspace environment
  - Uses correct Python interpreter
  - No shell escaping issues
  - Clean stdout/stderr output
  - No temporary files needed

**Python Environment:**

- Automatic environment detection and configuration
- Respects workspace settings
- Uses configured interpreter path

### Best Practices

✅ **Use for:**

- Validating Python code before saving
- Testing Python snippets quickly
- Verifying imports work
- Running quick calculations/transformations
- Checking Python expressions

❌ **Avoid:**

- Long-running scripts (use run_in_terminal with isBackground=true)
- Scripts requiring user input
- Scripts that modify filesystem extensively

### Example: Validating and Running Python

```typescript
// 1. Validate syntax first
pylanceSyntaxErrors({
  code: `
import pandas as pd
df = pd.DataFrame({'a': [1, 2, 3]})
print(df.head())
  `,
  pythonVersion: "3.11",
})

// 2. If valid, run it
pylanceRunCodeSnippet({
  workspaceRoot: "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE",
  codeSnippet: `
import pandas as pd
df = pd.DataFrame({'a': [1, 2, 3]})
print(df.head())
  `,
  timeout: 5000,
})
```

---

## 6. Sequential Thinking MCP

**Command:** `npx -y @modelcontextprotocol/server-sequential-thinking`  
**Purpose:** Extended reasoning and multi-step problem solving

### Capabilities

- Break down complex problems into steps
- Maintain context across reasoning steps
- Generate detailed analysis before action
- Self-correction through iterative thinking

### Best Practices

✅ **Use for:**

- Complex architectural decisions
- Multi-step refactoring plans
- Debugging difficult issues
- Understanding complex codebases
- Planning before implementing

❌ **Avoid:**

- Simple tasks (adds overhead)
- When speed is critical
- Repetitive operations

### Example: Planning Complex Feature

```typescript
// Use sequential thinking to plan before coding
// This happens internally when handling complex requests
// No direct tool invocation needed
```

---

## MCP Anti-Patterns (What NOT to Do)

### 1. The "Scan Everything" Anti-Pattern

```typescript
// ❌ BAD: Exploring entire codebase
list_dir("/")
list_dir("/app")
list_dir("/app/about")
list_dir("/app/admin")
// ... 50 more directory listings

// ✅ GOOD: Use file_search
file_search({ query: "**/*.tsx" })
```

### 2. The "Read Everything" Anti-Pattern

```typescript
// ❌ BAD: Reading files you don't need
read_file("README.md")
read_file("CHANGELOG.md")
read_file("AGENTS.md")
read_file("SKILLS.md")
// ... when you only need one

// ✅ GOOD: Read what you actually need
read_file("components/penny-list-table.tsx", lines: 100-150)
```

### 3. The "Poll GitHub" Anti-Pattern

```typescript
// ❌ BAD: Checking PR status repeatedly
github_pull_request_read({ pullNumber: 123, method: "get_status" })
// wait 5 seconds
github_pull_request_read({ pullNumber: 123, method: "get_status" })
// wait 5 seconds
github_pull_request_read({ pullNumber: 123, method: "get_status" })

// ✅ GOOD: Check once, then wait for webhook/notification
github_pull_request_read({ pullNumber: 123, method: "get_status" })
```

### 4. The "Wrong Tool" Anti-Pattern

```typescript
// ❌ BAD: Using GitHub MCP for local files
github_get_file_contents({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  path: "components/navbar.tsx",
})

// ✅ GOOD: Use filesystem for local files
read_file("components/navbar.tsx")
```

---

## Token Usage Guidelines

**Cost hierarchy** (most to least expensive):

1. **Sequential Thinking** - Most tokens, deepest reasoning
2. **Chrome DevTools** - Moderate (network requests, screenshots)
3. **GitHub API** - Moderate (JSON payloads)
4. **Filesystem** - Low (targeted reads)
5. **Git** - Very low (status checks)
6. **Pylance** - Low (syntax validation)

**Optimization strategy:**

1. Cache information you've already retrieved
2. Use specific queries instead of broad scans
3. Batch operations when possible
4. Use cheapest tool that accomplishes the goal

---

## Troubleshooting

### MCP Server Not Responding

**Symptoms:** Tool calls hang or timeout

**Solutions:**

1. Check `~/.codex/config.toml` syntax is valid
2. Verify `npx` is in PATH
3. Increase `startup_timeout_sec` to 30
4. Restart VS Code
5. Check `~/.codex/log` for errors

### Permissions Errors

**Symptoms:** "Access denied" or "Permission denied"

**Solutions:**

1. Verify filesystem MCP scope includes the path
2. Check Windows file permissions
3. Try running VS Code as administrator (last resort)

### Rate Limiting (GitHub)

**Symptoms:** "API rate limit exceeded"

**Solutions:**

1. Reduce frequency of GitHub API calls
2. Use authentication token (if available)
3. Wait for rate limit reset
4. Use git MCP for local operations instead

---

## Update Procedures

### Adding a New MCP Server

1. **Update `~/.codex/config.toml`:**

   ```toml
   mcp_enabled = ["filesystem", "github", "git", "chrome-devtools", "pylance", "sequential-thinking", "new-server"]

   [mcp_servers.new-server]
   command = "npx"
   args = ["-y", "@modelcontextprotocol/server-new-server", "arg1", "arg2"]
   startup_timeout_sec = 20
   ```

2. **Update this documentation:**
   - Add server section with capabilities
   - Add best practices
   - Add example use cases

3. **Update SKILLS.md:**
   - Add to MCP table
   - Add usage notes

4. **Restart VS Code**

5. **Test the new server:**
   - Verify it loads without errors
   - Test basic operations
   - Document any quirks

### Removing an MCP Server

1. Remove from `mcp_enabled` array
2. Remove `[mcp_servers.name]` section
3. Update documentation
4. Restart VS Code

---

## Version History

- **v1.0 (Dec 10, 2025):** Initial comprehensive documentation
  - Documented all 6 active MCP servers
  - Added best practices and anti-patterns
  - Added troubleshooting guide
  - Added token usage guidelines

---
name: doctor
description: Run pre-flight health check before coding
---

Run the health check to verify the environment is ready:

1. Execute `npm run ai:doctor`
2. If any checks fail, fix them before proceeding
3. If all checks pass, you're ready to code

This checks:

- Port 3001 status (reuse if running)
- Required environment variables
- Playwright browser availability
- Node version

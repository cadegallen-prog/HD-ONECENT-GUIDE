import assert from "node:assert"
import test from "node:test"

function withEnv(overrides: Record<string, string | undefined>, run: () => Promise<void>) {
  const previous = new Map<string, string | undefined>()
  for (const key of Object.keys(overrides)) {
    previous.set(key, process.env[key])
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  return run().finally(() => {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  })
}

test("visual pointer report route returns 404 in production deployment", async () => {
  await withEnv(
    {
      VERCEL_ENV: "production",
      NEXT_PUBLIC_VERCEL_ENV: "production",
      NODE_ENV: "production",
      NEXT_PUBLIC_VISUAL_POINTER_ENABLED: undefined,
    },
    async () => {
      const { POST } = await import("../app/api/dev/visual-pointer/report/route")
      const request = new Request("http://localhost/api/dev/visual-pointer/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      })

      const response = await POST(request)
      assert.strictEqual(response.status, 404)
    }
  )
})

test("visual pointer report route stays available in preview/local environments", async () => {
  await withEnv(
    {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_VERCEL_ENV: "preview",
      NODE_ENV: "production",
      NEXT_PUBLIC_VISUAL_POINTER_ENABLED: undefined,
    },
    async () => {
      const { POST } = await import("../app/api/dev/visual-pointer/report/route")
      const request = new Request("http://localhost/api/dev/visual-pointer/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      })

      const response = await POST(request)
      assert.notStrictEqual(response.status, 404)
      assert.strictEqual(response.status, 400)
    }
  )
})

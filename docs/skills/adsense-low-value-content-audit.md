# AdSense “Low Value Content” Audit (SKU / Product Pages)

**When to use:** AdSense is rejecting the site for “low value content” and you suspect `/sku/[sku]` pages are the culprit.

**Goal:** Determine if a representative SKU page (1) has images bots can fetch, (2) has enough _on-page_ content, and (3) renders for Googlebot without CSP breaking the essentials.

---

## 1) Pick a representative SKU page

- Use a SKU that looks “typical” (has a real product image + a Home Depot link).
- Quick source: `data/penny-list.json` (take one of the first items).

Example URL:

`https://www.pennycentral.com/sku/<SKU>`

---

## 2) Image hotlink check (Referer + bot UA)

1. Open the SKU URL HTML and find the hero image `src` (typically `https://images.thdstatic.com/...`).
2. Fetch the image with `Referer` set to your domain, plus bot UAs.

PowerShell (HEAD request):

```powershell
$page = "https://www.pennycentral.com/sku/<SKU>"
$img  = "https://images.thdstatic.com/..."  # copy from page source

Invoke-WebRequest -Uri $img -Method Head -UseBasicParsing -TimeoutSec 30
Invoke-WebRequest -Uri $img -Method Head -UseBasicParsing -TimeoutSec 30 -Headers @{ Referer = $page }
Invoke-WebRequest -Uri $img -Method Head -UseBasicParsing -TimeoutSec 30 -UserAgent "Mediapartners-Google"
Invoke-WebRequest -Uri $img -Method Head -UseBasicParsing -TimeoutSec 30 -UserAgent "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
```

Interpretation:

- `200` → bots can fetch the image (hotlink blocking is not the issue).
- `403` / `404` → bots may see broken images; consider self-hosting or using a proxy image optimizer.

---

## 3) Content volume check (main body only)

AdSense reviewers usually care about _useful_ on-page content, not just a title + outbound link.

PowerShell (server HTML, main body only):

```powershell
$url  = "https://www.pennycentral.com/sku/<SKU>"
$html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30).Content

$m = [regex]::Match($html,'<main[^>]*>([\\s\\S]*?)</main>')
$mainHtml = $m.Groups[1].Value
$mainHtml = [regex]::Replace($mainHtml,'<script[\\s\\S]*?</script>',' ')
$mainHtml = [regex]::Replace($mainHtml,'<style[\\s\\S]*?</style>',' ')
$text = [regex]::Replace($mainHtml,'<[^>]+>',' ')
$text = [System.Net.WebUtility]::HtmlDecode($text)
$text = [regex]::Replace($text,'\\s+',' ').Trim()

$tokens = [regex]::Matches($text.ToLower(),'[a-z0-9\\'']+')
$words  = @($tokens | ForEach-Object { $_.Value })
$unique = @($words | Select-Object -Unique)

"totalWords=$($words.Count) uniqueWords=$($unique.Count)"
```

Rule of thumb:

- If you’re under ~500 **total** words (or far under 500 unique words), SKU pages are likely “thin”.

---

## 4) Googlebot render + CSP console audit (Playwright)

This checks if the page renders (text + images) and whether CSP violations are blocking essentials.

PowerShell:

```powershell
@'
const { chromium } = require("playwright");

const url = "https://www.pennycentral.com/sku/<SKU>";
const googlebotUA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ userAgent: googlebotUA });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("main#main-content");

  const images = await page.$$eval("main#main-content img", (imgs) =>
    imgs.map((img) => ({ src: img.currentSrc || img.src, ok: img.complete && img.naturalWidth > 0 }))
  );

  console.log(JSON.stringify({
    url,
    imagesOk: images.filter((i) => i.ok).length,
    imagesTotal: images.length,
    cspLike: consoleErrors.filter((t) => /content security policy|csp/i.test(t)).slice(0, 10),
  }, null, 2));

  await browser.close();
})();
'@ | node
```

Interpretation:

- If images are loading (`imagesOk === imagesTotal`) and the main text is present, rendering is fine.
- CSP errors that only block third-party scripts (ads, analytics, identity) are usually **not** “content blockers”.
- CSP errors blocking `/_next/static/*` scripts or the main `img` requests are **critical**.

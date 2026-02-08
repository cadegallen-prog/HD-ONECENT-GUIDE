/* PennyCentral Product Extractor - bookmarklet source
 * Minify to bookmarklet.txt via: node tools/bookmarklets/build-bookmarklet.js
 *
 * Collects 9 enrichment fields from Home Depot /p/ product pages:
 *   sku, internetNumber, name, brand, price, model, upc, imageUrl, pageUrl
 */
;(function () {
  try {
    var K = "pennycentral_verified_pennies_draft"
    var L = location.href

    if (L.indexOf("homedepot.") < 0 || L.indexOf("/p/") < 0) {
      alert("Open a Home Depot /p/ product page first.")
      return
    }

    var d = document
    var b = d.body && d.body.innerText ? d.body.innerText : ""

    /* querySelector shorthand → textContent */
    var q = function (s) {
      var e = d.querySelector(s)
      return e && e.textContent ? e.textContent.replace(/\s+/g, " ").trim() : ""
    }

    /* querySelector shorthand → getAttribute */
    var a = function (s, t) {
      var e = d.querySelector(s)
      return e ? e.getAttribute(t) || "" : ""
    }

    /* Parse a price string/number → positive float or null */
    var p = function (x) {
      if (x == null) return null
      var s = ("" + x).trim()
      if (!s) return null
      s = s.replace(/[$,]/g, "").replace(/[^0-9.]/g, "")
      if (!s) return null
      var n = parseFloat(s)
      return isFinite(n) && n > 0 ? n : null
    }

    /* Format a number as $X.XX */
    var fm = function (n) {
      return n == null ? "" : "$" + Number(n).toFixed(2)
    }

    /* Extract first N-digit number from a string */
    var dig = function (s, mx) {
      var r = (s || "").match(new RegExp("\\b\\d{6," + mx + "}\\b"))
      return r ? r[0] : ""
    }

    /* ── SKU extraction ── */
    var sku =
      dig(q('[data-testid="product-sku"]'), 10) ||
      dig(q(".product-identifier__sku"), 10) ||
      dig(q('span[itemprop="sku"]'), 10) ||
      (b.match(/Store\s*SKU\s*#?\s*(\d{6,10})/i) || [])[1] ||
      "" ||
      (b.match(/\bSKU\b[^\d]{0,20}(\d{6,10})/i) || [])[1] ||
      ""

    if (!sku) {
      alert("Could not find Store SKU on this page.")
      return
    }

    /* ── Internet number ── */
    var inet =
      (b.match(/Internet\s*#\s*(\d{6,12})/i) || [])[1] ||
      "" ||
      (location.pathname.match(/\/p\/[^/]+\/(\d{6,12})/) || [])[1] ||
      ""

    /* ── Image URL ── */
    var img =
      a('meta[property="og:image"]', "content") || a('meta[name="og:image"]', "content") || ""
    if (!img) {
      var im = d.querySelector(
        'img[src*="thdstatic"],img[data-src*="thdstatic"],img[srcset*="thdstatic"]'
      )
      if (im) img = im.getAttribute("src") || im.getAttribute("data-src") || ""
    }
    if (img && img.indexOf("thdstatic") > -1) img = img.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")

    /* ── Product name ── */
    var name =
      a('meta[property="og:title"]', "content") ||
      q('h1[data-testid="product-title"]') ||
      q("h1") ||
      ""

    /* ── Spec table lookup ── */
    var spec = function (lbl) {
      var rows = d.querySelectorAll("tr,dt")
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i]
        if (r.tagName && r.tagName.toLowerCase() === "tr") {
          var c = r.querySelectorAll("th,td")
          if (c.length >= 2) {
            var k = (c[0].textContent || "").replace(/\s+/g, " ").trim()
            if (k && k.toLowerCase() === lbl) {
              return (c[1].textContent || "").replace(/\s+/g, " ").trim()
            }
          }
        }
        if (r.tagName && r.tagName.toLowerCase() === "dt") {
          var k2 = (r.textContent || "").replace(/\s+/g, " ").trim()
          if (k2 && k2.toLowerCase() === lbl) {
            var dd = r.nextElementSibling
            if (dd && dd.tagName && dd.tagName.toLowerCase() === "dd") {
              return (dd.textContent || "").replace(/\s+/g, " ").trim()
            }
          }
        }
      }
      return ""
    }

    /* ── Brand, model, UPC from specs ── */
    var brand =
      q('[data-testid="product-brand"]') ||
      a('meta[itemprop="brand"]', "content") ||
      spec("brand") ||
      spec("manufacturer") ||
      ""

    var model = spec("model") || spec("model #") || spec("model number") || ""

    var upc =
      spec("upc") || spec("upc code") || spec("universal product code") || spec("barcode") || ""

    /* ── Price from LD+JSON ── */
    var ld = function () {
      var ss = [].slice.call(d.querySelectorAll('script[type="application/ld+json"]'))
      var cand = []
      for (var i = 0; i < ss.length; i++) {
        try {
          var raw = ss[i].textContent || ""
          if (!raw) continue
          var j = JSON.parse(raw)
          var arr = Array.isArray(j) ? j : [j]
          for (var k = 0; k < arr.length; k++) {
            var it = arr[k]
            if (!it) continue
            if (it["@graph"] && Array.isArray(it["@graph"])) cand = cand.concat(it["@graph"])
            cand.push(it)
          }
        } catch (e) {}
      }
      for (var z = 0; z < cand.length; z++) {
        var t = cand[z] && cand[z]["@type"]
        if (t === "Product" || (Array.isArray(t) && t.indexOf("Product") > -1)) return cand[z]
      }
      return null
    }

    /* Extract retail (original/high) price from LD+JSON offer.
     * Prefer highPrice > price > lowPrice since we want original retail,
     * not the current sale/clearance price. */
    var offer = function (o) {
      if (!o) return null
      if (Array.isArray(o)) {
        for (var i = 0; i < o.length; i++) {
          var r = offer(o[i])
          if (r != null) return r
        }
        return null
      }
      var n = p(o.highPrice)
      if (n != null) return n
      n = p(o.price)
      if (n != null) return n
      n = p(o.lowPrice)
      if (n != null) return n
      return o.offers ? offer(o.offers) : null
    }

    /* ── Price from meta tags ── */
    var metaPrice = p(
      a('meta[itemprop="price"]', "content") ||
        a('meta[property="product:price:amount"]', "content") ||
        a('meta[property="og:price:amount"]', "content")
    )

    /* ── Price from DOM (scoped to main product area) ── */
    var domPrice = function () {
      /* Find the main product buy-box / pricing container first.
       * This avoids accidentally grabbing prices from "recommended",
       * "frequently bought together", or sponsored product sections. */
      var mainBox =
        d.querySelector("#buy-box") ||
        d.querySelector('[data-testid="buy-box"]') ||
        d.querySelector('[id*="product-price"]') ||
        d.querySelector(".price-format__main-price") ||
        d.querySelector('[data-testid="productDetailPage"]') ||
        d /* fallback to whole doc only as last resort */

      var mq = function (sel) {
        var e = mainBox.querySelector(sel)
        return e && e.textContent ? e.textContent.replace(/\s+/g, " ").trim() : ""
      }

      /* Look for "was" / "original" price first (retail before markdown) */
      var wasEl = mainBox.querySelector(
        '[data-testid*="was-price"],' +
          '[data-testid*="original-price"],' +
          '[class*="was-price"],' +
          '[class*="original-price"]'
      )
      if (wasEl) {
        var wp = p(wasEl.textContent)
        if (wp != null) return wp
      }

      var s =
        mq('[data-testid="standard-price"]') ||
        mq('[data-testid="price"]') ||
        mq(".price-format__main-price") ||
        mq('[data-automation-id="productPrice"]') ||
        mq('[itemprop="price"]') ||
        ""
      if (!s) {
        var dd = mq(".price__dollars")
        var cc = mq(".price__cents")
        if (dd) s = "$" + dd + (cc ? "." + cc : "")
      }
      var m = (s || "").match(/\$\s*\d[\d,]*([.]\d{2})?/)
      return p(m ? m[0] : s)
    }

    /* ── Retry loop for price (HD lazy-loads pricing) ── */
    var rp = null
    var tries = 0
    var tick = function () {
      tries++
      var P = ld()
      rp = P && P.offers ? offer(P.offers) : null
      if (rp == null) rp = metaPrice
      if (rp == null) rp = domPrice()

      if (rp != null || tries >= 10) {
        var entry = {
          sku: "" + sku,
          internetNumber: "" + inet,
          pageUrl: location.origin + location.pathname,
          name: name,
          brand: brand,
          price: rp != null ? fm(rp) : "",
          model: model,
          upc: upc,
          imageUrl: img,
        }

        var store = {}
        try {
          store = JSON.parse(localStorage.getItem(K) || "{}") || {}
        } catch (e) {}
        store[entry.sku] = entry
        localStorage.setItem(K, JSON.stringify(store))

        var lines = [
          "PC Extractor — Saved to localStorage",
          "─────────────────────────",
          "SKU: " + (entry.sku || "(none)"),
          "Internet #: " + (entry.internetNumber || "(none)"),
          "Name: " + (entry.name ? entry.name.substring(0, 60) : "(none)"),
          "Brand: " + (entry.brand || "(none)"),
          "Model: " + (entry.model || "(none)"),
          "UPC: " + (entry.upc || "(none)"),
          "Retail Price: " + (entry.price || "(not found)"),
          "Image: " + (entry.imageUrl ? "yes" : "no"),
          "Page URL: " + (entry.pageUrl ? "yes" : "no"),
          "─────────────────────────",
          "Total saved: " + Object.keys(store).length,
        ]
        alert(lines.join("\n"))
      } else {
        setTimeout(tick, 250)
      }
    }

    tick()
  } catch (err) {
    alert("PC Extractor error: " + (err.message || err))
  }
})()

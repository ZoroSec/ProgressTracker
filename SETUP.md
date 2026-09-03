# Syncing Habits through a Google Sheet

Ten minutes, once. After that, adding another device is a single link.

**The app carries these steps itself** — open it, expand *Google Sheet sync ▸ First
time? Create the sheet*. This file is the same thing, for reading away from the app.

There are two independent problems here and this file solves both:

- **A. The data** — a sheet both devices read and write. Steps 1–4.
- **B. The page** — your phone cannot open `localhost:8765`; that address only
  exists on your workstation. Step 5.

---

## 1. Create the spreadsheet

1. Go to <https://sheets.new>. A blank spreadsheet opens.
2. Name it something you'll recognise — `Habits data`.

Leave it empty. The script creates the `habits`, `ticks`, `review` and `meta` tabs
itself on the first sync.

## 2. Add the script

1. In that spreadsheet: **Extensions ▸ Apps Script**. A new tab opens with a file
   called `Code.gs` containing an empty `myFunction()`.
2. Select everything in that editor and delete it.
3. In the tracker, open **Google Sheet sync ▸ First time? Create the sheet** and press
   **Generate secret**, then **Copy script**.
4. Paste into the Apps Script editor and save (disk icon, or Ctrl+S).

The copied script already contains your generated secret, so there is nothing to edit.
That step used to be hand-done and was the most common way to end up with a mismatched
secret, which fails with `wrong secret` and no other clue.

If the clipboard is blocked — it needs a secure context, so it is unavailable over plain
`http://` on a LAN address — the button falls back to a text box with the script
selected; press Ctrl+C there.

Doing it by hand instead: copy `sheet-sync.gs` from this folder and replace
`var SECRET = 'CHANGE_ME';` with your own long random string. It must match the secret
in the app exactly.

## 3. Deploy it as a web app

1. Top right: **Deploy ▸ New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** anything, e.g. `habits sync`
   - **Execute as:** **Me** ← the script needs your permission to touch your sheet
   - **Who has access:** **Anyone** ← required; see the note below
4. **Deploy**.
5. Google asks you to authorise it. You'll see **"Google hasn't verified this app"** —
   that is expected, because the app is a script *you* just wrote. Click
   **Advanced ▸ Go to <project name> (unsafe)**, then **Allow**.
6. Copy the **Web app URL**. It ends in `/exec`. That's what the tracker needs.

> **Why "Anyone"?** The tracker calls this URL from your browser without signing in,
> so the endpoint has to accept anonymous requests. That is exactly why `SECRET`
> exists — a request without the right secret is rejected before it can read or write
> anything. Treat the URL and secret together as a password: anyone holding both can
> read and edit your habit log. They can't reach anything else in your Google account;
> the script only ever touches the spreadsheet it's attached to.

## 4. Connect the app

On each device, open the tracker and expand **Google Sheet sync** at the bottom:

1. **Web app URL** — the `/exec` URL from step 3.6.
2. **Shared secret** — the one you generated in step 2 (already filled in if you
   generated it on this device).
3. **Save & sync.**

The status should read `synced` with a timestamp. Check the spreadsheet: it now has
`habits` and `ticks` tabs with your data in them.

### Every device after the first

Don't retype anything. On the configured device press **Copy device link**, then open
that link on the phone. It configures itself and syncs — no URL, no secret to type on a
phone keyboard.

The link carries the secret in the URL *fragment*, which browsers never send to a
server, and the app strips it from the address bar as soon as it reads it. It still
passes through whatever you paste it into, so send it the way you'd send a password and
delete the message afterwards.

If the app is already open on that device, the link still works — it applies on arrival.

A device's first sync uploads whatever it had locally and pulls down everything else.

### The Review page rides the same setup

The Review page (spaced-repetition recall) syncs through the **same deployment and
secret** — it writes to the `review` tab of the same sheet. Because both pages live at
the same address, Review reads the URL and secret you saved for Habits automatically:
set sync up once here and open Review, and it just works. Review has its own **Google
Sheet sync** panel too, but it edits the same shared setting.

> **Already synced Habits before this update?** The script gained the `review` tab, so
> **re-deploy it once**: press **Copy script** in the Habits page again, paste over the
> old code, then **Deploy ▸ Manage deployments ▸ pencil ▸ Version: New version ▸ Deploy**.
> Until you do, Habits keeps working and Review reports `wrong secret`/blocked.

## 5. Making the page reachable from your phone

Pick one. The first needs no accounts; the others work anywhere.

**Option A — over your home Wi-Fi (2 minutes, home only)**

On the workstation:

```bash
cd "E:\Website\Progress Bar" && python -m http.server 8765 --bind 0.0.0.0
```

Find the machine's local address with `ipconfig` (look for IPv4 Address, something
like `192.168.1.42`), then on your phone open `http://192.168.1.42:8765`. Works only
on the same network, and only while the workstation is on and that command is running.

**Option B — Netlify Drop (5 minutes, works anywhere, no account needed to try)**

Go to <https://app.netlify.com/drop> and drag the `Progress Bar` folder onto the page.
You get an HTTPS URL immediately. Bookmark it on both devices.

**Option C — GitHub Pages (10 minutes, works anywhere, permanent)**

Create a repository, upload `index.html`, then **Settings ▸ Pages ▸ Source: deploy
from branch ▸ main / (root)**. Your URL appears within a minute or two.

For B and C, upload `index.html` and `review.html` (they link to each other).
Everything else in this folder is source and documentation — and never upload a copy of
the script with your real secret in it.

On a phone, use **Add to Home Screen** from the browser menu so it opens like an app.

---

## Setting up someone else with their own log

They do not need this file, and they do not need to paste any code.

Take your spreadsheet's address and replace the trailing `/edit` with `/copy`:

```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/copy
```

Send that. One click gives them their own sheet **with the script already inside**, so
they skip steps 1–2 entirely. They then generate their own secret, paste it into their
copy's script, and deploy it themselves (step 3).

Two things they must not skip: a **copied deployment is not theirs** — they have to run
Deploy ▸ New deployment in their own copy — and they need their **own secret**. Sharing
a URL and secret means sharing one habit log, not having two.

## What the sheet looks like

| tab | columns | one row per |
|---|---|---|
| `habits` | `id`, `name`, `points` | habit |
| `ticks` | `habit_id`, `date` | day you ticked something |
| `review` | `id`, `topic`, `notes`, `created`, `interval`, `nextDue`, `reviews` | review topic |
| `meta` | `key`, `value` | last sync time |

The `reviews` column holds each topic's recall history as a JSON blob; the rest is
plain text, dates included, for the same timezone reason as `ticks`.

Dates are stored as **text**, deliberately. If Sheets parses `2026-09-01` into a real
date, the spreadsheet's timezone can shift it a day on the round trip and silently
move your ticks.

You can edit the sheet by hand and the app will pick it up on the next sync — but
match the format exactly, and don't change a habit's `id`, which is the link between
the two tabs.

## How syncing behaves

- Every change queues a sync about a second later; the app also syncs on open and
  when the device comes back online.
- **Offline, the app keeps working.** Changes save locally and the status reads
  `offline — saved locally`. The next successful sync carries them up.
- **Two devices, both with changes:** ticks merge by union, so nothing is lost.
  Un-ticks are tracked explicitly, so removing a tick on one device isn't undone by
  the other.
- **The one edge case:** rename a habit on your phone and on your workstation while
  both are offline, and whichever syncs last wins. Ticks are unaffected.
- `Export` still works and doesn't need any of this. It remains the backup that
  depends on nothing but a file.

## If something goes wrong

| Status | Cause |
|---|---|
| `wrong secret` | The secret in the app doesn't match `SECRET` in the script. |
| `offline — saved locally` | Wrong URL, no connection, or the deployment isn't live. Confirm the URL ends in `/exec` and opens in a browser. |
| Syncs, but the sheet stays empty | The script is attached to a different spreadsheet. Open the sheet and use **Extensions ▸ Apps Script** from *that* file. |

**After editing the script, redeploy.** Saving is not enough. Go to **Deploy ▸ Manage
deployments**, click the pencil, set **Version** to **New version**, then **Deploy**.
The URL stays the same. This catches everyone at least once.

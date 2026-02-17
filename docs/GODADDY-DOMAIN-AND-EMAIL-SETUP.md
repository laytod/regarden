# GoDaddy domain and email setup for ReGarden

This guide is for the person who has (or has access to) the GoDaddy account where **regardenus.org** was purchased, along with any hosting plan. It covers:

1. **Domain** – confirming the domain and DNS
2. **Email addresses** – forwarding-only @regardenus.org addresses that deliver to each member’s personal email
3. **File uploads** – getting site files onto cPanel (File Manager, SCP, rsync) using the main cPanel account and SSH key auth

---

## Before you start

- You need to **sign in to the GoDaddy account** that owns the domain and hosting.
- **GoDaddy account login ≠ cPanel login.** Your **GoDaddy account** is what you use at godaddy.com (email + password); it lets you see My Products, billing, and open the hosting dashboard. The **cPanel login** is separate: a **username** and **password** for that specific Web Hosting (cPanel) product. The cPanel username is set by GoDaddy when the hosting was created (see [Find my FTP username](https://www.godaddy.com/help/find-my-ftp-username-for-web-hosting-cpanel-16100)); the cPanel password can be changed in the hosting product under Settings. SSH and FTP use the **cPanel** username and password, not your GoDaddy account email/password.
- If someone else purchased it, they must either:
  - Do the setup themselves using this guide, or  
  - Add you as a user / share the login (see [GoDaddy account access](https://www.godaddy.com/help)).

---

## 1. Domain setup (regardenus.org)

### 1.1 Confirm the domain

1. Sign in at [godaddy.com](https://www.godaddy.com).
2. Go to **My Products** (or **Domain Portfolio**).
3. Find **regardenus.org** and open it.
4. Confirm it’s **Active** and not expired.

### 1.2 Point the domain (DNS)

If you have **website hosting** with GoDaddy:

- Often the domain is already pointed to that hosting; you may not need to change anything.
- To check or change: **Domain** → **DNS** (or **Manage DNS**).
  - **A record** for the root domain should point to your hosting IP (or GoDaddy’s default if you use their hosting).
  - **CNAME** for `www` often points to the same place or to the root.

If the **website is hosted elsewhere** (e.g. Netlify, Vercel, another host):

- In **DNS**, add or edit the records they give you (usually an **A** and/or **CNAME**).
- DNS changes can take up to 48 hours to propagate.

---

## 2. Email setup for ReGarden members (forwarding-only)

Create **forwarding-only** addresses like **stacy@regardenus.org** that deliver mail to each person’s existing personal email (Gmail, etc.). There is no separate inbox—mail goes straight to the address you set.

**Current team (from the site):**

| Name   | Role                      | Current email in site        |
|--------|---------------------------|-----------------------------|
| Katie  | President                 | katie@regardenus.org        |
| Stacy  | Secretary                 | stacy@regardenus.org        |
| Kevin  | Treasurer                 | kevin@regardenus.org        |
| Treasure | Board Member / Consultant | treasure@regardenus.org   |
| Tricia | Co-founder                | tricia@regardenus.org       |

**Steps:**

1. Sign in at [productivity.godaddy.com](https://productivity.godaddy.com) (Email & Office dashboard).
2. In the left menu, click **Forwards**.
3. Click **Add Forward**.
4. For each address:
   - **Forwarding address name:** the part before @ (e.g. `stacy` → **stacy@regardenus.org**).
   - **Forward to:** their personal email (e.g. their Gmail). You can enter **multiple addresses** separated by commas if one address should forward to several people.
5. Click **Save**.

**Example:**

- **stacy@regardenus.org** → forward to Stacy’s personal email  
- **kevin@regardenus.org** → forward to Kevin’s personal email  
- **katie@regardenus.org** → forward to katieomartinek@gmail.com  

**Note:** Forwarding-only addresses require the **Email Forwarding** product (sometimes included with the domain or workspace). If you don’t see **Forwards**, check **My Products** in GoDaddy to see if that product is on the account.

---

## 3. Quick reference

| Goal                          | Where to do it |
|-------------------------------|----------------|
| See domain / DNS              | GoDaddy → My Products → regardenus.org → DNS |
| Add forwarding-only addresses | [productivity.godaddy.com](https://productivity.godaddy.com) → Forwards → Add Forward |

---

## 4. Suggested plan for ReGarden

1. **Domain:** Confirm **regardenus.org** is active and DNS points to your website host.
2. Create **forwarding-only** addresses for each team member (Section 2); set **Forward to** to their personal email.
3. Update **data/team.json** if you change any displayed email addresses on the site.

---

## 5. Uploading files to cPanel (website)

If your site is hosted on **GoDaddy Web Hosting (cPanel)**, use the **main cPanel login** (the account that owns the hosting). Enable SSH, add your SSH key in cPanel, then use File Manager, SCP, or rsync to upload files—no need to type the cPanel password once key-based auth is set up.

### 5.1 Option 1: cPanel File Manager (browser)

Best for small uploads or one-off changes.

1. Go to [GoDaddy My Products](https://account.godaddy.com/products/) → **Manage** next to **Web Hosting (cPanel)**.
2. Under **Websites**, open **File Manager** for your domain.
3. Go to the folder where the site lives (often **public_html** for the main domain).
4. Click **Upload** → drag-and-drop files or choose them.
5. For many files: zip them locally, upload the zip, then in File Manager use **Extract** on the zip.

- [Upload files using File Manager](https://www.godaddy.com/help/upload-files-using-my-web-hosting-cpanel-file-manager-3239)

### 5.2 Option 2: SCP (command line)

Yes, you can use **scp** once SSH is enabled. Use your **cPanel username** (FTP username), not `root`.

**1. Enable SSH (one-time)**  
GoDaddy product page → **Manage** (Web Hosting) → **Settings** → **Server** → next to **SSH access** click **Manage** → turn the switch **On**. Your **cPanel password** is your SSH password.

**2. Get your credentials**

- **Host:** your domain (e.g. `regardenus.org`) or the server IP (from cPanel or hosting dashboard).
- **Username:** your **cPanel / FTP username** (see [Find my FTP username](https://www.godaddy.com/help/find-my-ftp-username-for-web-hosting-cpanel-16100)).
- **Password:** your cPanel (FTP) password.
- **Port:** **22**.

**3. Upload with scp**

```bash
# Single file
scp /path/to/file.html YOUR_CPANEL_USER@regardenus.org:~/public_html/

# Whole directory (e.g. site build)
scp -r /path/to/regarden/build/* YOUR_CPANEL_USER@regardenus.org:~/public_html/
```

Replace `YOUR_CPANEL_USER` and `~/public_html/` with your actual username and web root path (cPanel often uses `public_html` in your home directory).

**Key-based authentication (optional)**  
You can use **SSH key-based auth** instead of (or in addition to) a password for SSH/SCP/rsync. Add your public key in cPanel (import + authorize), and you can then use SSH without typing the cPanel password—the key is used automatically. You may still be asked for your **key passphrase** on your own machine if you set one when creating the key.

**1. Generate an SSH key on your computer**

Open a terminal (Terminal on Mac/Linux; PowerShell or Git Bash on Windows) and run:

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

- **`-t ed25519`** — Key type (recommended; fast and secure). If your system doesn’t support Ed25519, use: `ssh-keygen -t rsa -b 4096 -C "your@email.com"`.
- **`-C "your@email.com"`** — Optional comment (often your email) to label the key.

When prompted:

- **“Enter file in which to save the key”** — Press **Enter** to use the default (`~/.ssh/id_ed25519` or `~/.ssh/id_rsa`), or type a path to save it elsewhere.
- **“Enter passphrase”** — Optional. A passphrase protects your private key if someone gets the file. You can press **Enter** for none, or type a passphrase (you’ll enter it once per login or add the key to your agent).

You’ll get two files:

- **Private key:** `~/.ssh/id_ed25519` (or `id_rsa`) — Keep this secret; never share it or paste it anywhere.
- **Public key:** `~/.ssh/id_ed25519.pub` (or `id_rsa.pub`) — This is what you add to cPanel.

**2. Copy the public key**

You need to paste the **entire** public key into cPanel (one line). In the same terminal:

```bash
# Show the public key (then select and copy it)
cat ~/.ssh/id_ed25519.pub
```

- **Mac:** `cat ~/.ssh/id_ed25519.pub | pbcopy` copies it to the clipboard.
- **Windows (PowerShell):** `Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard`.
- **Linux (with xclip):** `cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard`.

Use `id_rsa.pub` instead of `id_ed25519.pub` if you generated an RSA key.

**3. Add your public key to cPanel**

1. Log into cPanel (via GoDaddy → **Manage** your Web Hosting → open cPanel).
2. Go to **Security** → **SSH Access** → **Manage SSH Keys**.
3. Click **Import Key**.
4. **Key name:** e.g. `my-laptop` or `work-machine`.
5. **Public key:** Paste the full line you copied (starts with `ssh-ed25519` or `ssh-rsa`, ends with your comment).
6. Click **Import**.

**4. Authorize the key**

In **Manage SSH Keys**, find the key you imported and click **Manage** next to it, then **Authorize**. Until you authorize it, the key cannot be used to log in.

**5. Connect**

SSH/SCP/rsync will use your default key automatically. To use a specific key: `scp -i ~/.ssh/mykey ...` or `rsync -e "ssh -i ~/.ssh/mykey" ...`.

You can keep password login enabled as a fallback; key-based auth is tried first.

- [Enable SSH for Web Hosting (cPanel)](https://www.godaddy.com/help/enable-ssh-for-my-web-hosting-cpanel-account-16102)
- [Connect with SSH](https://www.godaddy.com/help/connect-to-my-web-hosting-cpanel-account-with-ssh-secure-shell-31865)

### 5.3 Option 3: rsync over SSH

Yes, **rsync** works over the same SSH connection. Handy for syncing a local build to the server and only uploading changes.

```bash
# Sync local build to server (dry run first to see what would change)
rsync -avz --dry-run -e ssh /path/to/regarden/build/ YOUR_CPANEL_USER@regardenus.org:~/public_html/

# Actually sync (omit --dry-run)
rsync -avz -e ssh /path/to/regarden/build/ YOUR_CPANEL_USER@regardenus.org:~/public_html/
```

- `-a` = archive (preserves permissions, etc.)
- `-v` = verbose
- `-z` = compress over the wire
- Trailing `/` on the source means “contents of this directory,” not the folder itself.

If SSH is on a non-default port, use e.g. `-e "ssh -p 22"` (GoDaddy cPanel typically uses 22).

---

## Official GoDaddy help links

- [Create, edit or delete forwards (Email Forwarding)](https://www.godaddy.com/help/create-edit-or-delete-forwards-with-email-forwarding-42254)
- [Manage DNS records](https://www.godaddy.com/help/manage-dns-records-680)
- [Upload files using File Manager](https://www.godaddy.com/help/upload-files-using-my-web-hosting-cpanel-file-manager-3239)
- [Enable SSH for Web Hosting (cPanel)](https://www.godaddy.com/help/enable-ssh-for-my-web-hosting-cpanel-account-16102)
- [Connect with SSH (Secure Shell)](https://www.godaddy.com/help/connect-to-my-web-hosting-cpanel-account-with-ssh-secure-shell-31865)
- [Find FTP username](https://www.godaddy.com/help/find-my-ftp-username-for-web-hosting-cpanel-16100) (same as cPanel/SSH username)

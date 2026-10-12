# _private: delete this folder before sharing

Everything in this folder is your own prep material. **Nothing outside it links here**, so deleting the folder breaks nothing.

| File | What it is |
|---|---|
| `CONTEXT.md` | Your briefing: assignment, RFP background, interview Q&A, email draft |
| `LOOM_SCRIPT.md` | Timed outline for recording the Loom |
| `LOOM_SCRIPT_VERBATIM.md` | Run-through copy with every click and input |
| `README.md` | This file |

## Copy the project to your other GitHub account

Do this from your own computer. A fresh repo carries **no git history**, so earlier commits that contained these private files don't come along.

```bash
# 1. Get a clean copy of the current code
git clone --branch main https://github.com/spotterexchange/concourse-deliverable.git intercept
cd intercept

# 2. Remove private files and the old history
rm -rf _private .git

# 3. Add your Loom link: open README.md and replace "_add link_"

# 4. Start a fresh repo and push it to the new account
#    (first create an EMPTY repo on GitHub, with no README or license)
git init -b main
git add -A
git commit -m "Intercept: case management demo for Erie County RFP #2026-052VF"
git remote add origin https://github.com/<new-account>/<repo-name>.git
git push -u origin main
```

**Merge first:** clone `main` only after this branch has been merged, or replace `main` with `claude/serene-lamport-6h8afn` in step 1.

**Prefer the GitHub website?** Use "Add file → Upload files" with the folder contents, *after* deleting `_private/`. Two things to watch:
- Your file browser may hide `.gitignore` and `.env.example`. Turn on hidden files so they get uploaded.
- Never upload `node_modules/` or `.next/` if you ran the app locally.

## Before you send

- [ ] `_private/` is gone from the new repo
- [ ] README has your Loom link
- [ ] The new repo is **public**, or Concourse has access
- [ ] Live demo still loads: https://concourse-deliverable-personal-c635.vercel.app
- [ ] The email (draft in `CONTEXT.md` §9) links the **new** repo

**Keep the original repo and its Vercel project.** The live demo deploys from them. If you'd rather the demo run from the new repo, import the new repo into Vercel, add `CEREBRAS_API_KEY`, and turn off Deployment Protection again. That gives a new URL, so update the README and the email.

---
name: malaysia-b2b-playbook
description: befday.com partner outreach angles and copy for Malaysian F&B, retail, and lifestyle brands. Use when drafting any email or WhatsApp message in send_partner_outreach.
---

# befday partner outreach playbook

befday.com is a directory where people in Malaysia check which brands give birthday treats before their birthday month starts. Every message gives the brand something first (a listing, accurate redemption steps, visibility) and asks for one small thing.

## Pick the angle

| Angle | When | The one ask | Link the tool adds |
| --- | --- | --- | --- |
| `CLAIM_LISTING` | Brand is already in `uncontactedBrands` with a perk | Check the listing is right, or add what we missed | `befday.com/perks/<slug>` |
| `INVITE_NEW_BRAND` | Brand runs a loyalty app or membership but has no birthday perk on befday, and its slug is not in `contactedSlugs` | Submit a birthday treat at befday.com/partner | `befday.com/partner` |
| `FEATURED_SPONSORSHIP` | Listed brand with a strong perk and a clear marketing team | Ask if they want to be featured in the monthly birthday roundup | `befday.com/perks/<slug>` |

Default to `CLAIM_LISTING`. Only pitch `FEATURED_SPONSORSHIP` on step 2 or 3 of a brand that already got a `CLAIM_LISTING` touch, never as a first touch.

## Email rules

- Subject is 2 to 4 lowercase words. Examples: `your birthday listing`, `zus birthday cake`, `birthday treat steps`.
- Body is under 80 words, plain text, 2 short paragraphs separated by a blank line.
- Do not put links, greetings like "Hi team", or a sign-off in `emailBody`. The template adds the link, the signature, and the opt-out line.
- Open with the specific perk or observation, not with who we are.
- One ask, answerable in one line.
- Run the `unslop` skill over the draft before sending.

### CLAIM_LISTING example

Subject. `your birthday listing`

```text
saw zus coffee gives a free cake during your birthday month. we list it on befday, where people in malaysia check birthday treats before their month starts.

the redemption steps come from your app page. could you check they're still right, or tell us anything we missed?
```

### INVITE_NEW_BRAND example

Subject. `birthday treat for members`

```text
tealive members get points on every drink, but i couldn't find a birthday reward anywhere in the app.

people search befday for birthday treats every month. if you ever run one, you can list it free in two minutes. worth adding?
```

### Follow-up (step 2)

Add one new fact. Never write "just checking in".

```text
one more thing on the zus listing. each perk page links straight to your app store and play store pages, so people who find the cake on befday land on your download page.

happy to update the steps if anything changed.
```

### Breakup (step 3)

```text
i'll stop here so i don't clutter your inbox. the listing stays live and you can update it any time at befday.com/partner.
```

## WhatsApp rules

- Every touch includes `whatsappDraft`, even when email is sent. The operator decides whether to send it.
- Under 60 words. No links except `befday.com` written as plain text.
- Match the brand's own social voice. Use Bahasa Malaysia for local warung, kopitiam, and BM-first brands. Use English for chains and malls.
- Introduce yourself in one clause, because WhatsApp has no subject line.

### English

```text
Hi, I'm Dzul from befday.com. We list Malaysian birthday treats, and your free birthday cake is on our site. Could you check the redemption steps are still correct? Happy to update anything.
```

### Bahasa Malaysia

```text
Hai, saya Dzul dari befday.com. Kami senaraikan birthday treat dari brand Malaysia, dan promo birthday kedai tuan ada dalam senarai kami. Boleh tolong semak cara tebus masih betul? Kalau ada perubahan, saya update terus.
```

## Contacts and compliance

- Use only business channels published by the brand. The brand website, its Facebook or Instagram bio, its Google Business profile, or a named role email on its own domain.
- Every contact needs at least one `sourceUrls` entry showing where it was found.
- Set `emailVerified` to true only after a Treg verification endpoint returns deliverable. Unverified emails go out as WhatsApp only.
- Phone numbers are digits with country code and no plus sign, for example `60123456789`.

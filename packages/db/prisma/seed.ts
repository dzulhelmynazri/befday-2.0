import { createPrismaClient } from "../src/index";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const db = createPrismaClient({
  DATABASE_URL: databaseUrl,
});

const DUMMY_BLOG_POSTS = [
  {
    content: `# The Ultimate Guide to Birthday Freebies in Malaysia (2026)

> Celebrating another trip around the sun? Malaysia is packed with restaurants, cafes, and retailers eager to treat you on your birthday. Here is the curated, verified guide to the best birthday perks you can claim this year.

::alert{title="Pro Tip Before You Start"}
Most brands require you to register for their loyalty program or mobile app at least **24 to 48 hours before your birthday month**. Do not wait until the day of your birthday to sign up!
::

## Top Food & Beverage Perks

Food is always the best way to celebrate. From complimentary desserts to full free meals, these are the standout options:

::perk{brandName="Starbucks Malaysia" badge="FREE" validity="Birthday Month"}
Receive a **complimentary slice of cake** with any handcrafted beverage purchase when you register with the Starbucks Rewards app. Valid for the entire month of your birthday.
::

::perk{brandName="Boost Juice Malaysia" badge="FREE" validity="Birthday Day & +/- 2 Days"}
VIBE Club members get a **free birthday drink**. Simply present your VIBE digital card or scan via the Boost app during your birthday or within 2 days before/after.
::

::perk{brandName="FamilyMart Malaysia" badge="FREE" validity="Birthday Month"}
Enjoy a **free Sofuto ice cream** (any flavor, including Matcha and seasonal selections) when you scan your FamiPort app voucher at the counter.
::

## Entertainment & Activities

Why stop at food? Here is how to keep the fun going without burning a hole in your wallet:

::perk{brandName="GSC Cinemas" badge="FREE" validity="Birthday Month"}
GSC Rewards members receive **two complimentary movie tickets** plus an exclusive combo coupon during their birthday month.
::

::perk{brandName="Red Box Karaoke" badge="FREE" validity="Birthday Month"}
Sing your heart out! Birthday celebrants enjoy **1 free singing session** when accompanied by at least one paying member or guest.
::

## 3 Quick Steps to Claim Everything Seamlessly

1. **Download Apps in Advance**: Download the loyalty apps for your favorite spots during the month before your birthday.
2. **Double Check IC / ID Verification**: Ensure your date of birth is set accurately in your profiles, as most apps lock this field once saved.
3. **Pace Your Redemptions**: With month-long validity across multiple brands, you can spread your celebrations over four weeks.

Happy Birthday, and enjoy all the treats!
`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop&q=80",
    description:
      "Celebrate your special day with free food, drinks, desserts, and cinema tickets. Here is your curated list of verified birthday rewards in Malaysia for 2026.",
    publishedAt: new Date("2026-01-15T08:00:00Z"),
    slug: "ultimate-birthday-freebies-malaysia-2026",
    status: "PUBLISHED" as const,
    tags: ["roundup", "freebies", "food", "malaysia", "lifestyle"],
    title: "The Ultimate Guide to Birthday Freebies in Malaysia (2026)",
  },
  {
    content: `# Top Coffee & Beverage Birthday Treats You Can Claim for Free

> Whether you are looking for an iced latte, fresh juice, or bubble tea, here are the top drink deals to quench your thirst on your birthday.

::alert{title="Membership Prerequisite"}
Nearly all beverage programs require an active account with at least one prior transaction before your birthday month begins.
::

## The Best Coffee & Drink Freebies

Here are the highest-rated beverage perks in Malaysia:

::perk{brandName="ZUS Coffee" badge="FREE" validity="Birthday Month"}
ZUS Coffee rewards its club members with a special **birthday voucher** credited directly to the ZUS App on the first day of your birth month.
::

::perk{brandName="The Coffee Bean & Tea Leaf" badge="FREE" validity="Birthday Month"}
Get a **free slice of cake** or **20% off your total bill** when purchasing any handcrafted beverage during your birthday month via The Caring Cup app.
::

::perk{brandName="Tealive" badge="VOUCHER" validity="Birthday Month"}
Tealive Club members receive birthday points and discounted drink vouchers directly in the Tealive app wallet.
::

## Summary Table

| Brand | Perk | How to Redeem |
| --- | --- | --- |
| Starbucks | Free slice of cake with drink | Starbucks App |
| Boost Juice | Free any drink | VIBE Digital Card |
| ZUS Coffee | Birthday discount voucher | ZUS Coffee App |
| Coffee Bean | Free cake or 20% off bill | The Caring Cup |
`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80",
    description:
      "From Starbucks cakes to Boost Juice smoothies and Zus Coffee vouchers, here are the best beverage perks to claim during your birthday month.",
    publishedAt: new Date("2026-02-01T10:00:00Z"),
    slug: "top-coffee-beverage-birthday-treats",
    status: "PUBLISHED" as const,
    tags: ["beverage", "coffee", "freebies", "tips"],
    title: "Top Coffee & Beverage Birthday Treats You Can Claim for Free",
  },
  {
    content: `# How to Maximize Your Birthday Month Perks: The Pro Strategy Guide

> Claiming birthday rewards should be fun, not stressful. With dozens of offers expiring at different times, here is how to organize your calendar like a pro.

## Step 1: The Pre-Birthday Audit (30 Days Before)

Most redemption failures happen because users register too late. Follow this checklist:

1. Verify birth dates on **Touch 'n Go eWallet**, **Grab**, and loyalty cards.
2. Confirm email subscriptions are active so coupon codes do not land in your spam folder.
3. Group your shopping apps into a dedicated "Birthdays" folder on your home screen.

::alert{title="Avoid the Last-Day Rush"}
Some vouchers expire on your exact birth date, while others last until the last day of the calendar month. Always check the terms & conditions in each app.
::

## Step 2: Categorize by Expiry Type

- **Exact Day Only**: E.g., specific amusement parks and hotpot restaurants.
- **Birthday Week**: E.g., 3 days before to 3 days after.
- **Entire Month**: E.g., Starbucks, FamilyMart, and fashion retailers like Uniqlo.

## Step 3: Plan With Friends

Celebrate together! Group dining perks often require at least one accompanying paying diner to unlock the free birthday buffet or main course.
`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80",
    description:
      "A strategic timeline guide to claiming birthday rewards without spending a fortune. Learn when to register, how to organize apps, and avoid expiry traps.",
    publishedAt: new Date("2026-02-15T09:30:00Z"),
    slug: "how-to-maximize-birthday-month-perks",
    status: "PUBLISHED" as const,
    tags: ["guide", "strategy", "savings"],
    title: "How to Maximize Your Birthday Month Perks: The Pro Strategy Guide",
  },
  {
    content: `# Cinema, Karaoke & Theme Parks: Best Birthday Freebies in Malaysia

> Birthdays are made for creating memories. Explore the top entertainment and leisure birthday perks across Malaysia for 2026.

## Cinema Rewards

Catch the latest blockbuster for free:

::perk{brandName="TGV Cinemas" badge="FREE" validity="Birthday Month"}
MovieClub members get **two free movie tickets** and a regular popcorn combo during their birthday month.
::

::perk{brandName="GSC Cinemas" badge="FREE" validity="Birthday Month"}
GSC Rewards members enjoy **two complimentary tickets** for selected movies and special birthday concession treats.
::

## Leisure & Activities

::perk{brandName="Sunway Lagoon" badge="VOUCHER" validity="Birthday Month"}
Annual Passport and loyalty members enjoy discounted ticket passes and VIP entry benefits during their birthday period.
::

::alert{title="ID Verification Required"}
Remember to bring your MyKad or Passport for physical counter verification when collecting physical cinema tickets or theme park wristbands.
::
`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
    description:
      "Looking for fun activities on your birthday? Discover free movie tickets at GSC & TGV, karaoke sessions, and theme park discounts in Malaysia.",
    publishedAt: new Date("2026-03-01T12:00:00Z"),
    slug: "entertainment-leisure-birthday-freebies",
    status: "PUBLISHED" as const,
    tags: ["entertainment", "movies", "lifestyle"],
    title: "Cinema, Karaoke & Theme Parks: Best Birthday Freebies in Malaysia",
  },
];

const seed = async () => {
  console.log("Seeding blog posts...");

  const results = await Promise.all(
    DUMMY_BLOG_POSTS.map((post) =>
      db.blogPost.upsert({
        create: post,
        update: {
          content: post.content,
          coverImageUrl: post.coverImageUrl,
          description: post.description,
          publishedAt: post.publishedAt,
          status: post.status,
          tags: post.tags,
          title: post.title,
        },
        where: { slug: post.slug },
      })
    )
  );

  for (const upserted of results) {
    console.log(`Seeded post: ${upserted.title} (/blog/${upserted.slug})`);
  }

  console.log("Successfully seeded 4 blog posts!");
};

try {
  await seed();
} catch (error) {
  console.error("Failed to seed blog posts:", error);
  process.exit(1);
} finally {
  await db.$disconnect();
}

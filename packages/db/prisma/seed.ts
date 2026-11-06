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

::grid
::perk{brandName="Starbucks Malaysia" badge="FREE" logoUrl="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&auto=format&fit=crop&q=80"}
Receive a **complimentary slice of cake** with any handcrafted beverage purchase when you register with the Starbucks Rewards app. Valid for the entire month of your birthday.
::

::perk{brandName="Boost Juice Malaysia" badge="FREE" logoUrl="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=100&auto=format&fit=crop&q=80"}
VIBE Club members get a **free birthday drink**. Simply present your VIBE digital card or scan via the Boost app during your birthday or within 2 days before/after.
::

::perk{brandName="FamilyMart Malaysia" badge="FREE" logoUrl="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&auto=format&fit=crop&q=80"}
Enjoy a **free Sofuto ice cream** (any flavor, including Matcha and seasonal selections) when you scan your FamiPort app voucher at the counter.
::
::

## Entertainment & Activities

Why stop at food? Here is how to keep the fun going without burning a hole in your wallet:

::grid
::perk{brandName="GSC Cinemas" badge="FREE" logoUrl="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&auto=format&fit=crop&q=80"}
GSC Rewards members receive **two complimentary movie tickets** plus an exclusive combo coupon during their birthday month.
::

::perk{brandName="Red Box Karaoke" badge="FREE" logoUrl="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format&fit=crop&q=80"}
Sing your heart out! Birthday celebrants enjoy **1 free singing session** when accompanied by at least one paying member or guest.
::
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

::grid
::perk{brandName="ZUS Coffee" badge="FREE" logoUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&auto=format&fit=crop&q=80"}
ZUS Coffee rewards its club members with a special **birthday voucher** credited directly to the ZUS App on the first day of your birth month.
::

::perk{brandName="The Coffee Bean & Tea Leaf" badge="FREE" logoUrl="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80"}
Get a **free slice of cake** or **20% off your total bill** when purchasing any handcrafted beverage during your birthday month via The Caring Cup app.
::

::perk{brandName="Tealive" badge="VOUCHER" logoUrl="https://images.unsplash.com/photo-1558857563-b371033873b8?w=100&auto=format&fit=crop&q=80"}
Tealive Club members receive birthday points and discounted drink vouchers directly in the Tealive app wallet.
::
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

::grid
::perk{brandName="TGV Cinemas" badge="FREE" logoUrl="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100&auto=format&fit=crop&q=80"}
MovieClub members get **two free movie tickets** and a regular popcorn combo during their birthday month.
::

::perk{brandName="GSC Cinemas" badge="FREE" logoUrl="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&auto=format&fit=crop&q=80"}
GSC Rewards members enjoy **two complimentary tickets** for selected movies and special birthday concession treats.
::
::

## Leisure & Activities

::perk{brandName="Sunway Lagoon" badge="VOUCHER" logoUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80"}
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

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const BRANDS_WITH_PERKS = [
  {
    description:
      "Global coffeehouse chain with a rewards app offering member birthday treats.",
    googleMapUrl: mapSearch("Starbucks Malaysia"),
    logoUrl: favicon("starbucks.com.my"),
    name: "Starbucks Malaysia",
    perk: {
      badge: "FREE" as const,
      headline: "Free Birthday Cake",
      howToRedeem: [
        "Register with the Starbucks Rewards app before your birthday month.",
        "Purchase any handcrafted beverage and redeem the reward in-app.",
      ],
      perksList: [
        "Complimentary slice of cake with any handcrafted beverage purchase.",
      ],
      sourceUrls: ["https://www.starbucks.com.my/rewards"],
      validity: "Entire birthday month",
    },
    slug: "starbucks-malaysia",
    websiteUrl: "https://www.starbucks.com.my",
  },
  {
    description:
      "Smoothie and juice bar chain with the VIBE Club loyalty programme.",
    googleMapUrl: mapSearch("Boost Juice Malaysia"),
    logoUrl: favicon("boostjuice.com.my"),
    name: "Boost Juice Malaysia",
    perk: {
      badge: "FREE" as const,
      headline: "Free Birthday Juice or Smoothie",
      howToRedeem: [
        "Join VIBE Club via the Boost Juice app.",
        "Present your digital card or scan via the app at the counter.",
      ],
      perksList: ["Free birthday drink for VIBE Club members."],
      sourceUrls: ["https://www.boostjuice.com.my"],
      validity: "Birthday +/- 2 days",
    },
    slug: "boost-juice-malaysia",
    websiteUrl: "https://www.boostjuice.com.my",
  },
  {
    description:
      "Japanese convenience store chain with the FamiPort loyalty app.",
    googleMapUrl: mapSearch("FamilyMart Malaysia"),
    logoUrl: favicon("familymart.com.my"),
    name: "FamilyMart Malaysia",
    perk: {
      badge: "FREE" as const,
      headline: "Free Sofuto Ice Cream",
      howToRedeem: [
        "Register on the FamiPort app.",
        "Redeem the birthday voucher at any FamilyMart outlet.",
      ],
      perksList: ["A free Sofuto soft-serve ice cream in any flavour."],
      sourceUrls: ["https://www.familymart.com.my"],
      validity: "Entire birthday month",
    },
    slug: "familymart-malaysia",
    websiteUrl: "https://www.familymart.com.my",
  },
  {
    description: "Cinema chain with the MovieClub membership programme.",
    googleMapUrl: mapSearch("TGV Cinemas"),
    logoUrl: favicon("tgv.com.my"),
    name: "TGV Cinemas",
    perk: {
      badge: "FREE" as const,
      headline: "2 Free Movie Tickets & Popcorn",
      howToRedeem: [
        "Sign up for MovieClub on the TGV app or website.",
        "Redeem the birthday reward from your account during your birthday month.",
      ],
      perksList: ["Two free movie tickets.", "A regular popcorn combo."],
      sourceUrls: ["https://www.tgv.com.my"],
      validity: "Entire birthday month",
    },
    slug: "tgv-cinemas",
    websiteUrl: "https://www.tgv.com.my",
  },
  {
    description: "Golden Screen Cinemas, with the GSC Rewards programme.",
    googleMapUrl: mapSearch("GSC Cinemas"),
    logoUrl: favicon("gsc.com.my"),
    name: "GSC Cinemas",
    perk: {
      badge: "FREE" as const,
      headline: "2 Free Cinema Tickets",
      howToRedeem: [
        "Register for GSC Rewards on the GSC app.",
        "Redeem the birthday e-vouchers from the app.",
      ],
      perksList: [
        "Two complimentary tickets for selected movies.",
        "Exclusive combo coupons.",
      ],
      sourceUrls: ["https://www.gsc.com.my"],
      validity: "Entire birthday month",
    },
    slug: "gsc-cinemas",
    websiteUrl: "https://www.gsc.com.my",
  },
  {
    description:
      "Theme park in Selangor with loyalty and annual passport memberships.",
    googleMapUrl: mapSearch("Sunway Lagoon"),
    logoUrl: favicon("sunwaylagoon.com"),
    name: "Sunway Lagoon",
    perk: {
      badge: "VOUCHER" as const,
      headline: "Theme Park Birthday Passes",
      howToRedeem: [
        "Become a loyalty or passport member.",
        "Present proof of birthday and membership at the ticketing counter.",
      ],
      perksList: [
        "Discounted ticket passes.",
        "Merchandise savings and VIP benefits.",
      ],
      sourceUrls: ["https://sunwaylagoon.com"],
      validity: "Birthday period",
    },
    slug: "sunway-lagoon",
    websiteUrl: "https://sunwaylagoon.com",
  },
];

const seedPerks = async () => {
  console.log("Seeding brands and perks...");

  const results = await Promise.all(
    BRANDS_WITH_PERKS.map(async ({ perk, ...brand }) => {
      const upserted = await db.brand.upsert({
        create: brand,
        update: brand,
        where: { slug: brand.slug },
      });

      // Replace the brand's perks so re-running the seed stays idempotent.
      await db.$transaction([
        db.birthdayPerk.deleteMany({ where: { brandId: upserted.id } }),
        db.birthdayPerk.create({
          data: { ...perk, brandId: upserted.id, status: "PUBLISHED" },
        }),
      ]);

      return upserted;
    })
  );

  for (const upserted of results) {
    console.log(`Seeded brand: ${upserted.name}`);
  }
};

const seed = async () => {
  await seedPerks();

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

  console.log(`Successfully seeded ${results.length} blog posts!`);
};

try {
  await seed();
} catch (error) {
  console.error("Failed to seed database:", error);
  process.exit(1);
} finally {
  await db.$disconnect();
}

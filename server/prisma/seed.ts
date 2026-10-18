import "dotenv/config";
import bcrypt from "bcryptjs";
import { JobStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleJobs = [
  {
    id: "seed-application-1",
    company: "Northstar Labs",
    position: "Frontend Engineer",
    location: "Remote",
    jobUrl: "https://example.com/jobs/frontend-engineer",
    salary: "$110,000 - $135,000",
    status: JobStatus.APPLIED,
    appliedDate: new Date("2026-01-12T00:00:00.000Z"),
    followUpDate: new Date("2026-01-19T00:00:00.000Z"),
    notes: "Applied through the company careers page."
  },
  {
    id: "seed-application-2",
    company: "Brightside Health",
    position: "Product Designer",
    location: "New York, NY",
    jobUrl: "https://example.com/jobs/product-designer",
    salary: "$95,000 - $120,000",
    status: JobStatus.INTERVIEW,
    appliedDate: new Date("2026-01-18T00:00:00.000Z"),
    followUpDate: null,
    notes: "Recruiter screen completed; technical interview upcoming."
  },
  {
    id: "seed-application-3",
    company: "Atlas Commerce",
    position: "Full Stack Developer",
    location: "Hybrid",
    jobUrl: "https://example.com/jobs/full-stack",
    salary: "$120,000 - $150,000",
    status: JobStatus.OFFER,
    appliedDate: new Date("2026-01-23T00:00:00.000Z"),
    followUpDate: null,
    notes: "Reviewing the offer."
  },
  {
    id: "seed-application-4",
    company: "Pinecone Systems",
    position: "Software Engineer",
    location: "Remote",
    jobUrl: null,
    salary: null,
    status: JobStatus.REJECTED,
    appliedDate: new Date("2026-02-02T00:00:00.000Z"),
    followUpDate: null,
    notes: null
  },
  {
    id: "seed-application-5",
    company: "Orbit Finance",
    position: "Backend Engineer",
    location: "Austin, TX",
    jobUrl: "https://example.com/jobs/backend-engineer",
    salary: "$125,000 - $155,000",
    status: JobStatus.APPLIED,
    appliedDate: new Date("2026-02-11T00:00:00.000Z"),
    followUpDate: new Date("2026-02-18T00:00:00.000Z"),
    notes: "Follow up with the hiring manager next week."
  }
];

const seed = async () => {
  const name = process.env.SEED_NAME ?? "Demo User";
  const email = (process.env.SEED_EMAIL ?? "demo@jobtracker.local").toLowerCase();
  const password = process.env.SEED_PASSWORD ?? "Demo12345";
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashedPassword },
    create: { name, email, password: hashedPassword }
  });

  await Promise.all(
    sampleJobs.map(({ id, ...data }) =>
      prisma.job.upsert({
        where: { id },
        update: { ...data, userId: user.id },
        create: { id, ...data, userId: user.id }
      })
    )
  );

  console.log(`Seeded ${sampleJobs.length} sample jobs for ${email}`);
};

seed()
  .catch((error: unknown) => {
    console.error("Database seeding failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { JobStatus } from "@prisma/client";
import { prisma } from "../utils/prisma";

const statuses = Object.values(JobStatus);

export const getJobStats = async (userId: string) => {
  const [total, groupedStatuses, jobsByMonth] = await Promise.all([
    prisma.job.count({ where: { userId } }),
    prisma.job.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true }
    }),
    prisma.job.findMany({
      where: { userId },
      select: { appliedDate: true },
      orderBy: { appliedDate: "asc" }
    })
  ]);

  const statusCounts = Object.fromEntries(statuses.map((status) => [status, 0])) as Record<
    JobStatus,
    number
  >;
  groupedStatuses.forEach(({ status, _count }) => {
    statusCounts[status] = _count._all;
  });

  const monthlyCounts = new Map<string, number>();
  jobsByMonth.forEach(({ appliedDate }) => {
    const month = appliedDate.toISOString().slice(0, 7);
    monthlyCounts.set(month, (monthlyCounts.get(month) ?? 0) + 1);
  });

  const interviewsAndOffers = statusCounts.INTERVIEW + statusCounts.OFFER;

  return {
    total,
    byStatus: statusCounts,
    applicationsPerMonth: Array.from(monthlyCounts, ([month, count]) => ({ month, count })),
    interviewRate: total === 0 ? 0 : Number(((interviewsAndOffers / total) * 100).toFixed(1)),
    offerRate: total === 0 ? 0 : Number(((statusCounts.OFFER / total) * 100).toFixed(1))
  };
};

import {
  computeAverage,
  EnrollmentStatus
} from "./gradeUtils";

import getStatus from "./gradeUtils";

interface Enrollee {
  name: string;
  prelim: number;
  midterm: number;
  final: number;
}

type EligibilityReport = {
  name: string;
  average: number;
  status: EnrollmentStatus;
  remarks?: string;
};

const enrollees: Enrollee[] = [
  {
    name: "Ana Cruz",
    prelim: 85,
    midterm: 90,
    final: 88
  },
  {
    name: "Bea Santos",
    prelim: 70,
    midterm: 65,
    final: 60
  },
  {
    name: "Cid Reyes",
    prelim: 95,
    midterm: 92,
    final: 97
  },
  {
    name: "Dex Garcia",
    prelim: 60,
    midterm: 55,
    final: 50
  },
  {
    name: "Eli Ramos",
    prelim: 78,
    midterm: 80,
    final: 76
  }
];

let batchId: string | number = "BATCH-001";

function showBatchId(id: string | number): string {
  if (typeof id === "string") {
    return `String Batch ID: ${id}`;
  }

  return `Number Batch ID: ${id}`;
}

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);

    return groups;
  }, {} as Record<string, T[]>);
}

function getEnrollees(): Promise<Enrollee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(enrollees);
    }, 1000);
  });
}

async function main(): Promise<void> {
  try {
    console.log("Connecting to registrar API...");
    console.log(showBatchId(batchId));

    const data = await getEnrollees();

    const reports: EligibilityReport[] = data.map(
      (enrollee): EligibilityReport => {
        const average = computeAverage(
          enrollee.prelim,
          enrollee.midterm,
          enrollee.final
        );

        const status = getStatus(average);

        return {
          name: enrollee.name,
          average,
          status,
          ...(status === EnrollmentStatus.Probation
            ? { remarks: "Needs consultation" }
            : {})
        };
      }
    );

    const classAverage =
      reports.reduce((sum, report) => {
        return sum + report.average;
      }, 0) / reports.length;

    const groupedReports = groupBy(
      reports,
      (report) => report.status
    );

    const passingCount =
      groupedReports[EnrollmentStatus.Passing]?.length ?? 0;

    console.log(
      "\n=== IT313 Enrollment Eligibility Report (TypeScript) ==="
    );

    reports.forEach((report) => {
      const remarks = report.remarks
        ? ` - ${report.remarks}`
        : "";

      console.log(
        `${report.name} - Average: ${report.average.toFixed(
          2
        )} - ${report.status}${remarks}`
      );
    });

    console.log(`Class Average: ${classAverage.toFixed(2)}`);

    console.log(
      `Passing: ${passingCount} / ${reports.length}`
    );
  } catch (error) {
    console.error(
      "Failed to connect to registrar API:",
      error
    );
  }
}

main();
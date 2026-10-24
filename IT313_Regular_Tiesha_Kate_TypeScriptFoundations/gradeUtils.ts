export enum EnrollmentStatus {
  Passing = "PASSING",
  Probation = "PROBATION"
}

export const computeAverage = (
  prelim: number,
  midterm: number,
  final: number
): number => {
  return (prelim + midterm + final) / 3;
};

const getStatus = (average: number): EnrollmentStatus => {
  if (average >= 75) {
    return EnrollmentStatus.Passing;
  }

  return EnrollmentStatus.Probation;
};

export default getStatus;
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma-client/client.ts";
import { GradeValue } from "../src/generated/prisma-client/enums.ts";

const prisma = new PrismaClient();

async function ensureBaseData() {
  const subjectCount = await prisma.subject.count();
  if (subjectCount === 0) {
    await prisma.subject.createMany({
      data: [
        { name: "Mathematics", level: "A" },
        { name: "Science", level: "A" },
        { name: "History", level: "B" },
        { name: "Physics", level: "B" },
        { name: "Chemistry", level: "C" },
      ],
    });
    console.log("Inserted subjects.");
  }

  const studentCount = await prisma.student.count();
  if (studentCount === 0) {
    await prisma.student.createMany({
      data: [
        { firstName: "Alice", lastName: "Anders", personNr: 10001, year: 1 },
        { firstName: "Bob", lastName: "Brown", personNr: 10002, year: 2 },
        { firstName: "Charlie", lastName: "Clark", personNr: 10003, year: 3 },
      ],
    });
    console.log("Inserted students.");
  }
}

async function seedGrades() {
  const levelsByYear = ["A", "B", "C"];
  const students = await prisma.student.findMany();
  const subjects = await prisma.subject.findMany();

  console.log(`Students: ${students.length}, Subjects: ${subjects.length}`);

  let created = 0;
  for (const student of students) {
    const maxYear = student.year ?? 3; // default if null
    for (let yr = 1; yr <= maxYear; yr++) {
      const level = levelsByYear[yr - 1];
      const levelSubjects = subjects.filter((s) => s.level === level);
      for (const subject of levelSubjects) {
        const randomGrade =
          Object.values(GradeValue)[
            Math.floor(Math.random() * Object.values(GradeValue).length)
          ];
        await prisma.grade.create({
          data: {
            studentId: student.id,
            subjectId: subject.id,
            grade: randomGrade,
            year: yr,
          },
        });
        created++;
      }
    }
  }
  console.log(`Grades created: ${created}`);
}

async function run() {
  try {
    console.log(
      "DATABASE_URL:",
      process.env.DATABASE_URL?.slice(0, 40) + "..."
    );
    await ensureBaseData();
    await seedGrades();
  } catch (e) {
    console.error("Seed error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

run();

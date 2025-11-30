import { describe, expect, beforeAll, afterAll, test } from "@jest/globals";
import supertest from "supertest";
import express from "express";
import viewGradesRoute from "../../../src/routes/adminRoutes/viewGrades.js";
import { PrismaClient } from "../../../src/generated/prisma-client/client.js";

const app = express();
app.use(express.json());
app.use("/admin/grades", viewGradesRoute);
const request = supertest(app);
const prisma = new PrismaClient();

describe("View Grades Route Integration Tests", () => {
  let testSubject: any;
  let testStudent: any;
  let testGrade: any;

  beforeAll(async () => {
    // Create or find existing test subject
    testSubject = await prisma.subject.findFirst({
      where: { name: "math", level: "a" },
    });

    if (!testSubject) {
      testSubject = await prisma.subject.create({
        data: {
          name: "math",
          level: "a",
        },
      });
    }

    // test student
    testStudent = await prisma.student.upsert({
      where: { email: "test.viewgrades@school.com" },
      update: {},
      create: {
        firstName: "Test",
        lastName: "Student",
        email: "test.viewgrades@school.com",
        personNr: "050101-1234",
        year: 1,
      },
    });

    // test grade
    testGrade = await prisma.grade.create({
      data: {
        grade: "A",
        year: 1,
        studentId: testStudent.id,
        subjectId: testSubject.id,
      },
    });
  });

  afterAll(async () => {
    if (testGrade) {
      await prisma.grade
        .delete({ where: { id: testGrade.id } })
        .catch(() => {});
    }
    if (testStudent) {
      await prisma.student
        .delete({ where: { id: testStudent.id } })
        .catch(() => {});
    }
    await prisma.$disconnect();
  });

  test("GET /admin/grades returns all courses with correct format", async () => {
    const res = await request.get("/admin/grades");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /admin/grades/:course/:year returns 422 for invalid parameters", async () => {
    // Invalid year
    const res1 = await request.get("/admin/grades/matha/999");
    expect(res1.status).toBe(422);

    // Invalid course format
    const res2 = await request.get("/admin/grades/MATH123/1");
    expect(res2.status).toBe(422);

    // Invalid level
    const res3 = await request.get("/admin/grades/mathz/1");
    expect(res3.status).toBe(422);
  });

  test("GET /admin/grades/:course/:year performs efficiently", async () => {
    const startTime = performance.now();
    const res = await request.get("/admin/grades/matha/1");
    const endTime = performance.now();

    expect(res.status).toBe(200);
    expect(endTime - startTime).toBeLessThan(1000);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

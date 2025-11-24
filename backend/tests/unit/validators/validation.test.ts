import { describe, expect, test } from "@jest/globals";
import {
  personNrSchema,
  firstNameSchema,
  studentSchema,
  gradeSchema,
  subjectSchema,
  postGradeSchema,
} from "../../../src/validators/valdation.js";

describe("Schema Validation Tests", () => {
  // Person number format validation
  test("personNrSchema accepts correct format", () => {
    expect(personNrSchema.safeParse("990101-1234").success).toBe(true);
  });

  test("personNrSchema rejects invalid format", () => {
    expect(personNrSchema.safeParse("123-45").success).toBe(false);
  });
  // Student schema validation
  test("studentSchema accepts valid student object", () => {
    const validStudent = {
      id: 1,
      firstName: "Israt",
      lastName: "Jahan",
      personNr: "990101-1234",
      year: 2,
      phone: null,
      email: "israt@gmail.com",
      adress: "Fisksätra 123",
    };
    expect(studentSchema.safeParse(validStudent).success).toBe(true);
  });
  test("studentSchema rejects invalid student object", () => {
    const invalidStudent = {
      id: 1,
      firstName: "I", // too short
      lastName: "Jahan",
      personNr: "990101-1234",
      year: 2,
      phone: null,
      email: "israt@gmail.com",
      adress: "Fisksätra 123",
    };
    expect(studentSchema.safeParse(invalidStudent).success).toBe(false);
  });
  // Grade schema validation
  test("gradeSchema accepts valid grade object", () => {
    const validGrade = {
      id: 1,
      studentId: 1,
      grade: "A",
      year: 2,
      subjectId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(gradeSchema.safeParse(validGrade).success).toBe(true);
  });

  test("gradeSchema rejects invalid grade object", () => {
    const invalidGrade = {
      id: 1,
      studentId: 1,
      grade: "G", // invalid grade
    };
    expect(gradeSchema.safeParse(invalidGrade).success).toBe(false);
  });
});

import { z } from "zod";
import { faker } from '@faker-js/faker';

const patientSchema = z.object({
    username: z.string(),
    password: z.string(),
    fullName: z.string(),
    phoneNumber: z.string(),
    gender: z.string(),
    age: z.number(),
    has_tb_vaccine: z.boolean(),
    has_yellow_fever_vaccine: z.boolean(),
  });

export type PatientData = z.infer<typeof patientSchema>

export const getOrFakePatientData = (username: string): PatientData => {
    try {
        return patientSchema.parse(JSON.parse(localStorage.getItem(username)!));
    } catch (error) {
    }
    // @dev: changes username and password on create account
    return {
        username: faker.internet.displayName(),
        password: faker.internet.password(),
        fullName: faker.person.fullName(),
        phoneNumber: faker.phone.number(),
        gender: faker.person.gender(),
        age: faker.number.int({min: 14, max: 21}),
        has_tb_vaccine: faker.datatype.boolean(),
        has_yellow_fever_vaccine: faker.datatype.boolean()
    }
}
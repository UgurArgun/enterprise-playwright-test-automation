import * as fs from "fs";
import * as createCsvWriter from "csv-writer";
import path from "path";

// Define the type for the user data
interface UserData {
  name: string;
  email: string;
  username: string;
  phone: string;
  age: number;
  address: string;
}

// Dynamic import helper for @faker-js/faker
const getFaker = async () => (await import("@faker-js/faker")).faker;

// Function to generate fake user data
const generateUserData = async (): Promise<UserData> => {
  const faker = await getFaker();
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    phone: faker.phone.number(),
    age: faker.number.int({ min: 18, max: 99 }),
    address: faker.location.country(),
  };
};

// Function to generate an array of fake user data
export const generateTestData = async (numRecords: number): Promise<UserData[]> => {
  const testData: UserData[] = [];
  for (let i = 0; i < numRecords; i++) {
    testData.push(await generateUserData());
  }
  return testData;
};

const currentDir = __dirname;
// Go one level above (back to 'src')
const srcDir = path.resolve(currentDir, "..");

// Change to 'config' folder
const testdataDir = path.resolve(srcDir, "testdata");

// Function to export data to JSON file
export const exportToJson = (data: UserData[], fileName: string) => {
  const outPath = path.join(testdataDir, fileName);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`Data exported to JSON file: ${outPath}`);
};

// Function to export data to CSV file
export const exportToCsv = (data: UserData[], fileName: string) => {
  const outPath = path.join(testdataDir, fileName);
  const csvWriter = createCsvWriter.createObjectCsvWriter({
    path: outPath,
    header: [
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "username", title: "Username" },
      { id: "phone", title: "Phone" },
      { id: "age", title: "Age" },
      { id: "address", title: "Address" },
    ],
  });

  csvWriter.writeRecords(data).then(() => {
    console.log(`Data exported to CSV file: ${outPath}`);
  });
};

// Generate test data
// (now async) example:
// (async () => {
//   const testData = await generateTestData(3);
//   exportToJson(testData, 'testData_en.json');
//   exportToCsv(testData, 'testData_en.csv');
// })();

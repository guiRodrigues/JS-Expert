const { error } = require("./src/constants");
const File = require("./src/file");
const { rejects, deepStrictEqual } = require("assert");

(async () => {
  {
    const filePath = "./mocks/emptyFile-invalid.csv";
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await rejects(result, rejection);
  }
  {
    const filePath = "./mocks/fourItems-invalid.csv";
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await rejects(result, rejection);
  }
  {
    const filePath = "./mocks/threeItems-valid.csv";
    const result = await File.csvToJson(filePath);
    const expected = [
      {
        "name": "Person A",
        "id": 1,
        "profession": "Profession X",
        "birthDay": 2001
      },
      {
        "name": "Person B",
        "id": 2,
        "profession": "Profession Y",
        "birthDay": 1981
      },
      {
        "name": "Person C",
        "id": 3,
        "profession": "Profession W",
        "birthDay": 1981
      }
    ]

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();
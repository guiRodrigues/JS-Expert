const { readFile } = require("fs/promises");
const { join } = require("path");
const { error } = require("./constants");
const User = require("./user");

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"]
};

class File {
  static async csvToJson(filePath) {
    const content = await this.getFileContent(filePath);
    const validation = this.isValid(content);

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const users = this.parseCSVToJSON(content);

    return users;
  }

  static async getFileContent(filePath) {
    // const filename = join(__dirname, filePath);
    return (await readFile(filePath)).toString("utf8");
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const lines = csvString.split("\n");
    const [header, ...fileWithotHeaders] = lines;
    const isHeaderValid = header === options.fields.join(",");

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      };
    }

    const isContentLengthAccepted = (
      fileWithotHeaders.length > 0 &&
      fileWithotHeaders.length <= options.maxLines
    );

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      };
    }

    return { valid: true };
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split("\n");
    const firstLine = lines.shift(); // remove first line of Lines, Lines = instances
    const header = firstLine.split(",");
    const users = lines.map(line => {
      const columns = line.split(",");
      const user = {};
      for (const index in columns) {
        user[header[index]] = columns[index];
      }
      return new User(user);
    });

    return users;
  }
}

(async () => {
  // const result = await File.csvToJson("./../mocks/threeItems-valid.csv");
  // const result = await File.csvToJson("./../mocks/fourItems-invalid.csv");
  // const result = await File.csvToJson("./../mocks/invalidHeader-invalid.csv");

  // console.log("result", result);
})();

module.exports = File;

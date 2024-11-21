import xlsx from "node-xlsx";

// const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/myFile.xlsx`));
// Parse a file

console.log(__dirname);

export function getFilterCode() {
  try {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}\\..\\..\\data\\exist.xlsx`
    );
    const sheet = workSheetsFromFile[0];
    const data = sheet.data;
    const map = {};
    data.forEach(function (current, index) {
      map[current[0].trim()] = current[0];
    });
    return map;
  } catch (e) {
    return null;
  }
}

export function downFilter() {
  try {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}\\..\\..\\data\\create.xlsx`
    );
    const sheet = workSheetsFromFile[0];
    const data = sheet.data;
    const map = {};
    data.forEach(function (current, index) {
      map[String(current[0]).trim()] = current[0];
    });
    return map;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getSkuIds() {
  try {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}\\..\\..\\data\\skuIds.xlsx`
    );
    const sheet = workSheetsFromFile[0];
    const data = sheet.data;

    const array = data.map(function (current, index) {
      return current[0];
    });
    return array;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getBrands() {
  try {
    const workSheetsFromFile = xlsx.parse(
      `${__dirname}\\..\\..\\excel\\brands.xlsx`
    );
    const sheet = workSheetsFromFile[0];
    const data = sheet.data;

    const array = data.map(function (current, index) {
      return current[0];
    });
    return array;
  } catch (e) {
    console.error(e);
    return null;
  }
}

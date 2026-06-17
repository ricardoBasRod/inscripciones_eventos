const SPREADSHEET_ID = "1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs";
const SHEET_NAME = "";
const SECRET = "cambia-este-token";

function doGet(e) {
  const auth = validateSecret_(e && e.parameter ? e.parameter.secret : "");
  if (!auth.success) {
    return json_(auth);
  }

  const sheet = getTargetSheet_();
  const values = sheet.getDataRange().getDisplayValues();
  const columns = values.length ? values[0].map(String) : [];
  const data = values.slice(1).map(row => {
    const record = {};
    columns.forEach((column, index) => {
      record[column] = row[index] || "";
    });
    return record;
  });

  return json_({
    success: true,
    columns,
    data,
    total: data.length,
  });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : "{}");
    const auth = validateSecret_(body.secret);
    if (!auth.success) {
      return json_(auth);
    }

    const columns = Array.isArray(body.columns) ? body.columns.map(String) : [];
    const data = Array.isArray(body.data) ? body.data : [];
    if (!columns.length) {
      return json_({ success: false, error: "No se recibieron columnas." });
    }

    const sheet = getTargetSheet_();
    const rows = data.map(record => columns.map(column => normalizeCell_(record[column])));

    sheet.clearContents();
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    if (rows.length) {
      sheet.getRange(2, 1, rows.length, columns.length).setValues(rows);
    }

    return json_({
      success: true,
      total: rows.length,
    });
  } catch (error) {
    return json_({
      success: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function getTargetSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (SHEET_NAME) {
    const namedSheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!namedSheet) {
      throw new Error(`No existe la hoja "${SHEET_NAME}".`);
    }
    return namedSheet;
  }
  return spreadsheet.getSheets()[0];
}

function validateSecret_(secret) {
  if (SECRET && secret !== SECRET) {
    return { success: false, error: "Unauthorized" };
  }
  return { success: true };
}

function normalizeCell_(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

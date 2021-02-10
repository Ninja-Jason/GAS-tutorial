// Client ID and API key from the Developer Console
var CLIENT_ID =
  "1001095126244-likjeu4upu9i0h9s4d9dr5t0qo0vaaps.apps.googleusercontent.com";
var API_KEY = "AIzaSyCjyrWmifQTC4Ixo2eXGzo8ax4Qj88rZc8";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
// var SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";
// var SCOPES = "https://www.googleapis.com/auth/drive.file";
var SCOPES = "https://www.googleapis.com/auth/drive";

const filesFoldersHeadings = ["id", "name", "mime type", "operations"];
var table1currentlyDisplaying = "nothing";
var currentSheetId = "";
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

var authorizeButton = document.getElementById("authorizeButton");
var signoutButton = document.getElementById("signoutButton");
var listFilesButton = document.getElementById("listFilesButton");
var listFoldersButton = document.getElementById("listFoldersButton");
var authorizedComponents = document.getElementById("authorizedComponents");
var listSpreadsheetsButton = document.getElementById("listSpreadsheetsButton");
var createFolderButton = document.getElementById("createFolderButton");
var createSpreadsheetButton = document.getElementById(
  "createSpreadsheetButton"
);
var createInput = document.getElementById("createInput");
var createNewItemButton = document.getElementById("createNewItemButton");
var removeShareButton = document.getElementById("removeShareButton");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        listFilesButton.onclick = handleListFilesClick;
        listFoldersButton.onclick = handleListFoldersClick;
        listSpreadsheetsButton.onclick = handleListSpreadsheetsClick;
        createFolderButton.onclick = handleCreateFolderClick;
        createSpreadsheetButton.onclick = handleCreateSpreadsheetClick;
        createNewItemButton.onclick = handleCreateNewItemClick;
        removeShareButton.onclick = handleRemoveShareFile;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    authorizedComponents.style.display = "block";
  } else {
    authorizeButton.style.display = "block";
    authorizedComponents.style.display = "none";
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
  var pre = document.getElementById("content");
  var node = document.createElement("div");
  var textContent = document.createTextNode(message);
  node.appendChild(textContent);
  pre.appendChild(node);
}

// table 1
function displayTable1() {
  document.getElementById("myTable1").style.display = "table";
}

function setTable1Caption(text) {
  var caption = document.getElementById("myTable1Caption");
  caption.innerHTML = text;
}

function setTable1Headings(headings) {
  var thead = document.getElementById("myTable1Head");
  let theadInnerHtml = document.createElement("tr");
  headings.forEach((heading) => {
    theadInnerHtml.innerHTML += `<th>${heading}</th>`;
  });
  thead.innerHTML = theadInnerHtml.innerHTML;
}

function setTable1RowsForFilesFolders(files) {
  var tbody = document.getElementById("myTable1Body");
  let tbodyInnerHtml = ``;
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      tbodyInnerHtml += `<tr>`;
      tbodyInnerHtml += `<td>${file.id}</td>`;
      tbodyInnerHtml += `<td>${file.name}</td>`;
      tbodyInnerHtml += `<td>${file.mimeType}</td>`;
      // tbodyInnerHtml += `<td><button onclick="${
      //   file.mimeType === "application/vnd.google-apps.spreadsheet"
      //     ? `handleDisplaySheetData('${file.id}')`
      //     : `handleDisplayFileData('${file.id}')`
      // }">Display</button> <button onclick="handleDeleteFile('${
      //   file.id
      // }')">Delete</button></td>`;
      tbodyInnerHtml += `<td><button onclick="${
        file.mimeType === "application/vnd.google-apps.spreadsheet"
          ? `handleDisplaySheetData('${file.id}')`
          : `handleDisplayFileData('${file.id}')`
      }">Display</button> <button onclick="handleDeleteFile('${
        file.id
      }')">Delete</button> <button onclick="handleShareFile('${
        file.id
      }')">Share</button></td>`;
      tbodyInnerHtml += `</tr>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

function reRenderTable1() {
  switch (table1currentlyDisplaying) {
    case "All Files and Folders":
      handleListFilesClick();
      break;
    case "All Folders":
      handleListFoldersClick();
      break;
    case "All Spreadsheets":
      handleListFilesClick();
      break;
  }
}

// table 2
function displayAddItemDiv() {
  document.getElementById("addItemDiv").style.display = "block";
}

function displayTable2() {
  document.getElementById("myTable2").style.display = "table";
  displayAddItemDiv();
}

function reRenderTable2() {
  handleDisplaySheetData(currentSheetId);
}

function setTable2Caption(text) {
  var caption = document.getElementById("myTable2Caption");
  caption.innerHTML = text;
}

function setTable2Headings(headings) {
  var thead = document.getElementById("myTable2Head");
  let theadInnerHtml = document.createElement("tr");
  headings.forEach((heading) => {
    theadInnerHtml.innerHTML += `<th>${heading}</th>`;
  });
  thead.innerHTML = theadInnerHtml.innerHTML;
}

function setTable2RowsForSheets(sheetData) {
  var tbody = document.getElementById("myTable2Body");
  let tbodyInnerHtml = ``;
  if (sheetData && sheetData.length > 0) {
    sheetData.forEach((row, index) => {
      tbodyInnerHtml += `<tr>`;
      for (column in row) {
        tbodyInnerHtml += `<td><input class="itemNumber${index}" value='${row[column]}'/></td>`;
      }
      tbodyInnerHtml += `<td><button onclick="handleUpdateItem('itemNumber${index}')"/>Save</button>`;
      tbodyInnerHtml += `</tr>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

// list files and folders
function handleListFilesClick() {
  displayTable1();
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
    })
    .then(function (response) {
      console.log(response);
      table1currentlyDisplaying = "All Files and Folders";
      setTable1Caption("All Files and Folders");
      setTable1Headings(filesFoldersHeadings);
      var files = response.result.files;
      setTable1RowsForFilesFolders(files);
    });
}

function handleListFoldersClick() {
  displayTable1();
  gapi.client
    .request({
      path:
        "https://www.googleapis.com/drive/v3/files?q=mimeType: 'application/vnd.google-apps.folder'",
    })
    .then(function (response) {
      table1currentlyDisplaying = "All Folders";
      setTable1Caption("All Folders");
      setTable1Headings(filesFoldersHeadings);
      var files = response.result.files;
      setTable1RowsForFilesFolders(files);
    });
}

// display file data
function handleDisplayFileData(fileId) {
  displayTable1();
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
    })
    .then(function (response) {
      console.log(response.result.permissions.map((perm) => perm.displayName));
    });
}

function handleDisplaySheetData(fileId) {
  displayTable2();
  currentSheetId = fileId;
  gapi.client
    .request({
      path: `https://sheets.googleapis.com/v4/spreadsheets/${fileId}?includeGridData=true`,
    })
    .then(function (response) {
      console.log(response);
      // console.log(response.result.sheets[0].data[0].rowData[0]);
      let sheetData = response.result.sheets[0].data[0].rowData.map(
        (row, rowIndex) =>
          row.values.map((column, columnIndex) => column.formattedValue)
      );
      // console.log(sheetData);

      let headings = sheetData.shift();
      // console.log(headings);
      let data = sheetData.map((row, rowIndex) => {
        let object = {};
        row.forEach((columnData, columnIndex) => {
          object = {
            ...object,
            [`${headings[columnIndex]}`]: columnData,
          };
        });
        object = {
          ...object,
          range: `A${rowIndex + 2}:${alphabet[row.length - 1]}${rowIndex + 2}`,
        };
        return object;
      });
      console.log(data);

      setTable2Caption("Sheet Data");
      setTable2Headings(headings);
      setTable2RowsForSheets(data);
    });
}

function handleListSpreadsheetsClick() {
  displayTable1();
  gapi.client
    .request({
      path:
        "https://www.googleapis.com/drive/v3/files?q=mimeType: 'application/vnd.google-apps.spreadsheet'",
    })
    .then(function (response) {
      table1currentlyDisplaying = "All Spreadsheets";
      setTable1Caption("All Spreadsheets");
      setTable1Headings(filesFoldersHeadings);
      var files = response.result.files;
      setTable1RowsForFilesFolders(files);
    });
}

function handleCreateFolderClick() {
  var folderName = createInput.value;
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "post",
      body: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
    })
    .then(function (response) {
      appendPre(`Folder ${folderName} Created Successfully`);
      reRenderTable1();
    })
    .catch((error) => {
      appendPre(`Folder ${folderName} could not be created`);
    });
}

function handleCreateSpreadsheetClick() {
  var spreadsheetName = createInput.value;
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "post",
      body: {
        name: spreadsheetName,
        mimeType: "application/vnd.google-apps.spreadsheet",
      },
    })
    .then(function (response) {
      appendPre(`Spreadsheet ${spreadsheetName} Created Successfully`);
      reRenderTable1();
    })
    .catch((error) => {
      appendPre(`Spreadsheet ${spreadsheetName} could not be created`);
    });
}

function handleDeleteFile(fileId) {
  // console.log(fileId);
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}`,
      method: "delete",
    })
    .then(function (response) {
      appendPre(`File Delete Successfully`);
      reRenderTable1();
    })
    .catch((error) => {
      appendPre("Could not delete file");
    });
}

function handleShareFile(fileId) {
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?emailMessage='Good Morning Edvaldo please find attached the Shopping List for the month'`,
      method: "post",
      body: {
        role: "writer",
        type: "user",
        emailAddress: "edvaldo@nanosoft.co.za",
      },
    })
    .then((response) => {
      console.log(response);
    });
}

function handleRemoveShareFile() {
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/1dF5UjOHWyukCNqFiJQH4f3h6h4uniw-CgWlbs1aoOhE/permissions/13934111265224148781`,
      method: "delete",
    })
    .then((response) => {
      console.log(response);
    });
}

function handleCreateNewItemClick() {
  var itemName = document.getElementById("createItemNameInput").value;
  var isPurchased = document.getElementById("isPurchased").value;
  gapi.client
    .request({
      path:
        "https://sheets.googleapis.com/v4/spreadsheets/15jOZlvU074FoyE820juoCalC-w8NB1DWgCuSPXSGF1I/values/Sheet1!A1:D1:append?valueInputOption=USER_ENTERED",
      method: "post",
      body: {
        values: [[itemName, isPurchased]],
      },
    })
    .then(function (response) {
      console.log(response);
      appendPre(`Spreadsheet ${itemName} Created Successfully`);
      reRenderTable2();
    })
    .catch((error) => {
      appendPre(`Spreadsheet ${itemName} could not be created`);
    });
}

function handleUpdateItem(itemClassName) {
  var itemData = [].slice.call(document.getElementsByClassName(itemClassName));
  itemData = itemData.map((item) => item.value);
  var range = itemData.pop();
  console.log(itemData);
  console.log(range);
  gapi.client
    .request({
      path: `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values/${range}?valueInputOption=USER_ENTERED`,
      method: "put",
      body: {
        values: [itemData],
      },
    })
    .then(function (response) {
      handleDisplaySheetData(currentSheetId);
    });
}

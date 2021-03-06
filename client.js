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
var table1currentlyDisplaying = "";
var currentSheetId = "";
var currentSharedFileId = "";
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
const roles = ["owner", "writer", "reader", "commenter"];
var appFolderId = "";

var authorizeButton = document.getElementById("authorizeButton");
var authorizedComponents = document.getElementById("authorizedComponents");
var signoutButton = document.getElementById("signoutButton");
var listFilesButton = document.getElementById("listFilesButton");
var listFoldersButton = document.getElementById("listFoldersButton");
var listSpreadsheetsButton = document.getElementById("listSpreadsheetsButton");
var createFolderButton = document.getElementById("createFolderButton");
var createSpreadsheetButton = document.getElementById(
  "createSpreadsheetButton"
);
var createShoppingListButton = document.getElementById(
  "createShoppingListButton"
);
var createNewItemButton = document.getElementById("createNewItemButton");
var shareButton = document.getElementById("shareButton");

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
        createShoppingListButton.onclick = handleCreateShoppingListClick;
        createNewItemButton.onclick = handleCreateNewItemClick;
        shareButton.onclick = handleShareFile;
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
  document.getElementById("table1").style.display = "table";
}

function setTable1Caption(text) {
  var caption = document.getElementById("table1Caption");
  caption.innerHTML = text;
}

function setTable1Headings(headings) {
  var thead = document.getElementById("table1Head");
  let theadInnerHtml = document.createElement("tr");
  headings.forEach((heading) => {
    theadInnerHtml.innerHTML += `<th>${heading}</th>`;
  });
  thead.innerHTML = theadInnerHtml.innerHTML;
}

function setTable1RowsForFilesFolders(files) {
  var tbody = document.getElementById("table1Body");
  let tbodyInnerHtml = ``;
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      tbodyInnerHtml += `<tr>`;
      tbodyInnerHtml += `<td>${file.id}</td>`;
      tbodyInnerHtml += `<td>${file.name}</td>`;
      tbodyInnerHtml += `<td>${file.mimeType}</td>`;
      tbodyInnerHtml += `<td>`;
      if (file.mimeType === "application/vnd.google-apps.spreadsheet") {
        tbodyInnerHtml += `<button onclick="handleDisplaySheetData('${file.id}')">Display Data</button>`;
      }
      tbodyInnerHtml += `<button onclick="handleDisplayFileSharedWith('${file.id}')">Display Shared With</button>`;
      tbodyInnerHtml += `<button onclick="handleDeleteFile('${file.id}')">Delete</button>`;
      // tbodyInnerHtml += `<button onclick="handleShareFile('${file.id}')">Share</button>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

function reRenderTable1() {
  switch (table1currentlyDisplaying) {
    case "Files and Folders":
      handleListFilesClick();
      break;
    case "Folders":
      handleListFoldersClick();
      break;
    case "Spreadsheets":
      handleListSpreadsheetsClick();
      break;
  }
}

// table 2
function displayAddItemDiv() {
  document.getElementById("addItemDiv").style.display = "block";
}

function displayTable2() {
  document.getElementById("table2").style.display = "table";
  displayAddItemDiv();
}

function reRenderTable2() {
  handleDisplaySheetData(currentSheetId);
}

function setTable2Caption(text) {
  var caption = document.getElementById("table2Caption");
  caption.innerHTML = text;
}

function setTable2Headings(headings) {
  var thead = document.getElementById("table2Head");
  let theadInnerHtml = document.createElement("tr");
  headings.forEach((heading) => {
    theadInnerHtml.innerHTML += `<th>${heading}</th>`;
  });
  thead.innerHTML = theadInnerHtml.innerHTML;
}

// function setTable2RowsForSheets(sheetData) {
//   var tbody = document.getElementById("table2Body");
//   let tbodyInnerHtml = ``;
//   if (sheetData && sheetData.length > 0) {
//     sheetData.forEach((row, index) => {
//       tbodyInnerHtml += `<tr>`;
//       for (column in row) {
//         tbodyInnerHtml += `<td><input class="itemNumber${index}" value='${row[column]}'/></td>`;
//       }
//       tbodyInnerHtml += `<td>`;
//       tbodyInnerHtml += `<button onclick="handleUpdateItem('itemNumber${index}')"/>Save</button>`;
//       tbodyInnerHtml += `<button onclick="handleClearItem('itemNumber${index}')"/>Clear</button>`;
//       tbodyInnerHtml += `<button onclick="handleRemoveItem(${index})"/>Remove</button>`;
//       tbodyInnerHtml += `</td>`;
//       tbodyInnerHtml += `</tr>`;
//     });
//   } else {
//     tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
//   }
//   tbody.innerHTML = tbodyInnerHtml;
// }

function setTable2RowsForSheets(sheetData) {
  var tbody = document.getElementById("table2Body");
  let tbodyInnerHtml = ``;
  if (sheetData && sheetData.length > 0) {
    sheetData.forEach((item, index) => {
      tbodyInnerHtml += `<tr>`;
      tbodyInnerHtml += `<td><input class="itemNumber${index}" value='${item.Name}'/></td>`;
      tbodyInnerHtml += `<td><input class="itemNumber${index}" value='${item.isPurchased}'/></td>`;
      tbodyInnerHtml += `<td>`;
      tbodyInnerHtml += `<button onclick="handleUpdateItem('itemNumber${index}', '${item.range}')"/>Save</button>`;
      // tbodyInnerHtml += `<button onclick="handleClearItem('itemNumber${index}', '${item.range}')"/>Clear</button>`;
      tbodyInnerHtml += `<button onclick="handleRemoveItem(${index})"/>Remove</button>`;
      tbodyInnerHtml += `</td>`;
      tbodyInnerHtml += `</tr>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

// table 3
function displayShareDiv() {
  document.getElementById("shareDiv").style.display = "block";
}
function displayTable3() {
  document.getElementById("table3").style.display = "table";
  displayShareDiv();
}

function reRenderTable3() {
  handleDisplaySheetData(currentSheetId);
}

function setTable3Caption(text) {
  var caption = document.getElementById("table3Caption");
  caption.innerHTML = text;
}

function setTable3Headings(headings) {
  var thead = document.getElementById("table3Head");
  let theadInnerHtml = document.createElement("tr");
  headings.forEach((heading) => {
    theadInnerHtml.innerHTML += `<th>${heading}</th>`;
  });
  thead.innerHTML = theadInnerHtml.innerHTML;
}

function setTable3Rows(permissions) {
  var tbody = document.getElementById("table3Body");
  let tbodyInnerHtml = ``;
  if (permissions && permissions.length > 0) {
    permissions.forEach((permission, index) => {
      tbodyInnerHtml += `<tr>`;
      tbodyInnerHtml += `<td>${permission.displayName}</td>`;
      tbodyInnerHtml += `<td>${permission.emailAddress}</td>`;
      if (permission.role === "owner") {
        tbodyInnerHtml += `<td>${permission.role}</td>`;
        tbodyInnerHtml += `<td>${permission.type}</td>`;
        tbodyInnerHtml += `<td>No Controls For Owner</td>`;
      } else {
        tbodyInnerHtml += `<td><select id="roleSelect${permission.id}"
        >${roles
          .map((role) => {
            return `<option value="${role}" ${
              permission.role === role ? "selected" : ""
            }>${role}</option>`;
          })
          .toString()}</select></td>`;
        tbodyInnerHtml += `<td>${permission.type}</td>`;
        tbodyInnerHtml += `<td>`;
        tbodyInnerHtml += `<button onclick="handleUpdateSharedFileRole('${permission.id}',roleSelect${permission.id}.value)">Update</button>`;
        tbodyInnerHtml += `<button onclick="handleRemoveShareFile('${permission.id}')">unShare</button>`;
        tbodyInnerHtml += `</td>`;
      }
      tbodyInnerHtml += `</tr>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

// file
function handleCreateFolderClick() {
  var createFolderInput = document.getElementById("createFolderInput");
  var folderName = createFolderInput.value;
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "POST",
      body: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
    })
    .then(function (response) {
      // console.log(response);
      if (response.status === 200) {
        createFolderInput.value = "";
        // appendPre(`Folder ${folderName} Created Successfully`);
        appFolderId = response.result.id;
        reRenderTable1();
      }
    })
    .catch((error) => {
      appendPre(`Folder ${folderName} could not be created`);
    });
}

function handleCreateSpreadsheetClick() {
  var createSpreadsheetInput = document.getElementById(
    "createSpreadsheetInput"
  );
  var spreadsheetName = createSpreadsheetInput.value;
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "POST",
      body: {
        name: spreadsheetName,
        mimeType: "application/vnd.google-apps.spreadsheet",
      },
    })
    .then(function (response) {
      createSpreadsheetInput.value = "";
      // appendPre(`Spreadsheet ${spreadsheetName} Created Successfully`);
      reRenderTable1();
    })
    .catch((error) => {
      appendPre(`Spreadsheet ${spreadsheetName} could not be created`);
    });
}

function handleListFilesClick() {
  displayTable1();
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
    })
    .then(function (response) {
      // console.log(response);
      table1currentlyDisplaying = "Files and Folders";
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
      table1currentlyDisplaying = "Folders";
      setTable1Caption("All Folders");
      setTable1Headings(filesFoldersHeadings);
      var files = response.result.files;
      setTable1RowsForFilesFolders(files);
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
      table1currentlyDisplaying = "Spreadsheets";
      setTable1Caption("All Spreadsheets");
      setTable1Headings(filesFoldersHeadings);
      var files = response.result.files;
      setTable1RowsForFilesFolders(files);
    });
}

function handleMoveSpreadsheet(spreadsheetId) {
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${appFolderId}`,
      method: "PATCH",
      body: {},
    })
    .then(function (response) {
      // console.log(response);
      reRenderTable1();
    })
    .catch((error) => {
      console.log(error);
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
      reRenderTable1();
    })
    .catch((error) => {
      appendPre("Could not delete file");
    });
}

// file sharing
function handleShareFile() {
  var email = document.getElementById("shareInput").value;
  var role = document.getElementById("shareSelect").value;
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${currentSharedFileId}/permissions?emailMessage='Good day. Please find attached the Shopping List of the month.'`,
      method: "POST",
      body: {
        role: role,
        type: "user",
        emailAddress: email,
      },
    })
    .then((response) => {
      // console.log(response);
      handleDisplayFileSharedWith(currentSharedFileId);
    });
}

function handleDisplayFileSharedWith(fileId) {
  displayTable3();
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
    })
    .then(function (response) {
      // console.log(response);
      // console.log(JSON.parse(response.body));
      // console.log(response.result.permissions);
      currentSharedFileId = response.result.id;
      var sharedWith = response.result.permissions.map((perm) => {
        return {
          displayName: perm.displayName,
          emailAddress: perm.emailAddress,
          role: perm.role,
          type: perm.type,
          id: perm.id,
        };
      });
      // console.log(sharedWith);
      setTable3Caption(`File (${JSON.parse(response.body).name}) Shared with`);
      setTable3Headings(["Name", "Email", "Role", "Type", "Operations"]);
      setTable3Rows(sharedWith);
    });
}

function handleUpdateSharedFileRole(permissionId, role) {
  // console.log("Current Shared File", currentSharedFileId);
  // console.log("PermissionId", permissionId);
  // console.log("role", role);
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${currentSharedFileId}/permissions/${permissionId}`,
      method: "PATCH",
      body: {
        role: role,
      },
    })
    .then((response) => {
      // console.log(response);
      handleDisplayFileSharedWith(currentSharedFileId);
    })
    .catch((error) => console.log(error));
}

function handleRemoveShareFile(permissionId) {
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${currentSharedFileId}/permissions/${permissionId}`,
      method: "delete",
    })
    .then((response) => {
      // console.log(response);
      handleDisplayFileSharedWith(currentSharedFileId);
    });
}

// google sheets api
function handleCreateShoppingListClick() {
  var createShoppingListInput = document.getElementById(
    "createShoppingListInput"
  );
  var shoppingListName = createShoppingListInput.value;
  gapi.client
    .request({
      path: "https://sheets.googleapis.com/v4/spreadsheets",
      method: "POST",
      body: {
        properties: {
          title: shoppingListName,
        },
        sheets: [
          {
            properties: {
              sheetId: 0,
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      {
                        userEnteredValue: {
                          stringValue: "Name",
                        },
                        effectiveValue: {
                          stringValue: "Name",
                        },
                        formattedValue: "Name",
                      },
                      {
                        userEnteredValue: {
                          stringValue: "isPurchased",
                        },
                        effectiveValue: {
                          stringValue: "isPurchased",
                        },
                        formattedValue: "isPurchased",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })
    .then(function (response) {
      // console.log(response);
      if (response.status === 200) {
        createSpreadsheetInput.value = "";
        handleMoveSpreadsheet(response.result.spreadsheetId);
        // appendPre(`Spreadsheet ${shoppingListName} Created Successfully`);
        // reRenderTable1();
      }
    })
    .catch((error) => {
      // appendPre(`Spreadsheet ${shoppingListName} could not be created`);
    });
}

function handleCreateNewItemClick() {
  var createItemNameInput = document.getElementById("createItemNameInput");
  var itemName = createItemNameInput.value;
  var isPurchased = document.getElementById("isPurchased").value;
  gapi.client
    .request({
      path: `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values/Sheet1!A1:B50:append?valueInputOption=RAW`,
      method: "POST",
      body: {
        values: [[itemName, isPurchased]],
      },
    })
    .then(function (response) {
      console.log(response);
      createItemNameInput.value = "";
      // console.log(response);
      reRenderTable2();
    })
    .catch((error) => {
      appendPre(`Spreadsheet ${itemName} could not be created`);
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
      // console.log(JSON.parse(response.body));
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
      // console.log(data);

      setTable2Caption(
        `Sheet (${JSON.parse(response.body).properties.title}) Data`
      );
      setTable2Headings([...headings, "operations"]);
      setTable2RowsForSheets(data);
    });
}

function handleUpdateItem(itemClassName, range) {
  var itemData = [].slice.call(document.getElementsByClassName(itemClassName));
  itemData = itemData.map((item) => item.value);
  // var range = itemData.pop();
  gapi.client
    .request({
      path: `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values/${range}?valueInputOption=USER_ENTERED`,
      method: "PUT",
      body: {
        values: [itemData],
      },
    })
    .then(function (response) {
      handleDisplaySheetData(currentSheetId);
    });
}

// function handleClearItem(itemClassName, range) {
//   var itemData = [].slice.call(document.getElementsByClassName(itemClassName));
//   itemData = itemData.map((item) => item.value);
//   // var range = itemData.pop();
//   // console.log(itemData);
//   // console.log(range);
//   gapi.client
//     .request({
//       path: `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values/${range}:clear`,
//       // path: `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}/values:batchClear`,
//       method: "POST",
//       body: { ranges: [range] },
//     })
//     .then(function (response) {
//       handleDisplaySheetData(currentSheetId);
//     });
// }

function handleRemoveItem(itemRowNumber) {
  gapi.client
    .request({
      path: `https://sheets.googleapis.com/v4/spreadsheets/${currentSheetId}:batchUpdate`,
      method: "POST",
      body: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: itemRowNumber + 1,
                endIndex: itemRowNumber + 2,
              },
            },
          },
        ],
        includeSpreadsheetInResponse: false,
        responseRanges: [""],
        responseIncludeGridData: false,
      },
    })
    .then(function (response) {
      handleDisplaySheetData(currentSheetId);
    });
}

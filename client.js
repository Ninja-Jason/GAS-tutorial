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
var currentlyDisplaying = "nothing";

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

function setTableCaption(text) {
  var caption = document.getElementById("myTableCaption");
  caption.innerHTML = text;
}

function setTableHeadings(headings) {
  var thead = document.getElementById("myTableHead");
  let theadInnerHtml = document.createElement("tr");
  headings.forEach((heading) => {
    theadInnerHtml.innerHTML += `<th>${heading}</th>`;
  });
  thead.innerHTML = theadInnerHtml.innerHTML;
}

function setTableRowsForFilesFolders(files) {
  var tbody = document.getElementById("myTableBody");
  let tbodyInnerHtml = ``;
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      tbodyInnerHtml += `<tr><td>${file.id}</td>`;
      tbodyInnerHtml += `<td>${file.name}</td>`;
      tbodyInnerHtml += `<td>${file.mimeType}</td>`;
      tbodyInnerHtml += `<td><button onclick="handleDisplaySheetData('${file.id}')">Display</button> <button onclick="handleDeleteFile('${file.id}')">Delete</button></td>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

function displayTable() {
  document.getElementById("myTable").style.display = "table";
}

function reRenderTable() {
  switch (currentlyDisplaying) {
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

/**
 * Print files.
 */
function handleListFilesClick() {
  displayTable();
  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
    })
    .then(function (response) {
      currentlyDisplaying = "All Files and Folders";
      setTableCaption("All Files and Folders");
      setTableHeadings(filesFoldersHeadings);
      var files = response.result.files;
      setTableRowsForFilesFolders(files);
    });
}

function handleDisplayFileData(fileId) {
  displayTable();
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
    })
    .then(function (response) {
      console.log(response);
    });
}

function handleDisplaySheetData(fileId) {
  gapi.client
    .request({
      path: `https://sheets.googleapis.com/v4/spreadsheets/${fileId}`,
    })
    .then(function (response) {
      console.log(response);
    });
}

function handleListFoldersClick() {
  gapi.client
    .request({
      path:
        "https://www.googleapis.com/drive/v3/files?q=mimeType: 'application/vnd.google-apps.folder'",
    })
    .then(function (response) {
      currentlyDisplaying = "All Folders";
      setTableCaption("All Folders");
      setTableHeadings(filesFoldersHeadings);
      var files = response.result.files;
      setTableRowsForFilesFolders(files);
    });
}

function handleListSpreadsheetsClick() {
  gapi.client
    .request({
      path:
        "https://www.googleapis.com/drive/v3/files?q=mimeType: 'application/vnd.google-apps.spreadsheet'",
    })
    .then(function (response) {
      currentlyDisplaying = "All Spreadsheets";
      setTableCaption("All Spreadsheets");
      setTableHeadings(filesFoldersHeadings);
      var files = response.result.files;
      setTableRowsForFilesFolders(files);
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
      reRenderTable();
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
      reRenderTable();
    })
    .catch((error) => {
      appendPre(`Spreadsheet ${spreadsheetName} could not be created`);
    });
}

function handleDeleteFile(fileId) {
  console.log(fileId);
  gapi.client
    .request({
      path: `https://www.googleapis.com/drive/v3/files/${fileId}`,
      method: "delete",
    })
    .then(function (response) {
      appendPre(`File Delete Successfully`);
      reRenderTable();
    })
    .catch((error) => {
      appendPre("Could not delete file");
    });
}

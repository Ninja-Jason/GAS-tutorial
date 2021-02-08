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
var SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";

var authorizeButton = document.getElementById("authorizeButton");
var signoutButton = document.getElementById("signoutButton");
var listFilesButton = document.getElementById("listFilesButton");
var listFoldersButton = document.getElementById("listFoldersButton");
var authorizedComponents = document.getElementById("authorizedComponents");
var listSpreadsheetsButton = document.getElementById("listSpreadsheetsButton");
var createFolderButton = document.getElementById("createFolderButton");
var createFolderInput = document.getElementById("createFolderInput");

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
      },
      function (error) {
        append(JSON.stringify(error, null, 2));
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

// function append(message) {
//   var pre = document.getElementById("content");
//   var node = document.createElement("div");
//   var textContent = document.createTextNode(message);
//   node.appendChild(textContent);
//   pre.appendChild(node);
// }

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
      tbodyInnerHtml += `<td>${file.mimeType}</td></tr>`;
    });
  } else {
    tbodyInnerHtml = `<tr><td colspan="3">No Files or Folders</td></tr>`;
  }
  tbody.innerHTML = tbodyInnerHtml;
}

function displayTable() {
  document.getElementById("myTable").style.display = "table";
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
      setTableCaption("All Files and Folders");
      setTableHeadings(["id", "name", "mime type"]);
      var files = response.result.files;
      setTableRowsForFilesFolders(files);
    });
}

function handleListFoldersClick() {
  gapi.client
    .request({
      path:
        "https://www.googleapis.com/drive/v3/files?q=mimeType: 'application/vnd.google-apps.folder'",
    })
    .then(function (response) {
      setTableCaption("All Folders");
      setTableHeadings(["id", "name", "mime type"]);
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
      setTableCaption("All Spreadsheets");
      setTableHeadings(["id", "name", "mime type"]);
      var files = response.result.files;
      setTableRowsForFilesFolders(files);
    });
}

function handleCreateFolderClick() {
  // var access_token = googleAuth.getAccessToken();

  gapi.client
    .request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + access_token,
      },
      body: {
        title: "Folder",
        mimeType: "application/vnd.google-apps.folder",
      },
    })
    .then(function (response) {
      console.log(response);
    });
}

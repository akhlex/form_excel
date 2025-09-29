# Event Website Server

This folder contains the Node.js/Express backend for handling registration and Google Sheets integration.

## Google Sheets API Setup

1. Go to https://console.cloud.google.com/ and create a new project (or use an existing one).
2. Enable the Google Sheets API for your project.
3. Create a Service Account and download the JSON credentials file.
4. Rename the credentials file to `credentials.json` and place it in the `server/` folder.
5. Share your Google Sheet with the service account email (found in the credentials file) with Editor access.
6. Update `SPREADSHEET_ID` in `index.js` with your Google Sheet ID.

After setup, run the backend with:

```
node index.js
```

The backend will listen for registration form submissions at `/register`.
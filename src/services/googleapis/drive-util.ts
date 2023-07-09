import { google } from 'googleapis';

const drive = google.drive({
    version: 'v3',
    credentials: {
        client_email: 'YOUR_CLIENT_EMAIL_ADDRESS',
        client_secret: 'YOUR_CLIENT_SECRET',
        refresh_token: 'YOUR_REFRESH_TOKEN',
    },
});

const folderId = 'YOUR_FOLDER_ID';

async function fetchFiles() {
    const files = await drive.files.list({
        q: `"folderId": "${folderId}"`,
    });

    files.items.forEach((file: any) => {
        console.log(file.name);
    });
}

fetchFiles();

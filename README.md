# Failik — Cloud File Manager

Failik is a full-stack cloud file management application built as part of The Odin Project curriculum. It allows users to create accounts, organize their files into folders, upload assets, and securely share folder contents with unauthenticated users using temporary access links.

## Features

- **User Authentication:** Secure sign-up and log-in system.
- **Folder Management:** Create, view, and delete custom folders. Deleting a folder cascade-deletes all its nested files.
- **File Uploads:** Support for file uploads (up to 50MB) with an interactive **Drag & Drop** container.
- **File Previews:** Direct image viewing and automated text file rendering (`.txt`, `.log`, etc.) in a built-in dark-themed code viewer.
- **Folder Sharing (Bonus Task):** Generate secure, unique shareable links (UUID) with custom expiration dates (`1d`, `10d`) for unauthenticated guest access.
- **Modern UI:** Responsive sidebar-based design with custom component styling (no heavy UI frameworks) and CSS Grid layouts.

## Tech Stack

- **Backend:** Node.js, Express
- **Database ORM:** Prisma (PostgreSQL)
- **Database Instance:** PostgreSQL (Hosted on Neon serverless platform)
- **View Engine:** EJS (Embedded JavaScript templates)
- **Styling:** Vanilla CSS3 (BEM methodology)
- **Icons:** FontAwesome v6

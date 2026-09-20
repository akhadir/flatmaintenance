# Flat Maintenance — Project Overview & Feature List

A React web application for managing the finances of **Suraksha Sunflower Apartment** (a residential apartment complex). It automates the association's monthly accounting: parsing bank statements, categorizing cash/online transactions, processing bill receipts with AI/OCR, tracking per-flat maintenance collections, and syncing everything to Google Sheets.

**Tech stack (from `src/`):** React 18 + TypeScript, Redux (with redux-thunk), react-router, Material-UI (MUI), google-spreadsheet / googleapis, SheetJS (xlsx), CryptoJS (AES), pdf-lib, and multiple AI/OCR backends (Ollama, Gemini, NVIDIA NIM, OCR.space, Google Vision, OpenAI, Hugging Face).

---

## Entry Points

- [src/app.tsx](src/app.tsx) — App shell: collapsible sidebar navigation, secret-gated unlock (SecretDialog), Redux provider.
- [src/app-routes.tsx](src/app-routes.tsx) — Route definitions for each workspace.
- [src/services/index.ts](src/services/index.ts) — Central config: holds encrypted credentials, decrypts them with a user-supplied secret, defines the transaction category tree (per-flat maintenance/corpus, monthly expenses, others) and the Google Spreadsheet binding.

---

## Feature List

### 1. Online Transactions Parser — `/`
Wizard-based ingestion of bank statement files into Google Sheets.

- **3-step wizard:** File Upload → File Preview → Save.
- **Bank statement parsing** ([services/xlsjs](src/services/xlsjs/index.ts)): reads **CSV** and **XLS/XLSX** files, extracting Date, Description, Cheque No, Debit, Credit, and running Balance. Handles both bank CSV layouts and Excel column-index layouts.
- **File upload** ([components/file-upload](src/components/file-upload/index.tsx)): drag/pick a `.csv/.xls/.xlsx` file with validation.
- **File preview** ([components/file-preview](src/components/file-preview/index.tsx)): tabular preview of parsed transactions, with month-wise filtering.
- **Save to Google Sheets** ([components/file-save](src/components/file-save/index.tsx)): writes parsed transactions into the **Online Transactions** sheet (auto-creates the sheet if missing).

### 2. Transaction Categorizer — `/cat`
End-to-end monthly categorisation of cash + online transactions.

- **4-step wizard:** Cash Transactions → Online Transactions → Map Transactions → Categorize Maintenance.
- **Loads transaction data** from the **Cash Transactions** and **Online Transactions** Google Sheets.
- **Rule-based auto-categorization** ([utils/trans-map-executor.ts](src/utils/trans-map-executor.ts)): applies a declarative category map ([services/cat-map/cat-map.ts](src/services/cat-map/cat-map.ts)) to assign each transaction a category (Bescom, BWSSB, Security, House Keeping Salary, Lift Maintenance, Maintenance Collection, Corpus Fund, etc.).
- **Flat-number detection** ([utils/maint-map-executor.ts](src/utils/maint-map-executor.ts)): maps maintenance/corpus deposits to individual flat numbers (001–412) via the maint-map rules.
- **Query engine** ([utils/query-executor.ts](src/utils/query-executor.ts), [utils/col-query-executor.ts](src/utils/col-query-executor.ts), [utils/logical-executor.ts](src/utils/logical-executor.ts)): operators `==`, `!=`, `>`, `>=`, `<`, `<=`, `having`, `regex`, `in`, `range`, combined with AND/OR logic, plus **Soundex phonetic matching** for fuzzy text matching.
- **Monthly category split** ([services/redux/transactions/trans-actions.ts](src/services/redux/transactions/trans-actions.ts)): aggregates transaction amounts into a month × category summary.
- **Monthly maintenance split**: aggregates maintenance collections per flat per month.
- **Save to Google Sheets** ([services/googleapis/gsheet-util-impl.ts](src/services/googleapis/gsheet-util-impl.ts)): writes category totals into the **Summary** sheet and per-flat maintenance into the **Maintanence** sheet.
- Review screens render the computed splits as JSON (react-json-view-lite).

### 3. Bill Processing — `/bills`
Process scanned/photographed bill receipts and feed them into the ledger.

- **Google Drive folder browser** ([components/new-bills/folder-grid.tsx](src/workspaces/new-bills/folder-grid.tsx)): lists month-named folders of uploaded bills (images & PDFs) from a dedicated Drive folder.
- **Unprocessed-bills table** ([workspaces/new-bills/bill-table.tsx](src/workspaces/new-bills/bill-table.tsx), [bill-row.tsx](src/workspaces/new-bills/bill-row.tsx)): rows for each bill with editable Date / Description / Amount / Category and a Cash↔Online toggle; bills already processed are skipped via the `VERIFIED_` file prefix.
- **Concurrent AI extraction queue**: fetches bill data in parallel with configurable concurrency and delay, with per-bill loading state and retries.
- **AI/OCR bill extraction** ([workspaces/new-bills/bill-utils.ts](src/workspaces/new-bills/bill-utils.ts)) — multiple backends:
  - **Ollama** local vision model (gemma3 / qwen2.5) — default backend; converts PDFs to images first.
  - **OCR.space** ([services/ocr](src/services/ocr/index.ts)) with retries, then **Google Gemini** extraction ([services/googleapis/gemini](src/services/googleapis/gemini/index.ts)).
  - **NVIDIA NIM** (nemotron-3-super-120b) ([services/nvidia](src/services/nvidia/index.ts)) with regex-based fallback extraction.
  - Filename-based parsing ([services/ocr/parser-utils.ts](src/services/ocr/parser-utils.ts)) for already-descriptive file names.
- Extracts **date, amount, description, category, and cash/cheque flag**; the extracted category is refined through the same category map used by the Categorizer.
- **Bill preview**: inline hover preview of the bill image/PDF.
- **Submit actions**:
  - **Cash bills** → appended to the **Cash Transactions** sheet.
  - **Online/cheque bills** → matched to an existing **Online Transactions** row (by date + debit + category) and its `Bill` URL filled in.
  - Processed bills are renamed with a `VERIFIED_` prefix in Drive.
- **Expense form dialog** ([workspaces/new-bills/expense.tsx](src/workspaces/new-bills/expense.tsx)): manual entry/editing with validation (date, amount, description, category).

### 4. Cash Transactions — `/cash` (route exists; nav currently commented out)
Camera-based cash receipt capture.

- Photo capture via device camera (fullscreen toggle).
- **OCR.space** text recognition on the captured image, followed by **OpenAI text-davinci-003** completion to structure the data.
- (Camera component is currently commented out in the render.)

### 5. Key Encryption — `/gen-key`
Utility for encrypting/decrypting secret keys.

- AES encryption/decryption using the app secret (CryptoJS).
- One-click copy of the encrypted value to clipboard, with round-trip verification (decrypted value shown with a success check).

### 6. Settings — `/settings`
Runtime configuration.

- Set the **Ollama Chat API URL** (persisted on the `window` object), used by the Ollama bill-extraction backend.

### 7. App-level / Cross-cutting Features

- **Secret-gated authentication** ([components/mapping/secret-dialog](src/components/mapping/secret-dialog/index.tsx)): the app stays locked until the correct secret is entered; the secret decrypts all embedded credentials (service account email/private key, Google API key, ChatGPT, Gemini, NVIDIA, OCR.space keys). Session persisted in `sessionStorage`.
- **Collapsible sidebar navigation** with the apartment logo/header.
- **Google Sheets integration** ([services/googleapis/gsheet-util-impl.ts](src/services/googleapis/gsheet-util-impl.ts)): service-account auth, sheet/row/cell CRUD, JSON↔sheet sync, month/category index-based cell writes for the Summary & Maintanence sheets, and search-and-update of existing records.
- **Google Drive integration** ([services/googleapis/drive-util.ts](src/services/googleapis/drive-util.ts)): list files by MIME type from a folder, move files, rename (VERIFIED_ prefix), copy-as-doc for OCR.
- **Config-driven layout engine** ([lib/layout](src/lib/layout)): declarative layout JSON rendered via rxjs-based layout-manager with `component`/`field`/`wizard`/`bill-config` operators and event-manager/component-manager.

---

## Domain Model & Data

- **Transaction** (`[Date, Description, Cheque No, Debit, Credit, Total, Category, Flat, Bill]`) — unified cash/online transaction shape ([services/service-types.ts](src/services/service-types.ts)).
- **Flat numbers** 001–412 ([utils/flat-category.ts](src/utils/flat-category.ts)) — 48 flats across 5 blocks.
- **Transaction categories** ([utils/trans-category.ts](src/utils/trans-category.ts)) — maintenance, corpus, and ~30 expense categories (Bescom, BWSSB, Diesel, Security, Lift Maintenance, House Keeping Salary, etc.).
- **Google Sheets** used: `Summary`, `Maintanence`, `Cash Transactions`, `Online Transactions`, plus monthly bill folders on Drive.

## Testing

Jest + React Testing Library. Test suites cover the rule/query engines ([utils/__tests__](src/utils/__tests__)), map executors, bill table, online-transactions data-utils, OCR/Ollama parser-utils, and the NVIDIA service ([src/services/nvidia/index.test.ts](src/services/nvidia/index.test.ts)).

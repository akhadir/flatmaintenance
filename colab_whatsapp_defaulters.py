"""
Google Colab script: identify defaulters from a Google Sheet, look up phone numbers
from Google Contacts (People API), and send WhatsApp messages via Twilio.

Usage (in Colab):
1. Run the first cell to install dependencies (see pip lines below).
2. Enable Google Sheets API and People API for the Google account used.
3. Provide the Spreadsheet ID and optionally the sheet/range.
4. Provide Twilio credentials (Account SID, Auth Token, WhatsApp from number).

Note: This script is designed to be pasted into a Colab cell. In Colab, run:

!pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib twilio pandas

Then run the code below (remove the pip install line if already installed).
"""

# Optional: uncomment and run in Colab
# !pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib twilio pandas

import os
import re
from getpass import getpass
from typing import List, Dict, Optional
import pandas as pd

from google.colab import auth
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from twilio.rest import Client


def authenticate_google(scopes: List[str]):
    auth.authenticate_user()
    creds, _ = google.auth.default(scopes=scopes)
    return creds


def get_defaulters_from_sheet(spreadsheet_id: str, range_name: str, creds) -> pd.DataFrame:
    """Read sheet and return DataFrame of defaulters with counts of months unpaid.
    Assumptions:
      - First two columns: flat number and owner name.
      - Remaining columns are months (April..March). Empty or zero-like values = unpaid.
    """
    sheets = build('sheets', 'v4', credentials=creds)
    try:
        result = sheets.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    except HttpError as e:
        raise RuntimeError(f"Sheets API error: {e}")

    values = result.get('values', [])
    if not values:
        raise RuntimeError('No data found in sheet')

    header = values[0]
    rows = values[1:]

    # Consider columns from index 2 onward as months
    month_cols = list(range(2, max(2, len(header))))
    month_names = header[2:]

    data = []
    for r in rows:
        flat = r[0] if len(r) > 0 else ''
        owner = r[1] if len(r) > 1 else ''
        unpaid = 0
        for ci in month_cols:
            # cell may be missing if row shorter
            if ci >= len(r):
                unpaid += 1
            else:
                v = str(r[ci]).strip()
                if v == '' or re.fullmatch(r'0+(?:\.0+)?', v):
                    unpaid += 1
        data.append({'flat': flat, 'owner': owner, 'months_not_paid': unpaid})

    df = pd.DataFrame(data)
    df = df[df['months_not_paid'] > 0].reset_index(drop=True)
    # attach month column names for clarity
    df.attrs['month_names'] = month_names
    return df


def get_contacts_map(creds) -> Dict[str, List[str]]:
    """Return a map from contact display name (lower) to list of phone numbers.
    Uses People API to fetch connections.
    """
    people = build('people', 'v1', credentials=creds)
    contacts = {}
    page_token = None
    while True:
        try:
            resp = people.people().connections().list(
                resourceName='people/me',
                personFields='names,phoneNumbers',
                pageSize=1000,
                pageToken=page_token
            ).execute()
        except HttpError as e:
            raise RuntimeError(f"People API error: {e}")

        connections = resp.get('connections', [])
        for p in connections:
            names = p.get('names', [])
            phones = p.get('phoneNumbers', [])
            if not names or not phones:
                continue
            display = names[0].get('displayName', '').strip().lower()
            phone_vals = [ph.get('value', '').strip() for ph in phones if ph.get('value')]
            if phone_vals:
                contacts.setdefault(display, []).extend(phone_vals)

        page_token = resp.get('nextPageToken')
        if not page_token:
            break
    return contacts


def find_phone_for_name(name: str, contacts_map: Dict[str, List[str]]) -> Optional[List[str]]:
    if not name:
        return None
    name_l = name.strip().lower()
    # exact match
    if name_l in contacts_map:
        return contacts_map[name_l]
    # approximate: contains
    for k, v in contacts_map.items():
        if name_l in k or k in name_l:
            return v
    # split name and try tokens
    tokens = [t for t in re.split(r"\s+", name_l) if t]
    for t in tokens:
        for k, v in contacts_map.items():
            if t in k.split():
                return v
    return None


def normalize_phone(phone: str) -> str:
    # remove spaces, parentheses, dashes; ensure leading + and country code present
    p = re.sub(r"[^0-9+]", "", phone)
    if p.startswith('00'):
        p = '+' + p[2:]
    if p.startswith('+'):
        return p
    # if no +, you may want to prefix your default country code (ask user). For now return as-is
    return p


def send_whatsapp_twilio(account_sid: str, auth_token: str, from_whatsapp: str, to_phone: str, message: str):
    client = Client(account_sid, auth_token)
    to_formatted = to_phone if to_phone.startswith('whatsapp:') else 'whatsapp:' + to_phone
    msg = client.messages.create(body=message, from_=from_whatsapp, to=to_formatted)
    return msg.sid


if __name__ == '__main__':
    # Scopes needed
    SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/contacts.readonly'
    ]

    print('Authenticate with Google (a popup will appear in Colab).')
    creds = authenticate_google(SCOPES)

    spreadsheet_id = input('Enter Spreadsheet ID: ').strip()
    if not spreadsheet_id:
        raise SystemExit('Spreadsheet ID required')
    range_name = input('Enter sheet range (default "Sheet1!A1:Z"): ').strip() or 'Sheet1!A1:Z'

    print('Reading sheet and computing defaulters...')
    df_def = get_defaulters_from_sheet(spreadsheet_id, range_name, creds)
    if df_def.empty:
        print('No defaulters found. Exiting.')
        raise SystemExit(0)

    print(f'Found {len(df_def)} defaulter(s). Fetching contacts...')
    contacts_map = get_contacts_map(creds)

    # Twilio setup
    use_twilio = input('Do you want to send WhatsApp messages via Twilio now? (y/N): ').strip().lower() == 'y'
    if use_twilio:
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID') or input('Twilio Account SID: ').strip()
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN') or getpass('Twilio Auth Token (hidden): ')
        from_whatsapp = os.environ.get('TWILIO_WHATSAPP_FROM') or input('Twilio WhatsApp FROM (e.g. whatsapp:+1415xxxx): ').strip()
    else:
        account_sid = auth_token = from_whatsapp = None

    # message template
    template = input('Message template (use {name} and {months} placeholders):\n')
    if not template:
        template = 'Dear {name}, our records show {months} month(s) unpaid. Please clear your dues.'

    results = []
    for _, row in df_def.iterrows():
        owner = row['owner']
        flat = row['flat']
        months = int(row['months_not_paid'])
        phones = find_phone_for_name(owner, contacts_map)
        normalized = []
        if phones:
            normalized = [normalize_phone(p) for p in phones]
        msg_text = template.format(name=owner or flat, months=months)

        sent = False
        sid = None
        if use_twilio and normalized:
            # try to send to the first phone
            try:
                sid = send_whatsapp_twilio(account_sid, auth_token, from_whatsapp, normalized[0], msg_text)
                sent = True
            except Exception as e:
                print(f'Failed to send to {owner} ({normalized[0]}): {e}')
        results.append({'flat': flat, 'owner': owner, 'months_not_paid': months, 'phones_found': normalized, 'sent': sent, 'sid': sid})

    res_df = pd.DataFrame(results)
    print('\nSummary:')
    print(res_df)

    # Save CSV for records or for alternative send methods
    out_csv = 'defaulters_whatsapp_out.csv'
    res_df.to_csv(out_csv, index=False)
    print(f'Wrote summary to {out_csv}')

    print('Done. Check the results above. If messages were not sent, ensure Twilio credentials and contact phone numbers are correct.')

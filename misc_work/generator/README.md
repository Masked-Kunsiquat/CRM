# PocketBase Audit Wizard

An interactive CLI utility for managing historical audit records in PocketBase using YAML and JSON as input sources.

## Overview

The PocketBase Audit Wizard is designed to streamline the end-to-end workflow for converting, importing, updating, and reporting audit data in a maintainable, automated way with minimal manual editing.

### Use Case

This tool is built for managing historical audit records (dating back to 2022) across multiple accounts in a PocketBase backend. It tracks details such as date, visited floors, notes, and score for each audit. The original data is written in YAML for human readability and later converted to JSON for structured processing. Audit IDs are generated upon import, and scores may be added at a later stage.

## Features

- **Convert**: Transforms audit records between YAML and JSON formats
- **Import**: Imports audit records into PocketBase, attaches generated record IDs, and writes updated output
- **Update**: Updates previously imported records by using stored IDs, e.g., to add scores
- **Report**: Outputs stats and summaries from the audit file, such as total audits, missing scores, or records per account
- **Interactive Wizard**: Guided, menu-driven interface for selecting operations and managing workflows without remembering CLI flags

## Installation

1. Ensure Python 3.6+ is installed on your system
2. Clone this repository:
   ```
   git clone https://github.com/yourusername/pocketbase-audit-wizard.git
   cd pocketbase-audit-wizard
   ```
3. Install required dependencies:
   ```
   pip install pyyaml requests
   ```

## Usage

The audit wizard can be used in two modes:

### Interactive Wizard Mode

Run the tool in interactive wizard mode:

```
python audit_wizard.py --interactive
```

This will present a menu-driven interface to guide you through the various operations.

### Command Line Mode

The tool can also be used with command line arguments for scripting:

#### Convert between YAML and JSON

```
# Convert YAML to JSON
python audit_wizard.py convert --format json --input audits.yml --output pocketbase_audits.json

# Convert JSON to YAML
python audit_wizard.py convert --format yaml --input pocketbase_audits.json --output audits.yml
```

#### Import audits into PocketBase

```
python audit_wizard.py import --input pocketbase_audits.json --output pocketbase_audits_with_ids.json
```

#### Update existing audits in PocketBase

```
python audit_wizard.py update --input pocketbase_audits_with_ids.json
```

#### Generate report from audit file

```
python audit_wizard.py report --input audits.yml --output audit_report.txt
```

## File Conventions

The utility works with the following default file names:

- **Input Files**:
  - `audits.yml` - Original YAML format audit data
  - `pocketbase_audits.json` - JSON format audit data for import

- **Output Files**:
  - `audits_with_ids.yml` - YAML format with PocketBase record IDs
  - `pocketbase_audits_with_ids.json` - JSON format with PocketBase record IDs
  - `audit_report.txt` - Generated audit report

## Environment Variables

The following environment variables can be used to configure PocketBase connectivity:

- `POCKETBASE_URL` - URL of the PocketBase instance (default: "http://localhost:8090")
- `POCKETBASE_EMAIL` - Admin email for PocketBase authentication
- `POCKETBASE_PASSWORD` - Admin password for PocketBase authentication
- `POCKETBASE_COLLECTION` - Name of the collection for audit records (default: "audits")

## Project Structure

- `audit_wizard.py` - Main script and CLI interface
- `converter.py` - Module for YAML/JSON conversion
- `pocketbase_client.py` - Client for PocketBase API interactions
- `report.py` - Report generation module
- `audits.yml` - Example YAML input data
- `pocketbase_audits.json` - Example JSON output data

## License

This project is licensed under the MIT License - see the LICENSE file for details.
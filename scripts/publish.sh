#!/bin/bash

# Check if both source and target directories are provided
# if [ "$#" -ne 2 ]; then
#     echo "Usage: $0 source_directory target_directory"
#     exit 1
# fi

SOURCE_DIR="./build"
TARGET_DIR="/c/Users/Khadir/workspaces/ssfa"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

# Check if target directory exists, if not, create it
if [ ! -d "$TARGET_DIR" ]; then
    mkdir -p "$TARGET_DIR"
fi

# Use find to locate all files and copy them one by one
find "$SOURCE_DIR" -type f -iname '*.*' | while read -r file; do
    # Create target subdirectories if they don't exist
    TARGET_PATH="$TARGET_DIR/$(dirname "${file#$SOURCE_DIR/}")"
    mkdir -p "$TARGET_PATH"
    
    echo "Copying $file to $TARGET_PATH"
    cp "$file" "$TARGET_PATH"
done

echo "All files have been copied successfully."

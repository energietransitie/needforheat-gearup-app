#!/usr/bin/env bash

# Ensure ~/.ssh directory exists
mkdir -p ~/.ssh

# Decode the base64 encoded SSH key and save it to ~/.ssh/id_ed25519
echo "$GH_SSH_KEY" | base64 -d > ~/.ssh/id_ed25519

# Set correct permissions for the private key
chmod 600 ~/.ssh/id_ed25519

# Generate public key from the private key
ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub

# Add GitHub to the list of known hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

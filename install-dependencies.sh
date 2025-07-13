#!/bin/bash

# Script to install Chrome dependencies for Puppeteer on Linux server

echo "Installing Chrome dependencies for Puppeteer..."

# Detect Linux distribution
if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    echo "Detected Debian/Ubuntu system"
    sudo apt-get update
    sudo apt-get install -y \
        ca-certificates \
        fonts-liberation \
        libappindicator3-1 \
        libasound2 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libxcomposite1 \
        libxdamage1 \
        libxrandr2 \
        xdg-utils \
        libxss1 \
        libxtst6 \
        libx11-xcb1 \
        libxcb-dri3-0 \
        libdrm2 \
        libgbm1 \
        libasound2
elif [ -f /etc/redhat-release ]; then
    # CentOS/RHEL/Fedora
    echo "Detected CentOS/RHEL/Fedora system"
    sudo yum update -y
    sudo yum install -y \
        alsa-lib \
        atk \
        cups-libs \
        gtk3 \
        ipa-gothic-fonts \
        libXcomposite \
        libXcursor \
        libXdamage \
        libXext \
        libXi \
        libXrandr \
        libXScrnSaver \
        libXtst \
        pango \
        xorg-x11-fonts-100dpi \
        xorg-x11-fonts-75dpi \
        xorg-x11-fonts-cyrillic \
        xorg-x11-fonts-misc \
        xorg-x11-fonts-Type1 \
        xorg-x11-utils
else
    echo "Unsupported Linux distribution. Please install Chrome dependencies manually."
    exit 1
fi

echo "Chrome dependencies installed successfully!"
echo "You can now run your Puppeteer application." 
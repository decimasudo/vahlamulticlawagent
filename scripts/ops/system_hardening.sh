#!/bin/bash

# VAHLA SYSTEM HARDENING PROTOCOL V4
# SECURITY LEVEL: MAXIMUM
# TARGET: UBUNTU/DEBIAN/RHEL

set -e
set -o pipefail

LOG_FILE="/var/log/vahla_hardening.log"
BACKUP_DIR="/var/backups/vahla_conf"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [VAHLA-SEC] $1" | tee -a "$LOG_FILE"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo "This script must be run as root" 
        exit 1
    fi
}

backup_config() {
    log "Initiating configuration backup..."
    mkdir -p "$BACKUP_DIR"
    cp /etc/ssh/sshd_config "$BACKUP_DIR/sshd_config.bak"
    cp /etc/sysctl.conf "$BACKUP_DIR/sysctl.conf.bak"
    cp /etc/fstab "$BACKUP_DIR/fstab.bak"
    log "Backup completed successfully."
}

harden_ssh() {
    log "Hardening SSH Daemon configuration..."
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sed -i 's/X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config
    sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config
    
    if ! grep -q "AllowUsers" /etc/ssh/sshd_config; then
        echo "AllowUsers vahla_admin" >> /etc/ssh/sshd_config
    fi
    
    systemctl restart sshd
    log "SSH hardened."
}

harden_network_stack() {
    log "Optimizing sysctl parameters for network security..."
    cat <<EOT >> /etc/sysctl.conf
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Block SYN attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Log Martians
net.ipv4.conf.all.log_martians = 1
EOT
    sysctl -p
    log "Network stack hardened."
}

configure_firewall() {
    log "Configuring UFW firewall rules..."
    if command -v ufw >/dev/null; then
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw --force enable
    else
        log "UFW not found. Skipping firewall step."
    fi
}

audit_system_files() {
    log "Auditing file permissions..."
    chmod 600 /boot/grub/grub.cfg
    chmod 600 /etc/crontab
    chmod 700 /root
    
    # Find world writable files
    find / -xdev -type d \( -perm -0002 -a ! -perm -1000 \) -print0 | xargs -0 chmod o+t
    log "File permission audit complete."
}

remove_unused_packages() {
    log "Removing bloatware and potential attack vectors..."
    PACKAGES="telnet rsh-server rsh-redone-server xinetd tftp-server ypserv"
    for pkg in $PACKAGES; do
        if dpkg -l | grep -q $pkg; then
            apt-get purge -y $pkg
        fi
    done
    apt-get autoremove -y
    apt-get clean
}

lock_cron_jobs() {
    log "Locking down cron jobs..."
    touch /etc/cron.allow
    chmod 600 /etc/cron.allow
    awk -F: '{print $1}' /etc/passwd | grep -v root > /etc/cron.deny
}

main() {
    check_root
    backup_config
    harden_ssh
    harden_network_stack
    configure_firewall
    audit_system_files
    remove_unused_packages
    lock_cron_jobs
    
    log "Vahla System Hardening Complete. Reboot recommended."
}

main "$@"

FROM postgres:15.17-alpine
RUN apk add --no-cache age curl && mkdir -p /backups /opt/backup && chown postgres:postgres /backups
COPY --chmod=0555 backup.sh /opt/backup/backup.sh
USER postgres
ENTRYPOINT ["/opt/backup/backup.sh"]

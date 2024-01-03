# Use the official MySQL 8 image as the base image
FROM mysql:8

RUN touch init.sql

ARG DB_DATABASE
ARG DB_USER
ARG DB_PASSWORD
ARG DB_TIMEZONE='-06:00'

RUN echo -e "SET @@global.time_zone = '${DB_TIMEZONE}';" > init.sql \
"\nSET @@session.time_zone = '${DB_TIMEZONE}';" >> init.sql \
"\nCREATE DATABASE IF NOT EXISTS company_model;" >> init.sql \
"\nCREATE DATABASE IF NOT EXISTS ${DB_DATABASE};" >> init.sql \
"\nCREATE USER IF NOT EXISTS ${DB_USER}@'%' IDENTIFIED BY '${DB_PASSWORD}';" >> init.sql \
"\nGRANT ALL PRIVILEGES ON *.* TO ${DB_USER}@'%' WITH GRANT OPTION;" >> init.sql \
"\nFLUSH PRIVILEGES;" >> init.sql 

RUN mv init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

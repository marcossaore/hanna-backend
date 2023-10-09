# Use the official MySQL 8 image as the base image
FROM mysql:8

RUN touch init.sql

ARG DB_DATABASE
ARG DB_USER
ARG DB_PASSWORD

RUN echo -e "CREATE DATABASE IF NOT EXISTS ${DB_DATABASE};" > init.sql \
"\nCREATE USER IF NOT EXISTS ${DB_USER}@'%' IDENTIFIED BY '${DB_PASSWORD}';" >> init.sql \
"\nGRANT ALL PRIVILEGES ON *.* TO ${DB_USER}@'%';" >> init.sql \
"\nFLUSH PRIVILEGES;" >> init.sql 

RUN mv init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

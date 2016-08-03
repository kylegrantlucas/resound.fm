#!/bin/bash
psql postgres -c "create role beatstream with createdb login password 'beatstream'"
psql postgres -c "create database beatstream"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE beatstream to beatstream"
psql postgres -c "create database beatstream_test"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE beatstream_test to beatstream"
rake db:schema:load

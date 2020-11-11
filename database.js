var mysql = require('mysql');
var dbConfig = require("./config/dbConfig")
var connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    else {
        console.log('Database is connected successfully !');
    }

    let createIssp = `create table if not exists issp(
                            id int primary key auto_increment,
                            category varchar(255),
                            year varchar(255),
                            term varchar(255),
                            company_name varchar(255) not null,
                            created_time DATETIME not null,
                            street_address varchar(255) not null,
                            address_line_2 varchar(255),
                            city varchar(255) not null,
                            province varchar(255) not null,
                            postal_code varchar(255) not null,
                            phone varchar(255) not null,
                            website varchar(255),
                            non_profit_organization varchar(25),
                            company_business_profile varchar(255) not null,
                            prefix varchar(25),
                            first varchar(255) not null,
                            last varchar(255) not null,
                            position varchar(255),
                            personal_phone varchar(255),
                            email varchar(255) not null,
                            project_area varchar(255),
                            project_description varchar(255),
                            project_duration varchar(255),
                            project_duration_no_preference varchar(25),
                            current_arrangement varchar(255),
                            programming_language varchar(255),
                            hardware_software_requirements varchar(255) not null,
                            continuation_project varchar(25),
                            hear_about_ISSP varchar(255),
                            sponsor_commitments varchar(25)
                        )`;

    let createAccount = `create table if not exists accounts(
                                id int primary key auto_increment,
                                username varchar(255),
                                password varchar(255),
                                role varchar(25)
                        )`;
    let createFeedback = `create table if not exists feedback(
                                id int primary key auto_increment,
                                project_id int,
                                feedback text,
                                feedback_time DATETIME,
                                feedback_user varchar(255),
                                FOREIGN KEY (project_id) REFERENCES issp(id) ON DELETE CASCADE
                        )`;

    connection.query(createIssp, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else{
            connection.query(createAccount, function (err, results, fields) {
                if (err) {
                    console.log(err.message);
                } else{
                    connection.query(createFeedback, function (err, results, fields) {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                }
            });
        }
    });

    // connection.end(function (err) {
    //     if (err) {
    //         return console.log(err.message);
    //     }
    // });
});

module.exports = connection;
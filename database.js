var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost', // Replace with your host name
    user: 'root',      // Replace with your database username
    password: 'root',      // Replace with your database password
    database: 'issp' // // Replace with your database Name
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

    connection.query(createIssp, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
    });

    // connection.end(function (err) {
    //     if (err) {
    //         return console.log(err.message);
    //     }
    // });
});

module.exports = connection;
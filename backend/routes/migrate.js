/**
 * TEMPORARY migrate route — DELETE this file after running once!
 * GET /api/migrate  →  imports the schema into Railway MySQL
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

const TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS Location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS CarClass (
    class_name ENUM('subcompact','compact','sedan','luxury') PRIMARY KEY,
    price_per_day DECIMAL(10,2) NOT NULL,
    price_per_week DECIMAL(10,2) NOT NULL,
    price_per_2week DECIMAL(10,2) NOT NULL,
    price_per_month DECIMAL(10,2) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS Car (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year_made INT NOT NULL,
    color VARCHAR(30) NOT NULL,
    class_name ENUM('subcompact','compact','sedan','luxury') NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (class_name) REFERENCES CarClass(class_name),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
  )`,
  `CREATE TABLE IF NOT EXISTS DropOffCharge (
    class_name ENUM('subcompact','compact','sedan','luxury') NOT NULL,
    from_location INT NOT NULL,
    to_location INT NOT NULL,
    charge DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (class_name, from_location, to_location),
    FOREIGN KEY (class_name) REFERENCES CarClass(class_name),
    FOREIGN KEY (from_location) REFERENCES Location(location_id),
    FOREIGN KEY (to_location) REFERENCES Location(location_id)
  )`,
  `CREATE TABLE IF NOT EXISTS Person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    drivers_license VARCHAR(50) UNIQUE NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS Phone (
    person_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (person_id, phone_number),
    FOREIGN KEY (person_id) REFERENCES Person(person_id)
  )`,
  `CREATE TABLE IF NOT EXISTS Customer (
    person_id INT PRIMARY KEY,
    FOREIGN KEY (person_id) REFERENCES Person(person_id)
  )`,
  `CREATE TABLE IF NOT EXISTS Employee (
    person_id INT PRIMARY KEY,
    category ENUM('driver','cleaner','clerk','manager') NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (person_id) REFERENCES Person(person_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
  )`,
  `CREATE TABLE IF NOT EXISTS Manager (
    person_id INT PRIMARY KEY,
    title ENUM('president','vp_operations','vp_marketing','manager') NOT NULL,
    FOREIGN KEY (person_id) REFERENCES Employee(person_id)
  )`,
  `CREATE TABLE IF NOT EXISTS Promotion (
    promo_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name ENUM('subcompact','compact','sedan','luxury') NOT NULL,
    week_start DATE NOT NULL,
    discount_pct DECIMAL(5,2) DEFAULT 60.00,
    FOREIGN KEY (class_name) REFERENCES CarClass(class_name)
  )`,
  `CREATE TABLE IF NOT EXISTS Rental (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    car_id INT NOT NULL,
    rent_location_id INT NOT NULL,
    return_location_id INT,
    requested_class ENUM('subcompact','compact','sedan','luxury') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    odometer_before INT NOT NULL,
    odometer_after INT,
    gas_level_returned ENUM('empty','quarter','half','three-quarters','full'),
    rental_price DECIMAL(10,2),
    promo_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(person_id),
    FOREIGN KEY (car_id) REFERENCES Car(car_id),
    FOREIGN KEY (rent_location_id) REFERENCES Location(location_id),
    FOREIGN KEY (return_location_id) REFERENCES Location(location_id),
    FOREIGN KEY (requested_class) REFERENCES CarClass(class_name),
    FOREIGN KEY (promo_id) REFERENCES Promotion(promo_id)
  )`,
];

const SEED_SQL = [
  `INSERT IGNORE INTO Location (street,city,province,postal_code) VALUES
    ('100 Main St','Hamilton','ON','L8P 1A1'),
    ('200 King St','Toronto','ON','M5V 1J2'),
    ('300 Portage Ave','Winnipeg','MB','R3C 0B6'),
    ('400 Jasper Ave','Edmonton','AB','T5J 1W8'),
    ('500 Burrard St','Vancouver','BC','V6C 2B5')`,
  `INSERT IGNORE INTO CarClass VALUES
    ('subcompact',30,180,320,600),
    ('compact',40,240,420,800),
    ('sedan',50,300,520,1000),
    ('luxury',100,600,1000,2000)`,
  `INSERT IGNORE INTO Car (license_plate,make,model,year_made,color,class_name,location_id) VALUES
    ('ABC-123','Honda','Fit',2020,'Blue','subcompact',1),
    ('DEF-456','Toyota','Yaris',2021,'Red','subcompact',2),
    ('GHI-789','Honda','Civic',2022,'Silver','compact',3),
    ('JKL-012','Toyota','Corolla',2021,'White','compact',4),
    ('MNO-345','Ford','Fusion',2020,'Black','sedan',5),
    ('PQR-678','Honda','Accord',2022,'Grey','sedan',1),
    ('STU-901','Mercedes','C300',2023,'Black','luxury',2),
    ('VWX-234','BMW','330i',2023,'White','luxury',3),
    ('YZA-567','Hyundai','Accent',2019,'Green','subcompact',4),
    ('BCD-890','Kia','Rio',2020,'Blue','subcompact',5)`,
  `INSERT IGNORE INTO DropOffCharge VALUES
    ('subcompact',1,2,50),('subcompact',2,1,50),
    ('luxury',1,5,500),('sedan',3,4,150)`,
  `INSERT IGNORE INTO Person (first_name,last_name,street,city,province,postal_code,drivers_license) VALUES
    ('Alice','President','123 Elite St','Hamilton','ON','L8P 1A1','DL-A100'),
    ('Bob','Ops','234 Exec Blvd','Toronto','ON','M5V 1J2','DL-B200'),
    ('Carol','Market','345 Promo Ave','Winnipeg','MB','R3C 0B6','DL-C300'),
    ('Dave','ManagerOne','456 Boss St','Edmonton','AB','T5J 1W8','DL-D400'),
    ('Eve','ManagerTwo','567 Super St','Vancouver','BC','V6C 2B5','DL-E500'),
    ('Frank','Clerkly','678 Desk Rd','Hamilton','ON','L8P 1A1','DL-F600'),
    ('Grace','Driverton','789 Wheel Cir','Toronto','ON','M5V 1J2','DL-G700'),
    ('Hank','Cleanman','890 Wash Way','Winnipeg','MB','R3C 0B6','DL-H800'),
    ('Ivy','ClerkCust','901 Dual Ln','Edmonton','AB','T5J 1W8','DL-I900'),
    ('Jack','CustomerX','111 User St','Vancouver','BC','V6C 2B5','DL-J000'),
    ('Kelly','CustomerY','222 Buyer Rd','Hamilton','ON','L8P 1A1','DL-K100'),
    ('Liam','CustomerZ','333 Client Ave','Toronto','ON','M5V 1J2','DL-L200')`,
  `INSERT IGNORE INTO Phone VALUES (1,'555-0101'),(1,'555-0102'),(2,'555-0201'),(9,'555-0901'),(10,'555-1001'),(11,'555-1101'),(12,'555-1201')`,
  `INSERT IGNORE INTO Customer VALUES (9),(10),(11),(12)`,
  `INSERT IGNORE INTO Employee VALUES (1,'manager',1),(2,'manager',2),(3,'manager',3),(4,'manager',4),(5,'manager',5),(6,'clerk',1),(7,'driver',2),(8,'cleaner',3),(9,'clerk',4)`,
  `INSERT IGNORE INTO Manager VALUES (1,'president'),(2,'vp_operations'),(3,'vp_marketing'),(4,'manager'),(5,'manager')`,
  `INSERT IGNORE INTO Promotion (class_name,week_start,discount_pct) VALUES ('subcompact','2023-01-01',60),('luxury','2023-02-01',50),('sedan','2023-03-01',70)`,
  `INSERT IGNORE INTO Rental (customer_id,car_id,rent_location_id,return_location_id,requested_class,start_date,end_date,odometer_before,odometer_after,gas_level_returned,rental_price,promo_id) VALUES
    (10,1,1,1,'subcompact','2023-04-01','2023-04-02',1000,1100,'full',30,NULL),
    (11,2,2,2,'subcompact','2023-04-03','2023-04-10',5000,5200,'half',180,NULL),
    (12,3,3,3,'compact','2023-05-01','2023-05-15',10000,10500,'empty',420,NULL),
    (10,4,4,4,'compact','2023-06-01','2023-07-01',15000,16000,'full',800,NULL),
    (9,5,5,5,'sedan','2023-07-01','2023-07-03',20000,20100,'full',50,NULL),
    (11,6,1,2,'sedan','2023-08-01','2023-08-02',25000,25200,'full',100,NULL),
    (12,7,2,2,'luxury','2023-09-01','2023-09-02',30000,30100,'full',100,NULL),
    (10,8,3,3,'luxury','2023-10-01','2023-10-06',35000,35500,'full',500,NULL),
    (11,9,4,NULL,'subcompact',DATE_SUB(CURDATE(), INTERVAL 2 DAY),NULL,40000,NULL,NULL,NULL,NULL),
    (12,10,5,NULL,'subcompact',DATE_SUB(CURDATE(), INTERVAL 1 DAY),NULL,45000,NULL,NULL,NULL,NULL)`,
  `CREATE OR REPLACE VIEW View_Q1 AS SELECT DISTINCT p.last_name FROM Rental r JOIN Customer c ON r.customer_id=c.person_id JOIN Person p ON c.person_id=p.person_id WHERE r.end_date IS NULL`,
  `CREATE OR REPLACE VIEW View_Q2 AS SELECT DISTINCT c.make,c.color FROM Car c JOIN Rental r ON c.car_id=r.car_id WHERE r.end_date IS NULL`,
  `CREATE OR REPLACE VIEW View_Q3 AS SELECT rental_id,rental_price FROM Rental WHERE end_date IS NOT NULL`,
  `CREATE OR REPLACE VIEW View_Q4 AS SELECT p.last_name FROM Manager m JOIN Employee e ON m.person_id=e.person_id JOIN Person p ON e.person_id=p.person_id`,
  `CREATE OR REPLACE VIEW View_Q5 AS SELECT p.last_name,p.first_name FROM Customer c JOIN Person p ON c.person_id=p.person_id`,
  `CREATE OR REPLACE VIEW View_Q6 AS SELECT (SELECT CASE WHEN COUNT(*)>0 THEN 'YES' ELSE 'NO' END FROM Employee e JOIN Customer c ON e.person_id=c.person_id) AS answer,p.person_id,p.first_name,p.last_name FROM Employee e JOIN Customer c ON e.person_id=c.person_id JOIN Person p ON c.person_id=p.person_id`,
  `CREATE OR REPLACE VIEW View_Q7 AS SELECT CASE WHEN COUNT(*)>0 THEN 'YES' ELSE 'NO' END AS answer FROM Manager m JOIN Employee e ON m.person_id=e.person_id JOIN Location l ON e.location_id=l.location_id WHERE m.title='president' AND l.city='Hamilton'`,
  `CREATE OR REPLACE VIEW View_Q8 AS SELECT r.rental_id FROM Rental r WHERE r.end_date IS NOT NULL AND DATEDIFF(r.end_date,r.start_date)=(SELECT MIN(DATEDIFF(r2.end_date,r2.start_date)) FROM Rental r2 WHERE r2.end_date IS NOT NULL)`,
  `CREATE OR REPLACE VIEW View_Q9 AS SELECT MIN(rental_price) AS cheapest_price FROM View_Q3`,
  `CREATE OR REPLACE VIEW View_Q10 AS SELECT c.make FROM Car c WHERE c.car_id NOT IN (SELECT r.car_id FROM Rental r)`,
];

router.get('/', async (req, res) => {
  const results = [];
  const conn = await pool.getConnection();
  try {
    // Create tables first
    for (const sql of TABLES_SQL) {
      const name = sql.trim().split('\n')[0].substring(0, 50);
      try {
        await conn.query(sql);
        results.push({ ok: true, sql: name });
      } catch (e) {
        results.push({ ok: false, sql: name, error: e.message });
      }
    }
    // Then seed data + views
    for (const sql of SEED_SQL) {
      const name = sql.trim().substring(0, 60);
      try {
        await conn.query(sql);
        results.push({ ok: true, sql: name });
      } catch (e) {
        results.push({ ok: false, sql: name, error: e.message });
      }
    }
    const failed = results.filter(r => !r.ok);
    res.json({
      message: failed.length === 0 ? '✅ Schema imported successfully!' : '⚠️ Done with some errors',
      total: results.length,
      failed: failed.length,
      details: results,
    });
  } finally {
    conn.release();
  }
});

module.exports = router;

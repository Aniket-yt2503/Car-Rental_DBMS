-- Schema for Car Rental System
DROP DATABASE IF EXISTS car_rental;
CREATE DATABASE car_rental;
USE car_rental;

CREATE TABLE Location (
  location_id INT AUTO_INCREMENT PRIMARY KEY,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL
);

CREATE TABLE CarClass (
  class_name ENUM('subcompact', 'compact', 'sedan', 'luxury') PRIMARY KEY,
  price_per_day DECIMAL(10,2) NOT NULL,
  price_per_week DECIMAL(10,2) NOT NULL,
  price_per_2week DECIMAL(10,2) NOT NULL,
  price_per_month DECIMAL(10,2) NOT NULL
);

CREATE TABLE Car (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year_made INT NOT NULL,
  color VARCHAR(30) NOT NULL,
  class_name ENUM('subcompact', 'compact', 'sedan', 'luxury') NOT NULL,
  location_id INT NOT NULL,
  FOREIGN KEY (class_name) REFERENCES CarClass(class_name),
  FOREIGN KEY (location_id) REFERENCES Location(location_id)
);

CREATE TABLE DropOffCharge (
  class_name ENUM('subcompact', 'compact', 'sedan', 'luxury') NOT NULL,
  from_location INT NOT NULL,
  to_location INT NOT NULL,
  charge DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (class_name, from_location, to_location),
  FOREIGN KEY (class_name) REFERENCES CarClass(class_name),
  FOREIGN KEY (from_location) REFERENCES Location(location_id),
  FOREIGN KEY (to_location) REFERENCES Location(location_id)
);

CREATE TABLE Person (
  person_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  drivers_license VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Phone (
  person_id INT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  PRIMARY KEY (person_id, phone_number),
  FOREIGN KEY (person_id) REFERENCES Person(person_id)
);

CREATE TABLE Customer (
  person_id INT PRIMARY KEY,
  FOREIGN KEY (person_id) REFERENCES Person(person_id)
);

CREATE TABLE Employee (
  person_id INT PRIMARY KEY,
  category ENUM('driver', 'cleaner', 'clerk', 'manager') NOT NULL,
  location_id INT NOT NULL,
  FOREIGN KEY (person_id) REFERENCES Person(person_id),
  FOREIGN KEY (location_id) REFERENCES Location(location_id)
);

CREATE TABLE Manager (
  person_id INT PRIMARY KEY,
  title ENUM('president', 'vp_operations', 'vp_marketing', 'manager') NOT NULL,
  FOREIGN KEY (person_id) REFERENCES Employee(person_id)
);

CREATE TABLE Promotion (
  promo_id INT AUTO_INCREMENT PRIMARY KEY,
  class_name ENUM('subcompact', 'compact', 'sedan', 'luxury') NOT NULL,
  week_start DATE NOT NULL,
  discount_pct DECIMAL(5,2) DEFAULT 60.00,
  FOREIGN KEY (class_name) REFERENCES CarClass(class_name)
);

CREATE TABLE Rental (
  rental_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  car_id INT NOT NULL,
  rent_location_id INT NOT NULL,
  return_location_id INT,
  requested_class ENUM('subcompact', 'compact', 'sedan', 'luxury') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  odometer_before INT NOT NULL,
  odometer_after INT,
  gas_level_returned ENUM('empty', 'quarter', 'half', 'three-quarters', 'full'),
  rental_price DECIMAL(10,2),
  promo_id INT,
  FOREIGN KEY (customer_id) REFERENCES Customer(person_id),
  FOREIGN KEY (car_id) REFERENCES Car(car_id),
  FOREIGN KEY (rent_location_id) REFERENCES Location(location_id),
  FOREIGN KEY (return_location_id) REFERENCES Location(location_id),
  FOREIGN KEY (requested_class) REFERENCES CarClass(class_name),
  FOREIGN KEY (promo_id) REFERENCES Promotion(promo_id)
);

-- Insert sample data
INSERT INTO Location (street, city, province, postal_code) VALUES
('100 Main St', 'Hamilton', 'ON', 'L8P 1A1'),
('200 King St', 'Toronto', 'ON', 'M5V 1J2'),
('300 Portage Ave', 'Winnipeg', 'MB', 'R3C 0B6'),
('400 Jasper Ave', 'Edmonton', 'AB', 'T5J 1W8'),
('500 Burrard St', 'Vancouver', 'BC', 'V6C 2B5');

INSERT INTO CarClass (class_name, price_per_day, price_per_week, price_per_2week, price_per_month) VALUES
('subcompact', 30.00, 180.00, 320.00, 600.00),
('compact', 40.00, 240.00, 420.00, 800.00),
('sedan', 50.00, 300.00, 520.00, 1000.00),
('luxury', 100.00, 600.00, 1000.00, 2000.00);

-- Distribute 10 cars across classes and locations
INSERT INTO Car (license_plate, make, model, year_made, color, class_name, location_id) VALUES
('ABC-123', 'Honda', 'Fit', 2020, 'Blue', 'subcompact', 1),
('DEF-456', 'Toyota', 'Yaris', 2021, 'Red', 'subcompact', 2),
('GHI-789', 'Honda', 'Civic', 2022, 'Silver', 'compact', 3),
('JKL-012', 'Toyota', 'Corolla', 2021, 'White', 'compact', 4),
('MNO-345', 'Ford', 'Fusion', 2020, 'Black', 'sedan', 5),
('PQR-678', 'Honda', 'Accord', 2022, 'Grey', 'sedan', 1),
('STU-901', 'Mercedes', 'C300', 2023, 'Black', 'luxury', 2),
('VWX-234', 'BMW', '330i', 2023, 'White', 'luxury', 3),
('YZA-567', 'Hyundai', 'Accent', 2019, 'Green', 'subcompact', 4),
('BCD-890', 'Kia', 'Rio', 2020, 'Blue', 'subcompact', 5);

INSERT INTO DropOffCharge (class_name, from_location, to_location, charge) VALUES
('subcompact', 1, 2, 50.00),
('subcompact', 2, 1, 50.00),
('luxury', 1, 5, 500.00),
('sedan', 3, 4, 150.00);

-- Persons (12 total: 9 employees (1 president, 1 VP ops, 1 VP marketing, 2 managers, 1 clerk, 1 driver, 1 cleaner, 1 clerk-customer), 3 customers)
INSERT INTO Person (first_name, last_name, street, city, province, postal_code, drivers_license) VALUES
('Alice', 'President', '123 Elite St', 'Hamilton', 'ON', 'L8P 1A1', 'DL-A100'),
('Bob', 'Ops', '234 Exec Blvd', 'Toronto', 'ON', 'M5V 1J2', 'DL-B200'),
('Carol', 'Market', '345 Promo Ave', 'Winnipeg', 'MB', 'R3C 0B6', 'DL-C300'),
('Dave', 'ManagerOne', '456 Boss St', 'Edmonton', 'AB', 'T5J 1W8', 'DL-D400'),
('Eve', 'ManagerTwo', '567 Super St', 'Vancouver', 'BC', 'V6C 2B5', 'DL-E500'),
('Frank', 'Clerkly', '678 Desk Rd', 'Hamilton', 'ON', 'L8P 1A1', 'DL-F600'),
('Grace', 'Driverton', '789 Wheel Cir', 'Toronto', 'ON', 'M5V 1J2', 'DL-G700'),
('Hank', 'Cleanman', '890 Wash Way', 'Winnipeg', 'MB', 'R3C 0B6', 'DL-H800'),
('Ivy', 'ClerkCust', '901 Dual Ln', 'Edmonton', 'AB', 'T5J 1W8', 'DL-I900'), -- Emp + Cust
('Jack', 'CustomerX', '111 User St', 'Vancouver', 'BC', 'V6C 2B5', 'DL-J000'),
('Kelly', 'CustomerY', '222 Buyer Rd', 'Hamilton', 'ON', 'L8P 1A1', 'DL-K100'),
('Liam', 'CustomerZ', '333 Client Ave', 'Toronto', 'ON', 'M5V 1J2', 'DL-L200');

INSERT INTO Phone (person_id, phone_number) VALUES
(1, '555-0101'), (1, '555-0102'), -- multiple numbers for Alice
(2, '555-0201'), (9, '555-0901'),
(10, '555-1001'), (11, '555-1101'), (12, '555-1201');

-- 3 pure customers + 1 employee customer
INSERT INTO Customer (person_id) VALUES (9), (10), (11), (12);

-- 9 employees
INSERT INTO Employee (person_id, category, location_id) VALUES
(1, 'manager', 1), 
(2, 'manager', 2), 
(3, 'manager', 3), 
(4, 'manager', 4), 
(5, 'manager', 5), 
(6, 'clerk', 1),   
(7, 'driver', 2),  
(8, 'cleaner', 3), 
(9, 'clerk', 4);   

-- Managers
INSERT INTO Manager (person_id, title) VALUES
(1, 'president'),
(2, 'vp_operations'),
(3, 'vp_marketing'),
(4, 'manager'),
(5, 'manager');

INSERT INTO Promotion (class_name, week_start, discount_pct) VALUES
('subcompact', '2023-01-01', 60.00),
('luxury', '2023-02-01', 50.00),
('sedan', '2023-03-01', 70.00);

-- 10 rentals: 8 completed, 2 active
INSERT INTO Rental (customer_id, car_id, rent_location_id, return_location_id, requested_class, start_date, end_date, odometer_before, odometer_after, gas_level_returned, rental_price, promo_id) VALUES
(10, 1, 1, 1, 'subcompact', '2023-04-01', '2023-04-02', 1000, 1100, 'full', 30.00, NULL), -- 1 day
(11, 2, 2, 2, 'subcompact', '2023-04-03', '2023-04-10', 5000, 5200, 'half', 180.00, NULL), -- 1 week
(12, 3, 3, 3, 'compact', '2023-05-01', '2023-05-15', 10000, 10500, 'empty', 420.00, NULL), -- 2 weeks
(10, 4, 4, 4, 'compact', '2023-06-01', '2023-07-01', 15000, 16000, 'full', 800.00, NULL), -- 1 month
(9, 5, 5, 5, 'sedan', '2023-07-01', '2023-07-03', 20000, 20100, 'full', 50.00, NULL), -- Employee, 2 days = $100 * 50% = $50
(11, 6, 1, 2, 'sedan', '2023-08-01', '2023-08-02', 25000, 25200, 'full', 100.00, NULL), -- Return different loc. 1 day = $50 + No surcharge defined for sedan 1->2 (assume 0 or fail?) Wait, there is no sub/1/2 drop charge for sedan.
(12, 7, 2, 2, 'luxury', '2023-09-01', '2023-09-02', 30000, 30100, 'full', 100.00, NULL), -- 1 day
(10, 8, 3, 3, 'luxury', '2023-10-01', '2023-10-06', 35000, 35500, 'full', 500.00, NULL), -- 5 days = 5 * 100

-- Active rentals
(11, 9, 4, NULL, 'subcompact', DATE_SUB(CURDATE(), INTERVAL 2 DAY), NULL, 40000, NULL, NULL, NULL, NULL),
(12, 10, 5, NULL, 'subcompact', DATE_SUB(CURDATE(), INTERVAL 1 DAY), NULL, 45000, NULL, NULL, NULL, NULL);

-- VIEWS

-- Q1. Last name of all customers who are currently renting a car
CREATE VIEW View_Q1 AS
SELECT DISTINCT p.last_name
FROM Rental r
JOIN Customer c ON r.customer_id = c.person_id
JOIN Person p ON c.person_id = p.person_id
WHERE r.end_date IS NULL;

-- Q2. Make and color of all cars currently rented out
CREATE VIEW View_Q2 AS
SELECT DISTINCT c.make, c.color
FROM Car c
JOIN Rental r ON c.car_id = r.car_id
WHERE r.end_date IS NULL;

-- Q3. For each completed rental: rental_price and rental_id
CREATE VIEW View_Q3 AS
SELECT rental_id, rental_price
FROM Rental
WHERE end_date IS NOT NULL;

-- Q4. Last names of all managers
CREATE VIEW View_Q4 AS
SELECT p.last_name
FROM Manager m
JOIN Employee e ON m.person_id = e.person_id
JOIN Person p ON e.person_id = p.person_id;

-- Q5. Last and first names of all customers
CREATE VIEW View_Q5 AS
SELECT p.last_name, p.first_name
FROM Customer c
JOIN Person p ON c.person_id = p.person_id;

-- Q6. Is any employee also a customer? (answer YES/NO + list them)
CREATE VIEW View_Q6 AS
SELECT 
    (SELECT CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END 
     FROM Employee e JOIN Customer c ON e.person_id = c.person_id) AS answer,
    p.person_id, p.first_name, p.last_name
FROM Employee e
JOIN Customer c ON e.person_id = c.person_id
JOIN Person p ON c.person_id = p.person_id;

-- Q7. Does our president work at headquarters? (Hamilton)
CREATE VIEW View_Q7 AS
SELECT 
    CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END AS answer
FROM Manager m
JOIN Employee e ON m.person_id = e.person_id
JOIN Location l ON e.location_id = l.location_id
WHERE m.title = 'president' AND l.city = 'Hamilton';

-- Q8. rental_id of all shortest (completed) rentals — use DATEDIFF + correlated subquery
CREATE VIEW View_Q8 AS
SELECT r.rental_id
FROM Rental r
WHERE r.end_date IS NOT NULL
AND DATEDIFF(r.end_date, r.start_date) = (
    SELECT MIN(DATEDIFF(r2.end_date, r2.start_date))
    FROM Rental r2
    WHERE r2.end_date IS NOT NULL
);

-- Q9. Price of the cheapest completed rental — must use Q3 as the inner subquery
CREATE VIEW View_Q9 AS
SELECT MIN(rental_price) AS cheapest_price
FROM View_Q3;

-- Q10. Makes of cars that have never been rented — use NOT IN subquery
CREATE VIEW View_Q10 AS
SELECT c.make
FROM Car c
WHERE c.car_id NOT IN (
    SELECT r.car_id FROM Rental r
);

-- STORED PROCEDURE CalculateRentalPrice
DELIMITER //

CREATE PROCEDURE CalculateRentalPrice(
    IN p_rental_id INT,
    IN p_return_date DATE,
    IN p_return_location INT,
    IN p_gas_level ENUM('empty', 'quarter', 'half', 'three-quarters', 'full'),
    IN p_odometer_after INT
)
BEGIN
    DECLARE v_start_date DATE;
    DECLARE v_req_class ENUM('subcompact', 'compact', 'sedan', 'luxury');
    DECLARE v_rent_loc INT;
    DECLARE v_days INT;
    DECLARE v_weeks INT;
    DECLARE v_base_price DECIMAL(10,2);
    DECLARE v_day_price DECIMAL(10,2);
    DECLARE v_week_price DECIMAL(10,2);
    DECLARE v_2week_price DECIMAL(10,2);
    DECLARE v_month_price DECIMAL(10,2);
    DECLARE v_dropoff_fee DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_promo_id INT;
    DECLARE v_promo_discount DECIMAL(5,2);
    DECLARE v_is_employee BOOLEAN DEFAULT FALSE;
    DECLARE v_cust_id INT;

    SELECT start_date, requested_class, rent_location_id, promo_id, customer_id
    INTO v_start_date, v_req_class, v_rent_loc, v_promo_id, v_cust_id
    FROM Rental WHERE rental_id = p_rental_id;

    SELECT price_per_day, price_per_week, price_per_2week, price_per_month
    INTO v_day_price, v_week_price, v_2week_price, v_month_price
    FROM CarClass WHERE class_name = v_req_class;

    SET v_days = DATEDIFF(p_return_date, v_start_date);
    IF v_days = 0 THEN SET v_days = 1; END IF;

    IF v_days = 1 THEN SET v_base_price = v_day_price;
    ELSEIF v_days = 7 THEN SET v_base_price = v_week_price;
    ELSEIF v_days = 14 THEN SET v_base_price = v_2week_price;
    ELSEIF v_days = 30 THEN SET v_base_price = v_month_price;
    ELSE
        -- e.g. 8 days = 1 week + 1 day
        SET v_weeks = FLOOR(v_days / 7);
        SET v_base_price = (v_weeks * v_week_price) + ((v_days MOD 7) * v_day_price);
    END IF;

    -- Check if dropoff fee applies
    IF v_rent_loc != p_return_location THEN
        SELECT charge INTO v_dropoff_fee
        FROM DropOffCharge
        WHERE class_name = v_req_class AND from_location = v_rent_loc AND to_location = p_return_location;
        IF v_dropoff_fee IS NULL THEN
            SET v_dropoff_fee = 0.00;
        END IF;
    END IF;

    -- Check employee discount
    IF EXISTS(SELECT 1 FROM Employee WHERE person_id = v_cust_id) THEN
        SET v_is_employee = TRUE;
    END IF;

    IF v_is_employee THEN
        IF v_days < 14 THEN
            SET v_base_price = v_base_price * 0.50;
        ELSE
            SET v_base_price = v_base_price * 0.90;
        END IF;
    ELSE
        -- apply promo if any
        IF v_promo_id IS NOT NULL THEN
            SELECT discount_pct INTO v_promo_discount FROM Promotion WHERE promo_id = v_promo_id;
            SET v_base_price = v_base_price * (v_promo_discount / 100);
        END IF;
    END IF;

    UPDATE Rental
    SET end_date = p_return_date,
        return_location_id = p_return_location,
        odometer_after = p_odometer_after,
        gas_level_returned = p_gas_level,
        rental_price = v_base_price + IFNULL(v_dropoff_fee, 0)
    WHERE rental_id = p_rental_id;

END //
DELIMITER ;

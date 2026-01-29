-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 27, 2026 at 08:05 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heallk_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int DEFAULT NULL,
  `patient_name` varchar(255) NOT NULL,
  `patient_email` varchar(255) DEFAULT NULL,
  `patient_phone` varchar(20) NOT NULL,
  `appointment_date` date DEFAULT NULL,
  `message` text,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `doctor_id`, `patient_name`, `patient_email`, `patient_phone`, `appointment_date`, `message`, `status`, `created_at`, `updated_at`) VALUES
(7, 1, 'nethmi tk', 'nethmitk,33@gmail.com', '0777858521', NULL, 'f', 'pending', '2026-01-27 07:51:44', '2026-01-27 07:53:17');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
CREATE TABLE IF NOT EXISTS `blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `views` int DEFAULT '0',
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`blog_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_published` (`is_published`),
  KEY `idx_created` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_likes`
--

DROP TABLE IF EXISTS `blog_likes`;
CREATE TABLE IF NOT EXISTS `blog_likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `blog_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `unique_blog_user` (`blog_id`,`user_id`),
  UNIQUE KEY `unique_blog_ip` (`blog_id`,`ip_address`),
  KEY `idx_blog_id` (`blog_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clinic_info`
--

DROP TABLE IF EXISTS `clinic_info`;
CREATE TABLE IF NOT EXISTS `clinic_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `clinic_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `description` text,
  `emergency_contact` varchar(50) DEFAULT NULL,
  `specializations` text,
  `facilities` text,
  `working_hours` text,
  `insurance_accepted` text,
  `images` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinic_info`
--

INSERT INTO `clinic_info` (`id`, `user_id`, `clinic_name`, `address`, `city`, `postal_code`, `phone`, `email`, `website`, `description`, `emergency_contact`, `specializations`, `facilities`, `working_hours`, `insurance_accepted`, `images`, `created_at`, `updated_at`) VALUES
(13, 8, 'kj', '45', 'galle', NULL, '0777858521', 'nethmitk33@gmail.com', NULL, NULL, NULL, '[]', '[]', '{\"monday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"tuesday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"wednesday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"thursday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"friday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"saturday\":{\"open\":\"09:00\",\"close\":\"13:00\",\"isOpen\":true},\"sunday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":false}}', '[]', NULL, '2026-01-26 05:07:51', '2026-01-26 05:07:51');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctor_qualifications`
--

DROP TABLE IF EXISTS `doctor_qualifications`;
CREATE TABLE IF NOT EXISTS `doctor_qualifications` (
  `qualification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `degree_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialization` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year_completed` year NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `certificate_url` text COLLATE utf8mb4_unicode_ci,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`qualification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctor_reviews`
--

DROP TABLE IF EXISTS `doctor_reviews`;
CREATE TABLE IF NOT EXISTS `doctor_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `reviewer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewer_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int NOT NULL,
  `review_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `ingredient` text,
  `wage` decimal(10,2) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Medicine',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `user_id`, `product_name`, `price`, `ingredient`, `wage`, `description`, `image`, `category`, `is_active`, `created_at`, `updated_at`) VALUES
(12, 8, 'Ashwagandha Capsules', 4.00, 'Ashwagandha Root Extract, Vegetable Cellulose', 2.50, 'Premium ashwagandha capsules for stress relief and vitality', 'uploads/products/1769526030820-54332777.png', 'Capsule', 1, '2026-01-26 05:15:29', '2026-01-26 05:15:29'),
(13, 8, 'Turmeric Oil', 8.50, 'Turmeric Extract, Coconut Oil, Black Pepper', 4.50, 'Natural turmeric oil with anti-inflammatory properties', 'uploads/products/1769525888039-736693866.png', 'Oil', 1, '2026-01-27 06:00:00', '2026-01-27 06:00:00'),
(14, 8, 'Herbal Tea Blend', 5.99, 'Green Tea, Ginger, Honey, Cardamom', 2.99, 'Soothing herbal tea blend for immunity and digestion', 'uploads/products/1769525921380-359396540.jpg', 'Tea', 1, '2026-01-27 06:00:00', '2026-01-27 06:00:00'),
(15, 8, 'Neem Powder', 6.50, 'Pure Neem Leaves Powder', 3.00, 'Natural neem powder for skin health and detoxification', 'uploads/products/1769525471473-510782176.png', 'Powder', 1, '2026-01-27 06:00:00', '2026-01-27 06:00:00'),
(16, 8, 'Brahmi Supplement', 9.99, 'Brahmi Extract, Bacopa Monnieri', 5.50, 'Brain tonic supplement for memory and concentration', 'uploads/products/1769525826764-883777716.jpeg', 'Supplement', 1, '2026-01-27 06:00:00', '2026-01-27 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `qualifications`
--

DROP TABLE IF EXISTS `qualifications`;
CREATE TABLE IF NOT EXISTS `qualifications` (
  `qualification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `degree_name` varchar(255) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `year_completed` varchar(10) NOT NULL,
  `description` text,
  `certificate_url` varchar(500) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`qualification_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `qualifications`
--

INSERT INTO `qualifications` (`qualification_id`, `user_id`, `degree_name`, `institution`, `specialization`, `year_completed`, `description`, `certificate_url`, `is_verified`, `created_at`, `updated_at`) VALUES
(8, 8, 'mppns', 'mmk', 'Anesthesiology', '2017', 's', '', 1, '2026-01-26 05:07:36', '2026-01-26 05:07:36');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL DEFAULT '1',
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  PRIMARY KEY (`review_id`),
  KEY `doctor_id` (`user_id`),
  KEY `idx_rating` (`rating`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`),
  KEY `idx_doctor_id` (`doctor_id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `duration` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `media_urls` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `service_for` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_doctor_id` (`doctor_id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_services_doctor_id` (`doctor_id`),
  KEY `idx_services_category` (`category`),
  KEY `idx_services_is_active` (`is_active`),
  KEY `idx_services_created_at` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `doctor_id`, `title`, `description`, `duration`, `price`, `category`, `media_urls`, `is_active`, `created_at`, `updated_at`, `service_for`) VALUES
(21, 8, 'm', 'm', '30', 19.00, 'Specialist Consultation', '[]', 0, '2026-01-26 05:07:07', '2026-01-26 05:07:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

DROP TABLE IF EXISTS `service_categories`;
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('doctor','patient','admin') DEFAULT 'patient',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_pic` text,
  `cover_photo` text,
  `description` text,
  `specialization` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','suspended','requested','rejected','accepted') DEFAULT 'requested',
  `payment_slip` text,
  `payment_slip_uploaded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `phone`, `role`, `created_at`, `profile_pic`, `cover_photo`, `description`, `specialization`, `status`, `payment_slip`, `payment_slip_uploaded_at`) VALUES
(2, 'Dr. Lakshan Perera', 'lakshan@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0774665078', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'Experienced Ayurvedic physician with 15 years of practice', 'Ayurvedic Physicians', 'accepted', '/uploads/payment-slips/lakshan_slip.jpg', NULL),
(3, 'Dr. Amara Silva', 'amara@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0716543210', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'Specialist in Panchakarma treatments and detoxification', 'Panchakarma Specialists', 'accepted', '/uploads/payment-slips/amara_slip.jpg', NULL),
(4, 'Dr. Nimal Jayasinghe', 'nimal@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0758765432', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'Wellness expert focusing on lifestyle and preventive care', 'Wellness & Lifestyle Consultants', 'accepted', '/uploads/payment-slips/nimal_slip.jpg', NULL),
(5, 'Dr. Priya De Silva', 'priya@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0712345678', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'Holistic health practitioner specializing in traditional Ayurveda', 'Ayurvedic Physicians', 'accepted', '/uploads/payment-slips/priya_slip.jpg', NULL),
(6, 'Dr. Roshan Kumar', 'roshan@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0778765432', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'New practitioner requesting registration', 'Ayurvedic Physicians', 'requested', '/uploads/payment-slips/roshan_slip.jpg', NULL),
(7, 'Dr. Malini Wijesinghe', 'malini@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0756543210', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'Certified Panchakarma specialist applying for membership', 'Panchakarma Specialists', 'requested', '/uploads/payment-slips/malini_slip.jpg', NULL),
(8, 'Dr. Sanjaya Goonewardene', 'sanjaya@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0745123456', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'wellness consultant requesting registration', 'Wellness & Lifestyle Consultants', 'requested', '/uploads/payment-slips/sanjaya_slip.jpg', NULL),
(9, 'Dr. Kalpana Fernando', 'kalpana@heallk.com', '$2a$12$sO0SESWJnjt1frd5ziVjRuQR00sp2TAQx5ABD1KWkPMSg2FHOKABm', '0734567890', 'doctor', '2026-01-26 15:41:25', NULL, NULL, 'Application rejected - incomplete credentials', 'Ayurvedic Physicians', 'rejected', '/uploads/payment-slips/kalpana_slip.jpg', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Make doctor_id optional for appointments table
ALTER TABLE `appointments` MODIFY COLUMN `doctor_id` INT DEFAULT NULL;

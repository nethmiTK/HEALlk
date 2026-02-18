-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 17, 2026 at 02:24 PM
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
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `image` longtext,
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
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`blog_id`, `user_id`, `title`, `content`, `image`, `summary`, `is_published`, `views`, `likes`, `created_at`, `updated_at`) VALUES
(7, 12, '🌿 ආයුර්වේද: සම්පූර්ණ සෞඛ්‍යයට සාර්ථක මඟ', '🌿 ආයුර්වේදයේ මූලික ඉගැන්වීම\n\nආයුර්වේදය අනුව, අපගේ ශරීරය තුළ “දොෂ” නම් තත්ත්ව ත්‍රිත්වයක් (වට, පිත්ත, කෞෆ) පවතී.\nමෙම දොෂ තුන සම්පූර්ණ ලෙස සමතුලිත නැත්නම්, ආබාධ ඇති වීමට හැකියාව ඇත.\nආයුර්වේදය දොෂ සම්තුලනය කර, ශරීරයේ ස්වභාවික සුවකිරීමේ හැකියාව ශක්තිමත් කිරීම තුළ සුවතා ලබා දෙයි.\n\n🌼 කෙටි දෝෂ විවරණය\n\nවට (Vata) – ගැටිලිම, වියපත් වීම, වේදනා\n\nපිත්ත (Pitta) – උණ, ආහාර පහන, ආලේප\n\nකෞෆ (Kapha) – බර, සුදානම, දඟර බව\n\nආයුර්වේද ප්‍රතිකාර උපදෙස් ඇති විට, ඔබේ දොෂ සාක්ෂාත් කර ගැනීම ඉතා වැදගත් වේ.', 'data:image/jpeg;base64,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', 'ආයුර්වේදය යනු ශරීරය, මනස සහ ආත්මය – තුනේම සමතුලිතතාවය බලාපොරොත්තු වන පුරාණ වෛද්‍ය ක්‍රමයක්යි. බෙහෙත් ලබාදීම පමණක් නොවේ, ඒ වෙනුවට රෝගය ඇතිවීමට හේතු වූ අසමතුලිත තත්ව හඳුනාගෙන ඒවා සම්පාදනය කරන්නටයි ආයුර්වේදයේ අරමුණ.', 1, 0, 1, '2026-01-29 11:01:17', '2026-01-29 11:51:17');

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
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blog_likes`
--

INSERT INTO `blog_likes` (`like_id`, `blog_id`, `user_id`, `ip_address`, `created_at`) VALUES
(7, 7, NULL, '::1', '2026-01-29 11:43:56');

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
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinic_info`
--

INSERT INTO `clinic_info` (`id`, `user_id`, `clinic_name`, `address`, `city`, `postal_code`, `phone`, `email`, `website`, `description`, `emergency_contact`, `specializations`, `facilities`, `working_hours`, `insurance_accepted`, `images`, `created_at`, `updated_at`) VALUES
(14, 12, 'suwa harana', 'nirehana  road,imaduwa,galle', 'galle', NULL, '0777858521', 'nethmitk33@gmail.com', NULL, 'පූර්ව වෙන්කර ගැනීම මත\nසාමාන්‍ය සහ පංචකර්ම ප්‍රතිකාර ලබාදේ', NULL, '[\"General Medicine\",\"Cardiology\"]', '[]', '{\"monday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"tuesday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"wednesday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"thursday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"friday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":true},\"saturday\":{\"open\":\"09:00\",\"close\":\"13:00\",\"isOpen\":true},\"sunday\":{\"open\":\"09:00\",\"close\":\"17:00\",\"isOpen\":false}}', '[]', NULL, '2026-01-29 11:00:08', '2026-01-29 12:27:07');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `user_id`, `product_name`, `price`, `ingredient`, `wage`, `description`, `image`, `category`, `is_active`, `created_at`, `updated_at`) VALUES
(18, 12, 'අභ්‍යංග තෙල්', 1000.00, 'මූලික තෙල් (Base Oils):\r\n\r\nතල තෙල් (Sesame Oil)\r\n\r\nකොප්පර තෙල් (Coconut Oil)\r\n\r\nඔලිව් තෙල් (Olive Oil)\r\n\r\nකස්ටර් තෙල් (Castor Oil)\r\n\r\n🌿 ඖෂධීය ශාක ද්‍රව්‍ය:\r\n\r\nනිකා (Nika)\r\n\r\nබෙහෙත් නෙල්ලි (Amla)\r\n\r\nවෙණිවැල්ගැට (Venivelgeta)', NULL, 'මෙම ආයුර්වේද තෙල් සම්පූර්ණයෙන්ම ස්වභාවික ශාක සාර, මල්, බීජ සහ ඖෂධීය මූලික තෙල් එකතුවකින් සකස් කර ඇත. තල තෙල්, කොප්පර තෙල් වැනි මූලික තෙල් ශරීරයට ඉක්මනින් අවශෝෂණය වී රුධිර සංසරණය වැඩි කරයි. ගොටුකොළ, නෙල්ලි, වෙණිවැල්ගැට, කරඳ, සන්දල් වැනි ඖෂධීය ශාක ශරීරය ශක්තිමත් කරමින්, වේදනා අඩු කිරීම, මාංශපේශී සන්සුන් කිරීම සහ දොෂ සමතුලිත කිරීම සඳහා උපකාරී වේ.', 'uploads/products/1769684602253-593862140.jpg', 'Oil', 1, '2026-01-29 11:03:22', '2026-01-29 11:03:22');

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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `qualifications`
--

INSERT INTO `qualifications` (`qualification_id`, `user_id`, `degree_name`, `institution`, `specialization`, `year_completed`, `description`, `certificate_url`, `is_verified`, `created_at`, `updated_at`) VALUES
(9, 12, 'MBBS', 'University of kalaniya', 'Cardiology', '2021', 'පංචකර්ම සහ තෙල් ප්‍රතිකාර පිළිබඳ වෘත්තීය පුහුණුව\n\nදොෂ පරීක්ෂාව (වට, පිත්ත, කෞෆ) සහ රෝග විනිශ්චය හැකියාව\n\nස්වභාවික ඖෂධ සහ හර්බල් ප්‍රතිකාර පිළිබඳ දැනුම\n\nසෞඛ්‍ය උපදේශන සහ රෝගී සත්කාර අත්දැකීම්', 'https://share.google/CLV08R0CHH4MTLjeb', 1, '2026-01-29 10:59:04', '2026-01-29 10:59:04');

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

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `doctor_id`, `user_id`, `rating`, `comment`, `created_at`, `status`) VALUES
(25, 12, 0, 5, '“මෙම ආයුර්වේද තෙල් භාවිතා කිරීමෙන් පසු මගේ ශරීර වේදනා සහ ආතතිය බොහෝ අඩු වුණා. තෙල්වල ස්වභාවික සුවඳ මනසට සන්සුන් බවක් ගෙන එනවා. නිදාගැනීමත් ඉතා සුවපහසු වෙලා. ගුණාත්මක, විශ්වාසදායක සහ වෘත්තීයමය නිෂ්පාදනයක් ලෙස නිර්දේශ කරන්න පුළුවන්.”', '2026-01-29 11:05:23', 'approved');

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
  `image` longtext,
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
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `doctor_id`, `title`, `description`, `duration`, `price`, `category`, `media_urls`, `image`, `is_active`, `created_at`, `updated_at`, `service_for`) VALUES
(22, 12, 'ශරීර සුවතා සහ තෙල් ප්‍රතිකාර', 'මෙම සේවා කාණ්ඩය ශරීරයේ රුධිර සංසරණය වැඩි කරමින්, මාංශපේශී ශක්තිය සහ ලාච්චනය වර්ධනය කර, ආතතිය අඩු කරමින් සම්පූර්ණ සුවතාව ලබාදීමට අරමුණු කරයි. ස්වභාවික ඖෂධීය තෙල්, උණුසුම් ප්‍රතිකාර සහ සුවඳ ද්‍රව්‍ය භාවිතා කරමින් ශරීරය ශාන්තිමත් කිරීම, වේදනා අඩු කිරීම, නින්ද ගුණාත්මක කිරීම සහ නසී ගැටළු සමනය කිරීම මෙහි ප්‍රධාන ප්‍රතිලාභ වේ.\r\n\r\nඅභ්‍යංග, ශිරෝධාරා, ස්වේදන, පින්ඩ ස්වේද වැනි සම්ප්‍රදායික ආයුර්වේද ක්‍රම මඟින් දොෂ සමතුලිත කරමින්, ශරීරයේ ස්වභාවික සුවකිරීමේ හැකියාව ශක්තිමත් කර, දිගුකාලීන සෞඛ්‍යය සහ ශාරීරික-මානසික සන්සුන්භාවය ලබාදේ.', '30 minitues', 9998.00, 'General Consultation', '\"[]\"', '/uploads/service/1769690562970-268800110.png', 1, '2026-01-29 10:56:24', '2026-01-29 12:42:42', NULL);

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
-- Table structure for table `specializations`
--

DROP TABLE IF EXISTS `specializations`;
CREATE TABLE IF NOT EXISTS `specializations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `profile_pic` longtext,
  `cover_photo` longtext,
  `description` text,
  `specialization` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','suspended','requested','rejected','accepted') DEFAULT 'requested',
  `payment_slip` text,
  `payment_slip_uploaded_at` timestamp NULL DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `phone`, `role`, `created_at`, `profile_pic`, `cover_photo`, `description`, `specialization`, `status`, `payment_slip`, `payment_slip_uploaded_at`, `address`, `district`) VALUES
(12, 'NETHU SANDHEEPA', 'nethmitk33@gmail.com', '$2a$12$bY6J0lBVLpW/9cxnyLz4x.rxAvct2BgLlyo5Als9d6pA0axk8a4Sa', '7777858521', 'doctor', '2026-01-29 10:49:06', 'data:image/jpeg;base64,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', NULL, NULL, 'Ayurvedic Physicians', 'active', '/uploads/payment-slips/1769683746836-1769683745513-399567570.png', '2026-01-29 10:49:06', NULL, NULL),
(14, 'suresh denipitiya', 'suresh33@gmail.com', '$2a$12$Q.RGPfKFkl9j4istwa4xROIlqOd/ABK6yxidOebC5BUBhqkMruN/u', '94777858521', 'doctor', '2026-01-29 14:10:37', NULL, NULL, NULL, 'Panchakarma Specialists', 'requested', '/uploads/payment-slips/1769695837659-1769695836751-467859761.png', '2026-01-29 14:10:37', 'nhenapit walpala road,imaduw', 'Gampaha');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

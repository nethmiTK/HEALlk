-- Sample data for doctor_qualifications table
-- Make sure you have at least one user in the users table first

-- Insert sample qualifications (assuming user_id = 1 exists)
INSERT INTO doctor_qualifications (
    user_id, 
    degree_name, 
    specialization, 
    institution, 
    year_completed, 
    description, 
    certificate_url, 
    is_verified
) VALUES 
(
    1, 
    'MBBS', 
    'General Medicine', 
    'University of Colombo', 
    2018, 
    'Bachelor of Medicine, Bachelor of Surgery with First Class Honours', 
    NULL, 
    TRUE
),
(
    1, 
    'MD', 
    'Cardiology', 
    'Postgraduate Institute of Medicine', 
    2022, 
    'Doctor of Medicine specializing in Cardiovascular Medicine', 
    NULL, 
    TRUE
),
(
    1, 
    'Board Certification', 
    'Cardiology', 
    'Sri Lanka Medical Council', 
    2023, 
    'Board certified specialist in Cardiology by SLMC', 
    NULL, 
    FALSE
),
(
    1, 
    'Fellowship', 
    'Interventional Cardiology', 
    'National Heart Centre Singapore', 
    2024, 
    'Fellowship in Interventional Cardiology and Cardiac Catheterization', 
    'https://example.com/fellowship-certificate.pdf', 
    FALSE
);

-- If you need to create a sample user first, uncomment these lines:
-- INSERT INTO users (full_name, email, password, role) 
-- VALUES ('Dr. John Smith', 'doctor@example.com', '$2b$10$hashedpassword', 'user');
// import React, { useState, useEffect } from 'react';
// import { API_BASE_URL } from '../config';
// import { toast } from 'react-toastify';

// const DoctorAboutManager = ({ doctorId }) => {
//   const [aboutData, setAboutData] = useState({
//     description: '',
//     profile_image: '',
//     gallery_images: [],
//     specialties: [],
//     experience_years: 0,
//     education: '',
//     languages: [],
//     achievements: ''
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (doctorId) {
//       loadAboutData();
//     }
//   }, [doctorId]);

//   const loadAboutData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/doctor-about/${doctorId}`);
//       if (response.ok) {
//         const data = await response.json();
//         if (data.success && data.aboutData) {
//           setAboutData(data.aboutData);
//         }
//       }
//     } catch (error) {
//       console.error('Error loading about data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAboutData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleArrayChange = (field, value) => {
//     setAboutData(prev => ({
//       ...prev,
//       [field]: prev[field].includes(value) 
//         ? prev[field].filter(item => item !== value)
//         : [...prev[field], value]
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAboutData(prev => ({
//           ...prev,
//           profile_image: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('heallk_token');
      
//       const response = await fetch(`${API_BASE_URL}/doctor-about`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           doctor_id: doctorId,
//           ...aboutData
//         })
//       });

//       if (response.ok) {
//         toast.success('About information saved successfully!');
//       } else {
//         throw new Error('Failed to save');
//       }
//     } catch (error) {
//       toast.error('Failed to save about information');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const specialtyOptions = [
//     'Panchakarma', 'Herbal Medicine', 'Stress Management', 
//     'Beauty & Wellness', 'Child Care', 'Physiotherapy'
//   ];

//   const languageOptions = ['English', 'Sinhala', 'Tamil', 'Hindi'];

//   if (loading) {
//     return <div className="text-center py-4">Loading...</div>;
//   }

//   return (
//     <div className="p-6 bg-green-50">
//       <h2 className="text-2xl font-bold mb-6 text-black" style={{fontFamily: 'Playfair Display, serif'}}>
//         About Information
//       </h2>

//       <div className="space-y-6">
//         {/* Profile Image */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Profile Image</label>
//           <div className="flex items-center gap-4">
//             {aboutData.profile_image && (
//               <img 
//                 src={aboutData.profile_image} 
//                 alt="Profile" 
//                 className="w-24 h-24 rounded-lg object-cover"
//               />
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Description</label>
//           <textarea
//             name="description"
//             value={aboutData.description}
//             onChange={handleInputChange}
//             rows="4"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             placeholder="Tell about yourself and your practice..."
//           />
//         </div>

//         {/* Experience Years */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Experience (Years)</label>
//           <input
//             type="number"
//             name="experience_years"
//             value={aboutData.experience_years}
//             onChange={handleInputChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//           />
//         </div>

//         {/* Education */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Education</label>
//           <textarea
//             name="education"
//             value={aboutData.education}
//             onChange={handleInputChange}
//             rows="3"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             placeholder="Your educational qualifications..."
//           />
//         </div>

//         {/* Specialties */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Specialties</label>
//           <div className="grid grid-cols-2 gap-2">
//             {specialtyOptions.map(specialty => (
//               <label key={specialty} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={aboutData.specialties.includes(specialty)}
//                   onChange={() => handleArrayChange('specialties', specialty)}
//                   className="mr-2"
//                 />
//                 <span className="text-sm">{specialty}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Languages */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Languages</label>
//           <div className="grid grid-cols-2 gap-2">
//             {languageOptions.map(language => (
//               <label key={language} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={aboutData.languages.includes(language)}
//                   onChange={() => handleArrayChange('languages', language)}
//                   className="mr-2"
//                 />
//                 <span className="text-sm">{language}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Achievements */}
//         <div>
//           <label className="block text-sm font-medium text-black mb-2">Achievements</label>
//           <textarea
//             name="achievements"
//             value={aboutData.achievements}
//             onChange={handleInputChange}
//             rows="3"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             placeholder="Your achievements and awards..."
//           />
//         </div>

//         {/* Save Button */}
//         <button
//           onClick={handleSave}
//           disabled={loading}
//           className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
//         >
//           {loading ? 'Saving...' : 'Save About Information'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DoctorAboutManager;
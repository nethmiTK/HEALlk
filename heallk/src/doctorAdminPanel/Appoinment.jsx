import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Uncomment if using axios



const Appoinment = ({ user }) => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState({});

	const handleEdit = (appt) => {
		setEditingId(appt.id);
		setEditForm({ ...appt });
	};

	const handleSaveEdit = async () => {
		try {
			const response = await fetch(`http://localhost:5000/api/appointments/${editingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editForm)
			});
			if (!response.ok) throw new Error('Failed to update appointment');
			
			setAppointments(appointments.map(a => a.id === editingId ? { ...editForm } : a));
			setEditingId(null);
			setError(null);
		} catch (err) {
			setError(err.message || 'Error updating appointment');
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditForm({});
	};

	const handleDelete = async (appointmentId) => {
		if (window.confirm('Are you sure you want to delete this appointment?')) {
			try {
				// Replace with your actual API endpoint
				const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
					method: 'DELETE'
				});
				if (!response.ok) throw new Error('Failed to delete appointment');
				
				setAppointments(appointments.filter(a => a.id !== appointmentId));
			} catch (err) {
				setError(err.message || 'Error deleting appointment');
			}
		}
	};

	useEffect(() => {
		const fetchAppointments = async () => {
			setLoading(true);
			setError(null);
			try {
				if (!user || !user.user_id) {
					setError('Doctor ID not found.');
					setLoading(false);
					return;
				}
				
			console.log('Fetching appointments for doctor_id:', user.user_id);
			// Replace with your actual API endpoint
			const response = await fetch(`http://localhost:5000/api/appointments?doctor_id=${user.user_id}`);				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Failed to fetch appointments');
				}
				
				const data = await response.json();
				console.log('Appointments data received:', data);
				setAppointments(data.appointments || []);
			} catch (err) {
				console.error('Error fetching appointments:', err);
				setError(err.message || 'Error fetching appointments');
			} finally {
				setLoading(false);
			}
		};
		fetchAppointments();
	}, [user]);	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">My Appointments</h1>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : appointments.length === 0 ? (
				<div>No appointments found.</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
						<thead>
							<tr className="bg-green-100 text-gray-800">
								<th className="py-2 px-4 border-b">#</th>
								<th className="py-2 px-4 border-b">Patient Name</th>
								<th className="py-2 px-4 border-b">Email</th>
								<th className="py-2 px-4 border-b">Phone</th>
								<th className="py-2 px-4 border-b">Date</th>
								<th className="py-2 px-4 border-b">Message</th>
								<th className="py-2 px-4 border-b">Status</th>
								<th className="py-2 px-4 border-b">Created At</th>
								<th className="py-2 px-4 border-b">Actions</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((appt, idx) => (
								<tr key={appt.id} className="hover:bg-green-50">
									<td className="py-2 px-4 border-b">{idx + 1}</td>
									<td className="py-2 px-4 border-b">{appt.patient_name}</td>
									<td className="py-2 px-4 border-b">{appt.patient_email || '-'}</td>
									<td className="py-2 px-4 border-b">{appt.patient_phone}</td>
									<td className="py-2 px-4 border-b">{appt.appointment_date}</td>
									<td className="py-2 px-4 border-b">{appt.message || '-'}</td>
									<td className="py-2 px-4 border-b">
										<span className={`px-2 py-1 rounded-full text-xs font-semibold ${
											appt.status === 'confirmed' ? 'bg-green-200 text-green-800' :
											appt.status === 'cancelled' ? 'bg-red-200 text-red-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
											{appt.status}
										</span>
									</td>
									<td className="py-2 px-4 border-b">{new Date(appt.created_at).toLocaleString()}</td>
									<td className="py-2 px-4 border-b">
										<div className="flex gap-2">
											<button 
												onClick={() => handleEdit(appt)}
												className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition"
											>
												Edit
											</button>
											<button 
												onClick={() => handleDelete(appt.id)}
												className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Edit Modal */}
			{editingId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
						<h2 className="text-xl font-bold mb-4">Edit Appointment</h2>
						
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">Patient Name</label>
								<input
									type="text"
									value={editForm.patient_name || ''}
									onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Email</label>
								<input
									type="email"
									value={editForm.patient_email || ''}
									onChange={(e) => setEditForm({ ...editForm, patient_email: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Phone</label>
								<input
									type="tel"
									value={editForm.patient_phone || ''}
									onChange={(e) => setEditForm({ ...editForm, patient_phone: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Appointment Date</label>
								<input
									type="date"
									value={editForm.appointment_date || ''}
									onChange={(e) => setEditForm({ ...editForm, appointment_date: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Message</label>
								<textarea
									value={editForm.message || ''}
									onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
									rows="3"
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Status</label>
								<select
									value={editForm.status || 'pending'}
									onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="pending">Pending</option>
									<option value="confirmed">Confirmed</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={handleSaveEdit}
								className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
							>
								Save Changes
							</button>
							<button
								onClick={handleCancelEdit}
								className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded transition"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Appoinment;
 
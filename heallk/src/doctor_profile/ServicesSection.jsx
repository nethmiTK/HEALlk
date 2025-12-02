import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const ServicesSection = ({ doctorId }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/services/doctor/${doctorId}`);
        const data = await res.json();
        
        if (data.success) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setServices([]);
      }
    };

    fetchServices();
  }, [doctorId]);

  return (
    <div id="services" className="w-full py-6 sm:py-8 lg:py-12 bg-gray-50">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 px-2">Our Services</h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4 lg:px-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-lg p-3 sm:p-4 lg:p-6 border hover:shadow-lg transition-all"
          >
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2">{service.title}</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-1 sm:mb-2">{service.description}</p>
            <p className="text-sm sm:text-base text-green-600 font-bold">Rs. {service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;

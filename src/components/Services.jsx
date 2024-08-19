const ServiceItem = ({ icon, title, description }) => {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <div className="text-blue-500 mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  };
  
  const Services = () => {
    const services = [
      { icon: '🧼', title: 'Teeth Cleaning', description: 'Professional cleaning to remove plaque and tartar, leaving your teeth fresh and polished.' },
      { icon: '📚', title: 'Oral Hygiene Education', description: 'Guidance on maintaining good oral hygiene to prevent cavities and gum disease.' },
      { icon: '🪛', title: 'Tooth Extraction', description: 'Safe removal of damaged or decayed teeth to maintain overall dental health.' },
      { icon: '🔩', title: 'Dental Implants', description: 'Permanent solution for missing teeth using artificial tooth roots and crowns.' },
    ];
  
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceItem key={service.title} icon={service.icon} title={service.title} description={service.description} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Services;
  
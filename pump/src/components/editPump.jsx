import { useState, useEffect } from 'react';

export default function EditPumpModal({ isOpen, onClose, pump, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (pump) {
      setFormData({ ...pump });
    }
  }, [pump]);

  if (!isOpen || !pump) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">{formData.id ? 'Edit Pump' : 'New Pump'}</h2>
          </div>
          <div className="text-sm space-y-1 text-right">
            <div className="flex justify-between">
            {formData.id && (<p className="text-sm text-gray-500 mb-4">Pump ID: {formData.id}</p>)}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
            <Input label="Pump Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Pump Type" name="type" value={formData.type} onChange={handleChange} />

            <div className="space-y-4">
                <label className="block text-sm font-medium mb-1">Area</label>
                <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                >
                    {Array.from({ length: 26 }, (_, i) => {
                    const letter = String.fromCharCode(65 + i);
                    return (
                        <option key={letter} value={letter}>
                        Area {letter}
                        </option>
                    );
                    })}
                </select>
            </div>

        <div className="col-span-2 grid grid-cols-2 gap-4">
            <Input label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
            <Input label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} />
        </div>
        
        <label className="block text-sm font-medium mb-1">Offset</label>
        <div className="relative">
            <input
            type="text"
            name="offset"
            value={formData.offset}
            onChange={handleChange}
            className="w-full border px-2 py-1 pr-10 rounded"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            sec
            </span>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-4">
            {/* Reassure Min */}
            <div>
                <label className="block text-sm font-medium mb-1">Reassure Min</label>
                <div className="relative">
                <input
                    type="text"
                    name="pressureMin"
                    value={formData.pressureMin}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 pr-10 rounded"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                    psi
                </span>
                </div>
            </div>

                {/* Reassure Max */}
            <div>
                <label className="block text-sm font-medium mb-1">Reassure Max</label>
                <div className="relative">
                <input
                    type="text"
                    name="pressureMax"
                    value={formData.pressureMax}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 pr-10 rounded"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                    psi
                </span>
                </div>
            </div>
        </div>

            {/* Only show these fields when adding a new pump */}
        {!formData.id && (
            <>
            <Input label="Flow Rate" name="flowRate" value={formData.flowRate} onChange={handleChange} />
            <Input label="Status" name="status" value={formData.status} onChange={handleChange} />
            <label className="block text-sm font-medium mb-1">Pressure Current</label>
            <div className="relative">
            <input
                type="text"
                name="pressureCurrent"
                value={formData.pressureCurrent}
                onChange={handleChange}
                className="w-full border px-2 py-1 pr-10 rounded"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                psi
            </span>
            </div>
            </>
        )}
    </div>
    
    <div className="flex justify-end mt-8 space-x-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
    </div>
    </div>
  );
}

function Input({ label, name, value, onChange, suffix }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <div className="flex items-center">
        <input
          type="text"
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="w-full border px-3 py-1.5 rounded text-sm"
        />
        {suffix && <span className="ml-2 text-sm text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
}

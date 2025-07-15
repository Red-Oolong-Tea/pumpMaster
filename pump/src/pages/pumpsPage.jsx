import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPumps, createPump, updatePump, deletePumpById } from '../api/api';
import EditPumpModal from '../components/editPump';
import Navbar from '../components/navgation';

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function PumpsPage() {
  const navigate = useNavigate();
  const [pumps, setPumps] = useState([]);
  const [selectedPump, setSelectedPump] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const searchInputRef = useRef(null);
  const filterRef = useRef(null);
  const pumpArea = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    setPumps(getAllPumps());
  }, []);

  const handleEdit = (pump) => {
    if (editMode) {
      setSelectedPump(pump);
      setModalOpen(true);
    }
  };

  const handleSearchIconClick = () => {
    setSearchVisible((prev) => !prev);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const toggleAreaFilter = (area) => {
    setAreaFilter((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleToggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (deleteMode) setDeleteMode(false);
  };

  const handleToggleDeleteMode = () => {
    setDeleteMode((prev) => {
      if (!prev) setSelectedIds([]);
      return !prev;
    });
    if (editMode) setEditMode(false);
  };

  const handleModalSave = (formData) => {
    if (formData.id) {
      updatePump(formData.id, formData);
    } else {
      createPump(formData);
    }
    setPumps(getAllPumps());
    setModalOpen(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one pump to delete.');
      return;
    }
    const confirm = window.confirm(`Are you sure you want to delete ${selectedIds.length} pump(s)?`);
    if (!confirm) return;

    selectedIds.forEach((id) => deletePumpById(id));
    setPumps((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setToastMessage(`${selectedIds.length} pump(s) deleted successfully.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filtered = pumps.filter((p) => {
    const matchSearch =
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.type || '').toLowerCase().includes(search.toLowerCase());

    const matchArea = areaFilter.length === 0 || areaFilter.includes(p.area);
    return matchSearch && matchArea;
  });


  return (
    <>
      {isModalOpen && (
        <EditPumpModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          pump={selectedPump}
          onSave={handleModalSave}
        />
      )}

      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          {toastMessage}
        </div>
      )}

      <Navbar />

      <div className="flex justify-between items-center px-6 pt-4">
        <h1 className="text-2xl font-bold">Pumps</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedPump({
                name: '',
                type: '',
                area: '',
                latitude: '',
                longitude: '',
                offset: '',
                pressureMin: '',
                pressureMax: '',
              });
              setModalOpen(true);
            }}
            className="px-3 py-1 bg-gray-200 text-black font-bold rounded text-sm"
          >
            New Pump
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-6 pt-4">
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-200 rounded" onClick={handleSearchIconClick}>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
          </button>

          <div className="relative" ref={filterRef}>
            <button
              className="p-2 bg-gray-200 rounded"
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              <FunnelIcon className="w-5 h-5 text-gray-700" />
            </button>
           {isFilterOpen && (
            <div className="absolute left-0 mt-2 bg-white border rounded shadow p-2 z-10 w-[320px]">
              <div className="columns-3 space-y-1">
                {pumpArea.map((letter) => (
                  <label key={letter} className="break-inside-avoid flex items-center text-sm hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={areaFilter.includes(letter)}
                      onChange={() => toggleAreaFilter(letter)}
                      className="w-4 h-4 mr-2"
                      />
                      <span>Area {letter}</span>
                  </label>
                ))}
                </div>
                </div>
              )}

          </div>

          <button onClick={handleToggleEditMode} className={`p-2 bg-gray-200 rounded ${editMode ? 'ring-2 ring-blue-500' : ''}`}>
            <PencilIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        
       <button onClick={handleToggleDeleteMode}
            className={`px-3 py-1 rounded text-sm font-bold flex items-center justify-center gap-2 ${deleteMode ? 'hidden' : 'bg-gray-200 text-black'}`}
          >
            <TrashIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>

       {deleteMode && (
        <div className="flex gap-2">
            <button onClick={handleBatchDelete} className="px-3 py-1 bg-red-600 text-white font-bold rounded text-sm">
                Delete Selected
            </button>
            <button onClick={() => setDeleteMode(false)} className="px-3 py-1 bg-gray-300 text-black font-bold rounded text-sm">
                Cancel
            </button>
            </div>
         )}
      </div>

      {isSearchVisible && (
        <div className="px-6 mt-4">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />
        </div>
      )}

      <div className="p-6">
        <table className="w-full table-auto border">
          <thead>
            <tr>
              {deleteMode && (
                <th className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5"
                  />
                </th>
              )}
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Area/Block</th>
              <th className="border p-2">Latitude</th>
              <th className="border p-2">Longitude</th>
              <th className="border p-2">Flow Rate</th>
              <th className="border p-2">Offset</th>
              <th className="border p-2">Current Pressure</th>
              <th className="border p-2">Min Pressure</th>
              <th className="border p-2">Max Pressure</th>
              {editMode && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={editMode ? 12 : 11} className="text-center py-4 text-gray-500">
                  No pump data found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-gray-100 ${editMode || deleteMode ? 'bg-yellow-50' : ''}`}
                  onClick={() => {
                    if (!editMode && !deleteMode) navigate(`/pumps/${p.id}`);
                  }}
                >
                  {deleteMode && (
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="w-5 h-5"
                      />
                    </td>
                  )}
                  <td className="border p-2">Pump {p.name}</td>
                  <td className="border p-2">{p.type}</td>
                  <td className="border p-2">Area {p.area}</td>
                  <td className="border p-2">{p.latitude}</td>
                  <td className="border p-2">{p.longitude}</td>
                  <td className="border p-2">{p.flowRate} GPM</td>
                  <td className="border p-2">{p.offset} sec</td>
                  <td className="border p-2">{p.pressureCurrent} psi</td>
                  <td className="border p-2">{p.pressureMin} psi</td>
                  <td className="border p-2">{p.pressureMax} psi</td>
                  {editMode && (
                    <td className="border p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(p);
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Trash2, Edit2, Save, X, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DynamicCRUD = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([{ key: '', value: '' }]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await API.get('/data');
      setRecords(data);
    } catch (error) {
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (isEdit = false) => {
    if (isEdit) {
      setEditFields([...editFields, { key: '', value: '' }]);
    } else {
      setFields([...fields, { key: '', value: '' }]);
    }
  };

  const handleRemoveField = (index, isEdit = false) => {
    if (isEdit) {
      setEditFields(editFields.filter((_, i) => i !== index));
    } else {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, val, isEdit = false) => {
    if (isEdit) {
      const newFields = [...editFields];
      newFields[index][field] = val;
      setEditFields(newFields);
    } else {
      const newFields = [...fields];
      newFields[index][field] = val;
      setFields(newFields);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataObj = {};
    fields.forEach(({ key, value }) => {
      if (key.trim()) dataObj[key.trim()] = value;
    });

    if (Object.keys(dataObj).length === 0) {
      return toast.error('Please add at least one valid key-value pair');
    }

    try {
      await API.post('/data', { data: dataObj });
      toast.success('Record created successfully');
      setFields([{ key: '', value: '' }]);
      fetchRecords();
    } catch (error) {
      toast.error('Failed to create record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await API.delete(`/data/${id}`);
        toast.success('Record deleted');
        fetchRecords();
      } catch (error) {
        toast.error('Failed to delete record');
      }
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    const mappedFields = Object.entries(record.data).map(([key, value]) => ({ key, value }));
    setEditFields(mappedFields);
  };

  const handleUpdate = async (id) => {
    const dataObj = {};
    editFields.forEach(({ key, value }) => {
      if (key.trim()) dataObj[key.trim()] = value;
    });

    if (Object.keys(dataObj).length === 0) {
      return toast.error('Record cannot be empty');
    }

    try {
      await API.put(`/data/${id}`, { data: dataObj });
      toast.success('Record updated successfully');
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      toast.error('Failed to update record');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-primary-600 p-3 rounded-2xl text-white">
          <Database className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dynamic Data Management</h1>
          <p className="text-gray-500">Flexible CRUD Operations with Schema.Types.Mixed</p>
        </div>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Key (e.g. name, age, product)"
                className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500 outline-none"
                value={field.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Value"
                className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500 outline-none"
                value={field.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                required
              />
              {fields.length > 1 && (
                <button type="button" onClick={() => handleRemoveField(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => handleAddField(false)} className="flex items-center gap-2 text-primary-600 font-bold px-4 py-2 hover:bg-primary-50 rounded-xl transition">
              <Plus className="w-5 h-5" /> Add Field
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save className="w-5 h-5" /> Save Record
            </button>
          </div>
        </form>
      </div>

      {/* READ / UPDATE / DELETE LIST */}
      <h2 className="text-xl font-bold mb-6 text-gray-800">Stored Records</h2>
      {loading ? (
        <div className="text-center py-10 animate-pulse text-primary-600 font-bold">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="bg-gray-50 p-10 text-center rounded-3xl border border-dashed border-gray-200 text-gray-500">
          No records found. Create one above!
        </div>
      ) : (
        <div className="grid gap-6">
          {records.map((record) => (
            <motion.div key={record._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                {editingId === record._id ? (
                  <div className="space-y-3">
                    {editFields.map((field, index) => (
                      <div key={index} className="flex gap-3">
                        <input type="text" className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm" value={field.key} onChange={(e) => handleChange(index, 'key', e.target.value, true)} />
                        <input type="text" className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm" value={field.value} onChange={(e) => handleChange(index, 'value', e.target.value, true)} />
                        <button onClick={() => handleRemoveField(index, true)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => handleAddField(true)} className="text-primary-600 text-sm font-bold flex items-center gap-1 mt-2 hover:underline">
                      <Plus className="w-4 h-4" /> Add Field
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-sm overflow-x-auto">
                    <pre>{JSON.stringify(record.data, null, 2)}</pre>
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-3 font-bold">ID: {record._id}</div>
              </div>

              <div className="flex md:flex-col gap-3 justify-center">
                {editingId === record._id ? (
                  <>
                    <button onClick={() => handleUpdate(record._id)} className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-200" title="Save">
                      <Save className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-300 transition" title="Cancel">
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(record)} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 transition" title="Edit">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(record._id)} className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 transition" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicCRUD;

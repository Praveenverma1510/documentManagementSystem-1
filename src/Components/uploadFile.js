import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/UploadDocument.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TagInput from './textInput';
import { Autocomplete, TextField, Chip } from '@mui/material';



export const UploadDocument = () => {
    const token = localStorage.getItem('token');

    const majorHeadOptions = [
        { value: 'Personal', label: 'Personal', icon: '👤' },
        { value: 'Professional', label: 'Professional', icon: '💼' }
    ];

    const personalOptions = ['John', 'Tom', 'Emily', 'Sarah', 'Michael'].map(name => ({
        value: name,
        label: name
    }));

    const professionalOptions = ['Accounts', 'HR', 'IT', 'Finance', 'Marketing'].map(dept => ({
        value: dept,
        label: dept
    }));

    const dummyTags = [
        { tag_name: 'important' },
        { tag_name: 'contract' },
        { tag_name: 'financial' },
        { tag_name: 'personal' },
        { tag_name: 'work' },
        { tag_name: 'urgent' },
        { tag_name: 'review' },
        { tag_name: 'signed' },
        { tag_name: 'draft' },
        { tag_name: 'final' }
    ];

    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategory, setSubCategory] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [category, setCategory] = useState('');
    const [inputTag, setInputTag] = useState('');
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [documentDate, setDocumentDate] = useState(new Date());
    const [inputDocumentDate, setInputDocumentDate] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (category === 'Personal') {
            setCategoryOptions(personalOptions);
        } else if (category === 'Professional') {
            setCategoryOptions(professionalOptions);
        } else {
            setCategoryOptions([]);
        }
        setSubCategory('');
    }, [category]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);

            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setPreviewUrl(event.target.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreviewUrl('');
            }
        }
    };

    const fetchTags = useCallback(async (value) => {
        try {

            const response = await axios.post(
                'https://apis.allsoft.co/api/documentManagement/documentTags',
                { term: value },
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const fetchedTags = response?.data?.map(tag => tag.tag_name);
            setSuggestedTags(fetchedTags || []);

        } catch (err) {
            console.error('Failed to fetch tags:', err);
            setSuggestedTags([]);
        }
    }, [token]);

    const debounce = (func, delay) => {
        return function (...args) {
            if (typingTimeout) clearTimeout(typingTimeout);
            const timeout = setTimeout(() => func.apply(this, args), delay);
            setTypingTimeout(timeout);
        };
    };

    const debouncedFetchTags = useCallback(
        debounce((value) => {
            console.log(value);
            if (value.length > 0) {
                fetchTags(value);
            } else {
                setSuggestedTags([]);
            }
        }, 300),
        [fetchTags]
    );
    const handleTagInputChange = (e) => {
        const value = e.target.value;
        console.log(value)
        setInputTag(value);
        debouncedFetchTags(value);
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag.tag_name !== tagToRemove));
    };

    const addTag = (tag) => {
        if (tag && !tags.some(t => t.tag_name === tag)) {
            setTags([...tags, { tag_name: tag }]);
        }
        setInputTag('');
        setSuggestedTags([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        if (!file) {
            setError('Please select a file to upload');
            setLoading(false);
            return;
        }

        if (!category || !subCategory) {
            setError('Please select both major and minor categories');
            setLoading(false);
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only JPEG, PNG, and PDF files are allowed');
            setLoading(false);
            return;
        }

        const formattedDate = [
            String(documentDate?.getDate()).padStart(2, '0'),
            String(documentDate.getMonth() + 1).padStart(2, '0'),
            documentDate.getFullYear()
        ].join('-');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify({
            major_head: category,
            minor_head: subCategory,
            document_date: formattedDate,
            document_remarks: remarks,
            tags: tags,
        }));

        try {
            const response = await axios.post(
                'https://apis.allsoft.co/api/documentManagement/saveDocumentEntry',
                formData,
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.status) {
                setFile(null);
                setFileName('');
                setPreviewUrl('');
                setCategory('');
                setSubCategory('');
                setTags([]);
                setRemarks('');
                setDocumentDate('');
                alert("File added successfully")
            } else {
            }
        } catch (err) {
            console.error('Upload error:', err);
        }
        setLoading(false);
    };


    const handleChange = (e) => {
        const value = e.target.value;
        setInputDocumentDate(value)
        if (value.length === 10) {
            const [year, month, day] = value.split('-');
            setDocumentDate(`${day}-${month}-${year}`);
            console.log(`${day}-${month}-${year}`)
        } else {
            setDocumentDate(value);
        }
    };

    const handleTagsChange = (onTagsChange) => {
        setTags(onTagsChange)
        addTag(onTagsChange)
    }

    return (
        <div className="upload-container">
            <div className="upload-card">
                <div className="upload-header">
                    <h2>Upload Document</h2>
                    <p>Fill in the details to upload your document</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* Left Column - File Upload */}
                        <div className="col-lg-6">
                            <div className="upload-section">
                                <h5 className="section-title">Document Details</h5>

                                <div className="mb-4">
                                    <label className="form-label">Document File (PDF or Image)</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="file-input"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            required
                                        />

                                        <label htmlFor="fileInput" className="file-upload-label">
                                            {fileName ? (
                                                <div className="file-selected">
                                                    <i className="bi bi-file-earmark-text"></i>
                                                    <span>{fileName}</span>
                                                </div>
                                            ) : (
                                                <div className="file-placeholder">
                                                    <i className="bi bi-cloud-arrow-up"></i>
                                                    <span>Click to browse or drag and drop</span>
                                                    <small>Supports: PDF, JPG, PNG</small>
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    {previewUrl && (
                                        <div className="file-preview mt-3">
                                            <img src={previewUrl} alt="Document preview" className="img-thumbnail" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Document Date</label>
                                    <DatePicker
                                        selected={documentDate}
                                        onChange={(date) => setDocumentDate(date)}
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        placeholder="dd-MM-yyyy"
                                        maxDate={new Date()}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="upload-section">
                                <h5 className="section-title">Document Information</h5>

                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {majorHeadOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {category === 'Personal' ? 'Name' : 'Department'}
                                    </label>
                                    <select
                                        className="form-select"
                                        value={subCategory}
                                        onChange={(e) => setSubCategory(e.target.value)}
                                        disabled={!category}
                                        required
                                    >
                                        <option value="">
                                            Select {category === 'Personal' ? 'Name' : 'Department'}
                                        </option>
                                        {categoryOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tags</label>
                                    <div className="tags-container mb-2">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary tag-item">
                                                {tag.tag_name}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white btn-sm ms-2"
                                                    aria-label="Remove"
                                                    onClick={() => removeTag(tag.tag_name)}
                                                ></button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="tag-input-container">

                                        <TagInput onTagsChange={handleTagsChange} />
                                        {suggestedTags.length > 0 && (
                                            <div className="tag-suggestions">
                                                {suggestedTags.map((tag, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm me-2 mb-2"
                                                        onClick={() => addTag(tag)}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Remarks</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Add any additional notes about this document..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="upload-footer">
                        <button
                            type="submit"
                            className="btn btn-primary upload-button"
                            disabled={loading || !file || !documentDate || !category || !subCategory}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-upload me-2"></i>
                                    Upload Document
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
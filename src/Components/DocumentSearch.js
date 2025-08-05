import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../Components/css/DocumentSearch.css';
import axios from 'axios';

export const DocumentSearch = () => {
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
    { value: 'Invoice', label: 'Invoice', color: 'primary' },
    { value: 'Salary', label: 'Salary', color: 'success' },
    { value: 'Meeting', label: 'Meeting', color: 'info' },
    { value: 'Project', label: 'Project', color: 'warning' },
    { value: 'Personal', label: 'Personal', color: 'danger' },
    { value: 'Work', label: 'Work', color: 'secondary' },
    { value: 'Budget', label: 'Budget', color: 'dark' },
    { value: 'Contract', label: 'Contract', color: 'primary' },
    { value: 'Report', label: 'Report', color: 'success' },
    { value: 'Presentation', label: 'Presentation', color: 'info' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategory, setSubCategory] = useState('');
  const [category, setCategory] = useState('');
  const [inputTag, setInputTag] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));


  const sampleResults = [
    {
      id: 1,
      fileName: 'Financial-Report.pdf',
      fileUrl: '/assets/dumy_pdf.pdf',
      category: 'Professional',
      subCategory: 'Finance',
      tags: ['Report', 'Budget'],
      date: '2023-05-15',
      remarks: 'Q2 financial report with projections'
    },
    {
      id: 2,
      fileName: 'Vacation-Photos.pdf',
      fileUrl: '/assets/dumy_pdf.pdf',
      category: 'Personal',
      subCategory: 'Emily',
      tags: ['Personal'],
      date: '2023-06-22',
      remarks: 'Summer vacation in Hawaii'
    },
    {
      id: 3,
      fileName: 'Project-Proposal.pdf',
      fileUrl: '/assets/dumy_pdf.pdf',
      category: 'Professional',
      subCategory: 'IT',
      tags: ['Project', 'Presentation'],
      date: '2023-04-10',
      remarks: 'New software development project'
    }
  ];

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    if (selectedCategory === 'Personal') {
      setCategoryOptions(personalOptions);
    } else if (selectedCategory === 'Professional') {
      setCategoryOptions(professionalOptions);
    } else {
      setCategoryOptions([]);
    }
    setSubCategory('');
  };

  const handleTagInput = (value) => {
    setInputTag(value);
    if (value.trim() !== '') {
      const filtered = dummyTags.filter(tag =>
        tag.label.toLowerCase().includes(value.toLowerCase()) &&
        !selectedTags.some(t => t.value === tag.value)
      );
      setSuggestedTags(filtered);
    } else {
      setSuggestedTags([]);
    }
  };

  const addTag = (tag) => {
    if (!selectedTags.find(t => t.value === tag.value)) {
      setSelectedTags([...selectedTags, tag]);
      setInputTag('');
      setSuggestedTags([]);
    }
  };

  const removeTag = (tagValue) => {
    setSelectedTags(selectedTags.filter(t => t.value !== tagValue));
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!dateFrom || !dateTo) {
      setLoading(false);
      return;
    }

    const fromdateDate = [
      String(dateFrom.getDate()).padStart(2, '0'),
      String(dateFrom.getMonth() + 1).padStart(2, '0'),
      dateFrom.getFullYear()
    ].join('-');

    const toDateDate = [
      String(dateTo.getDate()).padStart(2, '0'),
      String(dateTo.getMonth() + 1).padStart(2, '0'),
      dateTo.getFullYear()
    ].join('-');

    try {
      const response = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/searchDocumentEntry',
        {
          major_head: category || undefined,
          minor_head: subCategory || undefined,
          from_date: fromdateDate,
          to_date: toDateDate,
          tags: inputTag.length > 0 ? inputTag : undefined,
          start: 0,
          length: 10
        },
        { headers: { token } }
      );

      setSearchResults(response.data.data || sampleResults);
      setTimeout(() => {
        setSearchResults(sampleResults);
        setLoading(false);
      }, 1000);
    } catch (err) {
    }
    setLoading(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setSubCategory('');
    setSelectedTags([]);
    setDateFrom('');
    setDateTo('');
    setSearchResults([]);
  };

  const handleViewPdf = (pdfUrl) => {
    const publicUrl = process.env.PUBLIC_URL + pdfUrl;
    window.open(publicUrl, '_blank');
  };

  const handleDownload = (pdfUrl, fileName) => {
    const publicUrl = process.env.PUBLIC_URL + pdfUrl;
    const link = document.createElement('a');
    link.href = publicUrl;
    link.target = '_blank';
    link.download = fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (searchResults.length === 0) return;

    setDownloadingAll(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder("documents");

      const downloadPromises = searchResults.map(async (doc) => {
        const response = await fetch(doc.fileUrl);
        const blob = await response.blob();
        folder.file(doc.fileName, blob);
      });

      await Promise.all(downloadPromises);

      const content = await zip.generateAsync({ type: 'blob' });
      FileSaver.saveAs(content, 'documents.zip');

    } catch (error) {
      console.log(error)
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-card">
        <div className="search-header">
          <h2>Search Documents</h2>
          <p>Find documents by applying filters</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="search-section">
                <h5 className="section-title">Search Filters</h5>

                <div className="mb-3">
                  <label className="form-label">Search Term</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by document name or remarks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date Range</label>
                  <div className="row g-2">
                    <div className="col">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="From"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="To"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <div className="category-select">
                    {majorHeadOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`category-option ${category === option.value ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(option.value)}
                      >
                        <span className="category-icon">{option.icon}</span>
                        <span className="category-label">{option.label}</span>
                      </div>
                    ))}
                  </div>
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
                  >
                    <option value="">
                      All {category === 'Personal' ? 'Names' : 'Departments'}
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
                    {selectedTags.map((tag) => (
                      <span key={tag.value} className={`badge bg-${tag.color} tag-item`}>
                        {tag.label}
                        <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          aria-label="Remove"
                          onClick={() => removeTag(tag.value)}
                        ></button>
                      </span>
                    ))}
                  </div>

                  <div className="tag-input-container">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type to search tags..."
                      value={inputTag}
                      onChange={(e) => handleTagInput(e.target.value)}
                    />
                    {suggestedTags.length > 0 && (
                      <div className="tag-suggestions">
                        {suggestedTags.map((tag) => (
                          <button
                            key={tag.value}
                            type="button"
                            className={`badge bg-${tag.color} tag-suggestion`}
                            onClick={() => addTag(tag)}
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="search-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="section-title mb-0">Search Results</h5>
                  <div>
                    {searchResults.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline-primary me-2"
                        onClick={handleDownloadAll}
                        disabled={downloadingAll}
                      >
                        {downloadingAll ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Preparing Download...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-download me-2"></i>
                            Download All
                          </>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-secondary me-2"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary search-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 ? (
                  <div className="results-list">
                    {searchResults.map((doc) => (
                      <div key={doc.id} className="document-card">
                        <div className="document-icon">
                          <i className="bi bi-file-earmark-pdf text-danger"></i>
                        </div>
                        <div className="document-details">
                          <h6 className="document-title">{doc.fileName}</h6>
                          <div className="document-meta">
                            <span className="badge bg-light text-dark">
                              {doc.category} / {doc.subCategory}
                            </span>
                            <span className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {new Date(doc.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="document-tags">
                            {doc.tags.map((tag, index) => {
                              const tagInfo = dummyTags.find(t => t.label === tag);
                              return tagInfo ? (
                                <span key={index} className={`badge bg-${tagInfo.color} me-1`}>
                                  {tag}
                                </span>
                              ) : null;
                            })}
                          </div>
                          {doc.remarks && (
                            <p className="document-remarks">
                              <small>{doc.remarks}</small>
                            </p>
                          )}
                        </div>
                        <div className="document-actions">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                          >
                            <i className="bi bi-download"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={() => handleViewPdf(doc.fileUrl)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <div className="no-results-content">
                      <i className="bi bi-search"></i>
                      <h5>No documents found</h5>
                      <p className="text-muted">
                        {loading ? 'Searching...' : 'Apply filters and click Search to find documents'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};
import React, { useEffect, useState, useRef } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import axios from 'axios';

const TagInput = ({ onTagsChange }) => {
    const [tags, setTags] = useState([]); 
    const [options, setOptions] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const debounceRef = useRef(null);

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

    const fetchDocumentTags = async (term) => {
        try {
            const response = await axios.post(
                'https://apis.allsoft.co/api/documentManagement/documentTags',
                { term },
                {
                    headers: {
                        token: token,
                    },
                }
            );

            console.log('API response:', response?.data);

            const fetchedOptions = Array.isArray(response?.data) ? response?.data : dummyTags;
            setOptions(fetchedOptions);
        } catch (error) {
            console.error('Tag fetch error:', error);
            setOptions([]);
        }
    };

    const handleInputChange = (event, value) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (value && value.length > 0) {
                fetchDocumentTags(value);
            } else {
                setOptions([]);
            }
        }, 300);

    };

    const handleChange = (event, value) => {
        if (value && !tags.some(t => t.tag_name === value)) {
            setTags([...tags, { tag_name: value }]);
        }
        setTags(value);
        onTagsChange?.(tags);
    };

    return (
        <Autocomplete
            multiple
            freeSolo
            options={options}
            value={tags}
            onChange={handleChange}
            onInputChange={handleInputChange}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Type to search tags"
                />
            )}
        />


    );
};

export default TagInput;

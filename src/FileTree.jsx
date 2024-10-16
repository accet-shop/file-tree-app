// src/FileTree.js
import React, { useState, useEffect } from 'react';
import sampleData from './matchedFileTree.json'; // Import JSON data
import { groups } from './groups'; // Import groups
import './FileTree.css'; // Import CSS for styling

const FileTree = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        // Load data from local storage or use imported JSON data
        const storedData = localStorage.getItem('fileTreeData');
        setData(storedData ? JSON.parse(storedData) : sampleData);
    }, []);

    const handleCheckboxChange = (path, completed) => {
        const updateData = (obj) => {
            for (const key in obj) {
                if (obj[key].path === path) {
                    obj[key].completed = completed;
                } else if (typeof obj[key] === 'object') {
                    updateData(obj[key]);
                }
            }
        };

        const newData = { ...data };
        updateData(newData);
        setData(newData);
        localStorage.setItem('fileTreeData', JSON.stringify(newData));
    };

    const groupFiles = (node) => {
        const grouped = {};

        const traverse = (obj) => {
            for (const key in obj) {
                const entry = obj[key];
                if ('fileName' in entry) {
                    const groupId = entry.groupId || 0;
                    if (!grouped[groupId]) {
                        grouped[groupId] = [];
                    }
                    grouped[groupId].push(entry);
                } else {
                    traverse(entry);
                }
            }
        };

        traverse(node);
        return grouped;
    };

    const renderGroupedFiles = (groupedData) => {
        return Object.keys(groupedData).map((groupId) => {
            const groupTitle = groups.find((g) => g.id === parseInt(groupId))?.title || 'Ungrouped';
            return (
                <div key={groupId}>
                    <h2>{groupTitle}</h2>
                    <table className="file-tree-table">
                        <thead>
                        <tr>
                            <th>Completed</th>
                            <th>File Name</th>
                            <th>Path</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupedData[groupId].map((entry) => (
                            <tr key={entry.path}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={entry.completed}
                                        onChange={(e) => handleCheckboxChange(entry.path, e.target.checked)}
                                    />
                                </td>
                                <td>{entry.fileName}</td>
                                <td>{entry.path}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            );
        });
    };

    const groupedData = groupFiles(data);

    return <div>{renderGroupedFiles(groupedData)}</div>;
};

export default FileTree;

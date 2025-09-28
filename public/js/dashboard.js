// Check if user is logged in
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token) {
    // Redirect to login if not authenticated
    window.location.href = '/login.html';
}

// Set up authorization header for API calls
const authHeader = {
    'Authorization': token
};

// DOM elements
const fileList = document.getElementById('file-list');
const filePreview = document.getElementById('file-preview');
const previewContent = document.getElementById('preview-content');
const commentsList = document.getElementById('comments-list');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const logoutLink = document.getElementById('logout-link');
const commentText = document.getElementById('comment-text');
const addCommentBtn = document.getElementById('add-comment-btn');

// Current file being previewed
let currentFileId = null;

// Logout functionality
logoutLink?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});

// Upload file functionality
uploadBtn?.addEventListener('click', function() {
    fileInput.click();
});

fileInput?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('File uploaded successfully!');
            loadFiles(); // Refresh file list
        } else {
            alert('Upload failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during upload');
    }
});

// Add comment functionality
addCommentBtn?.addEventListener('click', async function() {
    if (!currentFileId) return;
    
    const content = commentText.value.trim();
    if (!content) {
        alert('Please enter a comment');
        return;
    }
    
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/comments/file/${currentFileId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ content })
        });
        
        const comment = await response.json();
        
        if (response.ok) {
            commentText.value = '';
            loadComments(currentFileId); // Refresh comments
        } else {
            alert('Failed to add comment: ' + comment.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the comment');
    }
});

// Load files on page load
document.addEventListener('DOMContentLoaded', loadFiles);

// Load all files
async function loadFiles() {
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/files`, {
            headers: {
                'Authorization': token
            }
        });
        
        const files = await response.json();
        
        if (response.ok) {
            renderFileList(files);
        } else {
            console.error('Failed to load files:', files.message);
        }
    } catch (error) {
        console.error('Error loading files:', error);
    }
}

// Render file list
function renderFileList(files) {
    fileList.innerHTML = '';
    
    if (files.length === 0) {
        fileList.innerHTML = '<tr><td colspan="5">No files found</td></tr>';
        return;
    }
    
    files.forEach(file => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.originalName}</td>
            <td>${formatFileSize(file.size)}</td>
            <td>${file.uploader?.username || 'Unknown'}</td>
            <td>${new Date(file.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn" onclick="previewFile(${file.id})">View</button>
                <button class="btn" onclick="downloadFile(${file.id})">Download</button>
                ${(user.role === 'admin' || file.uploaderId === user.id) ? 
                    `<button class="btn" onclick="deleteFile(${file.id})">Delete</button>` : ''}
            </td>
        `;
        fileList.appendChild(row);
    });
}

// Preview file
async function previewFile(fileId) {
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/files/${fileId}`, {
            headers: {
                'Authorization': token
            }
        });
        
        const file = await response.json();
        
        if (response.ok) {
            currentFileId = fileId;
            
            previewContent.innerHTML = `
                <h4>${file.originalName}</h4>
                <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                <p><strong>Uploaded by:</strong> ${file.uploader?.username || 'Unknown'}</p>
                <p><strong>Uploaded on:</strong> ${new Date(file.createdAt).toLocaleString()}</p>
                <p><strong>File type:</strong> ${file.mimeType}</p>
            `;
            
            filePreview.style.display = 'block';
            
            // Load comments for this file
            loadComments(fileId);
        } else {
            alert('Failed to load file: ' + file.message);
        }
    } catch (error) {
        console.error('Error loading file:', error);
        alert('An error occurred while loading the file');
    }
}

// Load comments for a file
async function loadComments(fileId) {
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/comments/file/${fileId}`, {
            headers: {
                'Authorization': token
            }
        });
        
        const comments = await response.json();
        
        if (response.ok) {
            renderComments(comments, fileId);
        } else {
            console.error('Failed to load comments:', comments.message);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Render comments
function renderComments(comments, fileId) {
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p>No comments yet.</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <p><strong>${comment.user?.username || 'Unknown'}:</strong> ${comment.content}</p>
            <small>${new Date(comment.createdAt).toLocaleString()}</small>
            ${(user.role === 'admin' || comment.userId === user.id) ? 
                `<button class="btn" onclick="deleteComment(${comment.id}, ${fileId})">Delete</button>` : ''}
        `;
        commentsList.appendChild(commentElement);
    });
}

// Download file
function downloadFile(fileId) {
    window.open(`${window.API_CONFIG.BASE_URL}/api/files/${fileId}/download`, '_blank');
}

// Delete file
async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }
    
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('File deleted successfully!');
            loadFiles(); // Refresh file list
            filePreview.style.display = 'none'; // Hide preview
            currentFileId = null;
        } else {
            alert('Delete failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during deletion');
    }
}

// Delete comment
async function deleteComment(commentId, fileId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            loadComments(fileId); // Refresh comments
        } else {
            alert('Delete failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during deletion');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
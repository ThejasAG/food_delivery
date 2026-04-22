const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  // Use the same host as the API but remove /api
  return `http://127.0.0.1:5000${imagePath}`;
};

export default getImageUrl;
